import React from 'react';
import PropTypes from 'prop-types';
import {HEADER_BAR_END, HEADER_BAR_START, themes} from '../../constants/colors';
import StatusBar from '../../containers/StatusBar';
import {withTheme} from '../../theme';
import {Image, ImageBackground, Linking, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import images from '../../assets/images';
import styles from './styles';
import {connect} from 'react-redux';
import {setUser as setUserAction} from '../../actions/login';
import ActivityIndicator from '../../containers/ActivityIndicator';
import {isValidURL} from '../../utils/validators';
import firebaseSdk, {
    DB_ACTION_ADD,
    DB_ACTION_DELETE,
    DB_ACTION_UPDATE,
    NOTIFICATION_TYPE_FOLLOW, NOTIFICATION_TYPE_LIKE,
} from '../../lib/firebaseSdk';
import {showErrorAlert, showToast} from '../../lib/info';
import firestore from '@react-native-firebase/firestore';
import sharedStyles from '../Styles';
import SafeAreaView from '../../containers/SafeAreaView';
import {withActionSheet} from '../../containers/ActionSheet';
import Post from '../HomeView/Post';
import {GradientHeader} from '../../containers/GradientHeader';
import LinearGradient from 'react-native-linear-gradient';
import {VectorIcon} from '../../containers/VectorIcon';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import I18n from '../../i18n';

class OtherProfileView extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'VIP Billionaires',
        headerBackground: () => <GradientHeader/>
    })

    static propTypes = {
        setUser: PropTypes.func,
        user: PropTypes.object,
        theme: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.mounted = false;

        const userId = props.route.params?.userId;
        this.state = {
            account: {
                userId: userId,
            },
            posts: [],
            actionPost: null,
            image_path: null,
            isLoading: true
        };

        // Actions
        this.options = [
            {
                title: I18n.t('Report_post'),
                onPress: this.onReport
            },
            {
                title: I18n.t('Block_user'),
                danger: true,
                onPress: this.onBlock
            }
        ];

        this.init();
    }

    componentDidMount() {
        this.mounted = true;
    }

    setSafeState(states){
        if(this.mounted){
            this.setState(states);
        } else {
            this.state = {...this.state, ...states};
        }
    }

    init = () => {
        const { navigation } = this.props;
        firebaseSdk.getUser(this.state.account.userId)
            .then(user => {
                firestore().collection(firebaseSdk.TBL_POST).where('userId', '==', this.state.account.userId).get().then(querySnap => {
                    let posts = [];
                    querySnap.forEach(doc => { posts.push({id: doc.id, ...doc.data(), owner: user})});
                    this.setSafeState({account: user, isLoading: false, posts});
                });
            })
            .catch(err => {
                this.setSafeState({isLoading: false});
                showErrorAlert('User not found.', '', () => navigation.pop());
            })
    }

    openLink = (url) => {
        if(url && url.length > 0 && isValidURL(url)){
            Linking.openURL(url);
        }
    }

    onToggleFollow = (following) => {
        const {user, setUser} = this.props;
        const {account} = this.state;

        this.setState({loading: true});
        firebaseSdk.updateFollows(user.id, account.id, following?DB_ACTION_DELETE: DB_ACTION_ADD)
            .then(({myFollowings, userFollowers}) => {
                if(!following){
                    const activity = {
                        type: NOTIFICATION_TYPE_FOLLOW,
                        sender: user.userId,
                        receiver: account.userId,
                        content: '',
                        postId: null,
                        title: account.displayName,
                        message: `${user.displayName} follows you.`,
                        date: new Date()
                    }
                    firebaseSdk.addActivity(activity, account.token).then(r => {});
                }
                setUser({followings: myFollowings});
                const newAccount = {...account, followers: userFollowers};
                this.setState({loading: false, account: newAccount});
            })
            .catch(err => {
                this.setState({loading: false});
            })
    }

    onToggleAction = () => {
        const { showActionSheet } = this.props;
        showActionSheet({ options: this.options });
    }

    onReport = () => {
        const {user} = this.props;
        const {account, actionPost} = this.state;

        const report = {
            userId: user.userId,
            postId: actionPost?actionPost.id:null,
            ownerId: account.userId,
            createdAt: new Date()
        };

        this.setState({isLoading: true});
        firebaseSdk.setData(firebaseSdk.TBL_REPORTS, DB_ACTION_ADD, report)
            .then(() => {
                showToast(actionPost?I18n.t('Report_post_complete'):I18n.t('Report_user_complete'));
                this.setState({isLoading: false, actionPost: null});
            })
            .catch(err => {
                showErrorAlert(actionPost?I18n.t('Report_post_failed'):I18n.t('Report_user_failed'), I18n.t('Oops'));
                this.setState({isLoading: false, actionPost: null});
            })
    }

    onBlock = () => {
        const {account} = this.state;
        const {user, setUser} = this.props;

        let blocked = user.blocked??[];
        let update = {id: user.id, blocked:[...blocked, account.userId]};

        this.setState({isLoading: true});
        firebaseSdk.setData(firebaseSdk.TBL_USER, DB_ACTION_UPDATE, update)
            .then(() => {
                setUser({blocked: update.blocked});
                showToast(I18n.t('Block_user_complete'));
                this.setState({isLoading: false, actionPost: null});
                this.props.navigation.pop();
            })
            .catch(err => {
                showErrorAlert(I18n.t('Block_user_failed'), I18n.t('Oops'));
                this.setState({isLoading: false, actionPost: null});
            })
    }

    sendMessage = async () => {
        const {user, navigation} = this.props;
        const {account} = this.state;
        const roomSnaps = await firestore().collection(firebaseSdk.TBL_ROOM).get();
        let room = null;
        roomSnaps.forEach(doc => {
            const roomInfo = doc.data();
            if ((user.userId === roomInfo.sender && account.userId === roomInfo.receiver) ||
                (user.userId === roomInfo.receiver && account.userId === roomInfo.sender)) {
                room = {id: doc.id, ...roomInfo, account};
            }
        });

        if(!room){
            room = {
                sender: user.userId,
                receiver: account.userId,
                date: new Date(),
                lastMessage: "",
                confirmUser: "",
                unReads: 0
            }
            const roomDocRef = await firestore().collection(firebaseSdk.TBL_ROOM).add(room);
            const roomDoc = await roomDocRef.get();
            return navigation.navigate("Chat", {room: {id: roomDoc.id, ...roomDoc.data(), account}});
        }
        navigation.navigate('Chat', {room});
    }

    goToFollowers = async () => {
        const {navigation} = this.props;
        navigation.navigate('Follow', {type: 'followers', account: this.state.account});
    }

    goToFollowings = async () => {
        const { navigation } = this.props;
        navigation.navigate('Follow', {type: 'followings', account: this.state.account});
    }

    onOpenPost = (item) => {
        this.props.navigation.push('PostDetail', {post: item});
    }

    onSharePost = (item) => {

    }

    onToggleLike = (item, isLiking) => {
        const {user} = this.props;

        let update = {};
        if(isLiking){
            update = {id: item.id, likes : item.likes.filter(l => l !== user.userId)};
        } else {
            update = {id: item.id, likes : [...item.likes, user.userId]};
        }

        this.setState({isLoading: true});
        firebaseSdk.setData(firebaseSdk.TBL_POST, DB_ACTION_UPDATE, update)
            .then(() => {
                if(!isLiking && item.owner.userId !== user.userId){
                    const postImage = item.type === 'video'? item.thumbnail: (item.type === 'photo'?item.photo:'');
                    const activity = {
                        type: NOTIFICATION_TYPE_LIKE,
                        sender: user.userId,
                        receiver: item.owner.userId,
                        content: '',
                        postId: item.id,
                        postImage,
                        postType: item.type,
                        title: item.owner.displayName,
                        message: `${user.displayName} likes your post.`,
                        date: new Date()
                    }
                    firebaseSdk.addActivity(activity, item.owner.token).then(r => {});
                }
                this.setState({isLoading: false});
            })
            .catch(() => {
                this.setState({isLoading: false});
            })
    }

    onActionPost = (item) => {
        const { showActionSheet } = this.props;
        this.setState({actionPost: item});
        showActionSheet({ options: this.options });
    }

    render() {
        const {navigation, user, theme} = this.props;
        const {account, posts, image_path, isLoading} = this.state;
        let following = user.followings.includes(account.userId);
        return (
            <SafeAreaView style={sharedStyles.container}>
                <StatusBar/>
                <LinearGradient colors={[HEADER_BAR_START, HEADER_BAR_END]} style={sharedStyles.topLinearGradient} angle={90} useAngle/>
                    <ScrollView style={{flex: 1}}  {...scrollPersistTaps}>
                    <View style={[styles.logoContainer, {backgroundColor: themes[theme].headerSecondaryBackground}]}>
                        <Image style={styles.logo} source={images.logo}/>
                    </View>
                    <View style={styles.profileContainer}>
                        <View style={styles.mainInfo}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={image_path ? {uri: image_path} : (account.avatar ? {uri: account.avatar} : images.default_avatar)}
                                    style={styles.avatar}/>
                            </View>
                            <View style={styles.profileInfo}>
                                <View style={styles.profileHeader}>
                                    <View style={styles.profileTitle}>
                                        <Text style={styles.profileName}>{account.displayName}</Text>
                                        <TouchableOpacity onPress={() => this.onToggleAction()}>
                                            <VectorIcon name={"more-vert"} type={"MaterialIcons"} size={24} style={styles.settingIcon}/>
                                        </TouchableOpacity>
                                    </View>
                                    {(account.city && account.city.length > 0)?<Text style={{marginTop: 2, fontSize: 12}}>{account.city}</Text> : null}
                                    {
                                        (account.website && account.website.length > 0)?
                                            <TouchableOpacity style={styles.website} onPress={() => this.openLink(account.website)} >
                                                <Text style={{marginTop: 2}}>{account.website}</Text>
                                            </TouchableOpacity>:null
                                    }
                                    { (account.purpose && account.purpose.length > 0)?<Text style={styles.bio}>{account.purpose}</Text>:null}
                                </View>
                                <View style={styles.actionContainer}>
                                    <TouchableOpacity onPress={() => this.onToggleFollow(following)}>
                                        <ImageBackground source={following?images.following:images.follow} style={[styles.itemAction, {marginRight: 16}]}>
                                            <Text style={styles.actionText}>{following?'Following': 'Follow'}</Text>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.sendMessage}>
                                        <ImageBackground source={images.message_btn} style={styles.itemAction}>
                                            <Text style={styles.actionText}>Message</Text>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.options}>
                        <TouchableOpacity onPress={() => {}}
                                          style={[styles.optionContainer, styles.borderRight]}>
                            <Text style={styles.optionValue}>{posts.length}</Text>
                            <Text style={[styles.optionTitle, {color: themes[theme].infoText}]}>Posts</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.goToFollowers()}
                                          style={[styles.optionContainer]}>
                            <Text style={styles.optionValue}>{account.followers?.length??0}</Text>
                            <Text style={[styles.optionTitle, {color: themes[theme].infoText}]}>Followers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.goToFollowings()}
                                          style={[styles.optionContainer, styles.borderLeft]}>
                            <Text style={styles.optionValue}>{account.followings?.length??0}</Text>
                            <Text style={[styles.optionTitle, {color: themes[theme].infoText}]}>Followings</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexGrow: 1, marginBottom: 52}}>
                        {
                            posts.map(p => (
                                <Post
                                    key={p.id}
                                    item={p}
                                    onPress={() => this.onOpenPost(p)}
                                    onPressUser={() => {}}
                                    onPressShare={() => this.onSharePost(p)}
                                    onLike={(isLiking) => this.onToggleLike(p, isLiking)}
                                    isLiking={p.likes && p.likes.includes(user.userId)}
                                    onPressAction={() => this.onActionPost(p)}
                                    theme={theme}/>
                            ))
                        }
                    </View>
                    {isLoading ? <ActivityIndicator absolute size="large" theme={theme}/> : null}
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => ({
    user: state.login.user,
});

const mapDispatchToProps = dispatch => ({
    setUser: params => dispatch(setUserAction(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withActionSheet(withTheme(OtherProfileView)));
