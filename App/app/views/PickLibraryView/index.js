import React from 'react';
import PropTypes from 'prop-types';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";

import {withTheme} from "../../theme";
import sharedStyles from "../Styles";
import StatusBar from "../../containers/StatusBar";
import styles from "./styles";
import SafeAreaView from "../../containers/SafeAreaView";
import {showErrorAlert, showToast} from "../../lib/info";
import {setUser as setUserAction} from "../../actions/login";
import * as HeaderButton from '../../containers/HeaderButton';
import CsTextInput from '../../containers/CsTextInput';
import ActivityIndicator from '../../containers/ActivityIndicator';
import {POST_TYPE_PHOTO, POST_TYPE_TEXT, POST_TYPE_VIDEO} from '../../constants/app';
import Video from 'react-native-video';
import firebaseSdk, {DB_ACTION_ADD} from '../../lib/firebaseSdk';
import I18n from '../../i18n';
import {VectorIcon} from '../../containers/VectorIcon';
import {GradientHeader} from '../../containers/GradientHeader';
import LinearGradient from 'react-native-linear-gradient';
import {HEADER_BAR_END, HEADER_BAR_START} from '../../constants/colors';
import CameraRoll from '@react-native-community/cameraroll';
import Swiper from 'react-native-swiper';

class PickLibraryView extends React.Component{
    static propTypes = {
        navigation: PropTypes.object,
        user: PropTypes.object,
        setUser: PropTypes.func,
        theme: PropTypes.string
    }

    constructor(props) {
        super(props);
        const type = props.route.params?.type??POST_TYPE_PHOTO;
        this.mounted = false;
        this.state = {
            type,
            select_image_index: null,
            playing: false,
            text: '',
            isLoading: true,
            data: [],
            showGallery: false,
            currentSideIndex: null
        }
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

    init = async () => {
        const {navigation} = this.props;
        const {type} = this.state;
        navigation.setOptions({
            title: I18n.t('New_post'),
            headerRight: () => <HeaderButton.Next onPress={this.onNext} testID='rooms-list-view-sidebar' />,
            headerBackground: () => <GradientHeader/>
        });

        CameraRoll.getPhotos({
            first: 50,
            assetType: type===POST_TYPE_VIDEO?'Videos':'Photos',
        })
            .then(res => {
                const images = res.edges.map((e) => ({uri: e.node.image.uri}));
                this.setSafeState({ data: images, isLoading: false, select_image_index: images.length?0:null});
                console.log('res', res, this.state.data, this.state.select_image_index);
            })
            .catch((error) => {
                this.setSafeState({isLoading: false});
                console.log(error);
            });
    }

    onNext = () => {
        const { data, select_image_index, type } = this.state;
        const {navigation} = this.props;
        if(select_image_index !== null){
            navigation.push('CreatePost', {type: type, file_path: data[select_image_index].uri});
        }
    }

    //
    // renderForm = () => {
    //     const {type, text, file_path, thumbnail, playing} = this.state;
    //     const {theme} = this.props;
    //     switch (type){
    //         case POST_TYPE_TEXT:
    //             return (
    //                 <View style={styles.inputContainer}>
    //                     <CsTextInput
    //                         inputRef={(e) => {
    //                             this.textInput = e;
    //                         }}
    //                         containerStyle={styles.roundInput}
    //                         inputStyle={styles.textStyle}
    //                         wrapStyle={{alignItems: 'flex-start', paddingVertical: 12}}
    //                         returnKeyType='send'
    //                         keyboardType='default'
    //                         onChangeText={text => this.setState({text})}
    //                         multiline={true}
    //                         theme={theme}
    //                     />
    //                 </View>
    //             );
    //         case POST_TYPE_PHOTO:
    //             return (
    //                 <View style={styles.inputContainer}>
    //                     <Image source={{uri: file_path}} style={styles.imageStyle}/>
    //                     <CsTextInput
    //                         inputRef={(e) => {
    //                             this.textInput = e;
    //                         }}
    //                         containerStyle={styles.underlineInput}
    //                         placeholder={I18n.t('Photo_post_placeholder')}
    //                         returnKeyType='send'
    //                         keyboardType='default'
    //                         onChangeText={text => this.setState({text})}
    //                         theme={theme}
    //                     />
    //                 </View>
    //             )
    //         case POST_TYPE_VIDEO:
    //             return (
    //                 <View style={styles.inputContainer}>
    //                     {   playing &&
    //                         <Video
    //                             source={{uri: file_path}}
    //                             style={styles.video}
    //                             controls
    //                             onEnd={() => this.setState({playing: false})}
    //                             resizeMode={'contain'}/>
    //                     }
    //                     {
    //                         thumbnail && !playing &&
    //                         <View style={styles.thumbnailContainer}>
    //                             <Image
    //                                 source={{uri: thumbnail}}
    //                                 style={styles.thumbnail}
    //                                 resizeMode={'contain'}
    //                             />
    //                             <TouchableOpacity onPress={() => this.setState({playing: true})} style={[styles.playIcon, { position: 'absolute' }]}>
    //                                 <VectorIcon
    //                                     name='playcircleo'
    //                                     type={'AntDesign'}
    //                                     size={72}
    //                                     color={'white'}
    //                                 />
    //                             </TouchableOpacity>
    //                         </View>
    //                     }
    //                     <CsTextInput
    //                         inputRef={(e) => {
    //                             this.textInput = e;
    //                         }}
    //                         containerStyle={styles.underlineInput}
    //                         placeholder={I18n.t('Video_post_placeholder')}
    //                         returnKeyType='send'
    //                         keyboardType='default'
    //                         onChangeText={text => this.setState({text})}
    //                         multiline={true}
    //                         theme={theme}
    //                     />
    //                 </View>
    //             )
    //     }
    //     return null;
    // }

    renderSlides = () => {
        let sides = [];
        const {data} = this.state;
        data.forEach((item, index) => {
            sides.push(<TouchableOpacity activeOpacity={1} style={styles.slide} key={index} onPress={() => this.setState({showGallery: false})}>
                <Image source={{uri: item.uri}} style={styles.slideImage} resizeMode={'contain'}/>
            </TouchableOpacity>);
        })
        return sides;
    }

    renderImage = ({ item, index }) => (
        <TouchableOpacity onPress={() => this.setState({select_image_index: index})} style={{width: '31%', margin: 4}}>
            <Image
                key={index}
                style={{
                    width: '100%',
                    height: 140
                }}
                resizeMode={"cover"}
                source={{ uri: item.uri }}
            />
        </TouchableOpacity>
        );

    render(){
        const {theme} = this.props;
        const {isLoading, data, select_image_index, showGallery} = this.state;
        return (
            <SafeAreaView style={sharedStyles.container}>
                <StatusBar/>
                <LinearGradient colors={[HEADER_BAR_START, HEADER_BAR_END]} style={sharedStyles.topLinearGradient} angle={90} useAngle/>
                {
                    isLoading && <ActivityIndicator absolute theme={theme} size={'large'}/>
                }
                {
                    data.length ?
                        <>
                            <TouchableOpacity style={styles.selectImageContainer} onPress={() => this.setState({showGallery: true})}>
                                <Image source={{uri: data[select_image_index].uri}} style={styles.selectImage} resizeMode='contain'/>
                            </TouchableOpacity>
                            <Text style={styles.recentText}>{I18n.t('Recent')}</Text>
                            <FlatList
                                data={data}
                                style={{flex: 1}}
                                contentContainerStyle={{alignItems: 'center'}}
                                numColumns={3}
                                renderItem={this.renderImage}
                            />
                        </> :
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>{I18n.t('No_files_in_device')}</Text>
                        </View>

                }
                {
                    showGallery &&
                    <View style={styles.galleryView}>
                        <Swiper
                            loop={false}
                            index={select_image_index}
                            ref={ref => this.swipe = ref}
                            onIndexChanged={(index) => this.setState({select_image_index: index})}
                            containerStyle={styles.swipeContainer}
                        >
                            {this.renderSlides()}
                        </Swiper>
                    </View>
                }
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch =>({
    setUser: params => dispatch(setUserAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PickLibraryView));
