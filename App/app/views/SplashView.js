import React from 'react';
import {
    View,
    StyleSheet,
    PermissionsAndroid, Platform, Image, Text, ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import {appInit as appInitAction} from '../actions/app';
import images from "../assets/images";
import StatusBar from "../containers/StatusBar";
import {withTheme} from "../theme";
import PropTypes from "prop-types";
import {PERMISSIONS, requestMultiple} from "react-native-permissions";
import sharedStyles from './Styles';

const styles = StyleSheet.create({
    mainContainer: {
        flexGrow: 1,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoContainer: {
        marginTop: 120
    },
    logo: {
        height: 240,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    logoText: {
        maxWidth: '80%',
        resizeMode: 'contain',
        alignSelf: 'center',
        tintColor: 'white'
    },
});


class SplashView extends React.Component {
    static propTypes = {
        navigation: PropTypes.object,
        appInit: PropTypes.func,
        theme: PropTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {
            notShowAgain: false,
            currentIndex: 0
        }
        this.requestPermission();
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.appInit();
        }, 1500);
    }

    requestPermission = () => {
        if (Platform.OS === 'android') {
            this.requestPermissionAndroid()
                .then(() => {
                })
                .catch((err) => {
                    console.log('request permission error', err);
                })
        } else {
            this.requestPermissionIOS()
                .then(() => {
                })
                .catch((err) => {
                    console.log('request permission error', err);
                })
        }
    }

    requestPermissionAndroid = async () => {
        try {
            const results = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            ]);
            if (results[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
                results[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
                results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED) {
                // console.log('all permission granted');

            } else {
                console.log('permission denied');
            }
        } catch (err) {
            console.log(err);
        }
    };

    requestPermissionIOS = () => {
        return new Promise((resolve, reject) => {
            console.log('request permission');
            requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY]).then(
                (statuses) => {
                    console.log('request permission', statuses);
                    resolve();
                }
            ).catch((err) => {
                console.log('request permission', err);
                reject(err)
            })
        })
    }

    render() {
        const {navigation, theme} = this.props;
        return (
            <ImageBackground style={sharedStyles.container} source={images.bg_splash_back}>
                <StatusBar/>
                <View style={[styles.mainContainer]}>
                    <View style={styles.logoContainer}>
                        <Image source={images.logo} style={styles.logo}/>
                        <Image style={styles.logoText} source={images.logo_text}/>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    appInit: params => dispatch(appInitAction(params)),
});

export default connect(null, mapDispatchToProps)(withTheme(SplashView));
