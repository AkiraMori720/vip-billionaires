import React from 'react';
import PropTypes from "prop-types";
import {HEADER_BAR_END, HEADER_BAR_START, themes} from '../../constants/colors';
import StatusBar from "../../containers/StatusBar";
import SafeAreaView from "../../containers/SafeAreaView";
import {withTheme} from "../../theme";
import SearchBox from "../../containers/SearchBox";
import {FlatList, Image, ImageBackground, RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import debounce from "../../utils/debounce";
import styles from "./styles";
import {setUser as setUserAction} from "../../actions/login";
import images from "../../assets/images";
import firestore from "@react-native-firebase/firestore";
import firebaseSdk, {DB_ACTION_ADD, DB_ACTION_DELETE, NOTIFICATION_TYPE_FOLLOW} from '../../lib/firebaseSdk';
import {connect} from "react-redux";
import ActivityIndicator from "../../containers/ActivityIndicator";
import sharedStyles from '../Styles';
import I18n from '../../i18n';
import {GradientHeader} from '../../containers/GradientHeader';
import LinearGradient from "react-native-linear-gradient";


class FollowView extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Followings',
        headerBackground: () => <GradientHeader/>
    })

    static propTypes = {
        user: PropTypes.object,
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        const type = props.route.params?.type;
        const account = props.route.params?.account;
        this.mounted = false;
        this.state = {
            type: type,
            account,
            text: '',
            data: [],
            friends: [],
            searchData: [],
            refreshing: false,
            loading: true,
            updating: false,
        }
        if(type){
            props.navigation.setOptions({
                title:(type==='followings'?'Followings':'Followers'),
                headerBackground: () => <GradientHeader/>
            });
        }
        this.init();
    }

    componentDidMount() {
        this.mounted = true;
    }

    init = async () => {
        const {account} = this.state;
        const userSnaps = await firestore().collection(firebaseSdk.TBL_USER).get();
        const users = [];
        const friends = [];
        userSnaps.forEach(s => {
            const userInfo = {...s.data(), id: s.id};
            if(userInfo.userId !== account.userId){
                users.push(userInfo);
            }
            if(this.state.type === 'followings'){
                if (account.followings.includes(userInfo.userId)) {
                    friends.push(userInfo);
                }
            } else {
                if (account.followers.includes(userInfo.userId)) {
                    friends.push(userInfo);
                }
            }
        });

        if (this.mounted) {
            this.setState({data: users, friends: friends});
        } else {
            this.state.data = users;
            this.state.friends = friends;
        }
        this.search();
    }


    onSearchChangeText = (text) => {
        this.setState({text: text.trim(), loading: false});
        this.search();
    };

    search = debounce(async () => {
        const {text, data, friends} = this.state;
        // Search
        if (text.length > 0) {
            let searchData = data.filter(d => {
                const key = d.displayName;
                return key.toLowerCase().indexOf(text.toLowerCase()) >= 0;
            });
            this.setState({searchData, loading: false, refreshing: false});
        } else {
            this.setState({searchData: friends, loading: false, refreshing: false});
        }
    }, 200);

    onToggleFollow = (item, following) => {
        const {user, setUser} = this.props;
        this.setState({updating: true});
        firebaseSdk.updateFollows(user.id, item.id, following?DB_ACTION_DELETE: DB_ACTION_ADD)
            .then(({myFollowings}) => {
                if(!following){
                    const activity = {
                        type: NOTIFICATION_TYPE_FOLLOW,
                        sender: user.userId,
                        receiver: item.userId,
                        content: '',
                        postId: null,
                        title: item.displayName,
                        message: `${user.displayName} follows you.`,
                        date: new Date()
                    }
                    firebaseSdk.addActivity(activity, item.token).then(r => {});
                }
                setUser({followings: myFollowings});
                this.setState({updating: false});
            })
            .catch(err => {
                this.setState({updating: false});
            })
    }

    renderItem = ({item}) => {
        const { user } = this.props;
        let following = user.followings.includes(item.userId);
        const isSelf = user.userId === item.userId;
        return (
            <View style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                    <Image source={item.avatar ? {uri: item.avatar} : images.default_avatar}
                           style={styles.itemImage}/>
                    <View style={styles.itemContent}>
                        <Text style={styles.itemText}>{item.displayName}</Text>
                        <Text>{0} posts</Text>
                    </View>
                </View>
                {
                    !isSelf &&
                    <TouchableOpacity onPress={() => this.onToggleFollow(item, following)}>
                        <ImageBackground style={styles.itemAction} source={following?images.following:images.follow}>
                            <Text style={styles.actionText}>{following?'following': 'follow'}</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                }
            </View>
        );
    }

    renderFooter = () => {
        const { loading } = this.state;
        const { theme } = this.props;
        if (loading) {
            return <ActivityIndicator theme={theme} size={'large'}/>;
        }
        return null;
    }

    onRefresh = () => {
        this.setState({refreshing: true});
        this.init();
    }

    render() {
        const {theme} = this.props;
        const {searchData, refreshing, updating} = this.state;

        return (
            <ImageBackground style={sharedStyles.container} source={images.bg_splash_onboard}>
                <SafeAreaView>
                    <StatusBar/>
                    <SearchBox
                        onChangeText={this.onSearchChangeText}
                        onSubmitEditing={this.search}
                        testID='federation-view-search'
                        placeholder={I18n.t('Search')}
                    />
                    <LinearGradient colors={[HEADER_BAR_START, HEADER_BAR_END]} style={sharedStyles.topLinearGradient} angle={90} useAngle/>
                    {updating && <ActivityIndicator absolute theme={theme} size={'large'}/>}
                    <View style={styles.container}>
                        {searchData.length > 0 &&
                            <FlatList
                                data={searchData}
                                renderItem={this.renderItem}
                                keyExtractor={item => item.userId}
                                ListFooterComponent={this.renderFooter}
                                ItemSeparatorComponent={() => <View style={sharedStyles.listSeparator} />}
                                refreshControl={(
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={this.onRefresh}
                                        tintColor={themes[theme].actionColor}
                                    />
                                )}
                            />
                        }
                    </View>
                </SafeAreaView>
            </ImageBackground>
        )
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch => ({
    setUser: params => dispatch(setUserAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(FollowView));
