import React from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Image, Text,
} from 'react-native';
import {connect} from 'react-redux';
import {appStart as appStartAction} from '../actions/app';
import images from "../assets/images";
import StatusBar from "../containers/StatusBar";
import Button from "../containers/Button";
import {withTheme} from "../theme";
import PropTypes from "prop-types";
import I18n from "../i18n";
import {HEADER_BAR_END, HEADER_BAR_START, NAV_BAR_START, themes} from '../constants/colors';
import LinearGradient from "react-native-linear-gradient";
import sharedStyles from './Styles';

const styles = StyleSheet.create({
    mainContainer: {
        padding: 20,
        alignItems: 'center'
    },
    logoContainer: {
        marginVertical: 40,
    },
    logo: {
        height: 180,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    logoText: {
        maxWidth: '80%',
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    welcome: {
        marginTop: 60
    },
    welcomeText: {
        fontSize: 18,
        textTransform: 'uppercase',
        alignSelf: 'center'
    },
    submitBtn: {
        marginBottom: 20
    }
});


class OnBoardingView extends React.Component {
    static propTypes = {
        navigation: PropTypes.object,
        appStart: PropTypes.func,
        theme: PropTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {
            notShowAgain: false,
            currentIndex: 0
        }
    }

    render() {
        const {navigation, theme} = this.props;
        return (
            <SafeAreaView style={{backgroundColor: NAV_BAR_START}}>
                <StatusBar/>
                <LinearGradient colors={[HEADER_BAR_START, HEADER_BAR_END]} style={sharedStyles.topLinearGradient} angle={90} useAngle/>
                <View style={[styles.mainContainer, {backgroundColor: themes[theme].backgroundColor}]}>
                    <View style={styles.welcome}>
                        <Text style={styles.welcomeText}>{I18n.t('Onboard_text_welcome')}</Text>
                        <Text style={styles.welcomeText}>{I18n.t('Onboard_text')}</Text>
                    </View>
                    <View style={styles.logoContainer}>
                        <Image style={styles.logo} source={images.logo}/>
                        <Image style={styles.logoText} source={images.logo_text}/>
                    </View>
                    <Button
                        style={styles.submitBtn}
                        title={I18n.t('Login')}
                        type='primary'
                        size='W'
                        onPress={() => navigation.replace('SignIn')}
                        testID='login-view-submit'
                        theme={theme}
                    />
                    <Button
                        style={styles.submitBtn}
                        title={I18n.t('Register')}
                        type='gradient'
                        size='W'
                        onPress={() => navigation.replace('SignUp')}
                        testID='login-view-submit'
                        theme={theme}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    appStart: params => dispatch(appStartAction(params)),
});

export default connect(null, mapDispatchToProps)(withTheme(OnBoardingView));
