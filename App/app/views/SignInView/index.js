import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Image, SafeAreaView, ScrollView, Text, View} from 'react-native';
import prompt from 'react-native-prompt-android';

import {withTheme} from '../../theme';
import KeyboardView from '../../containers/KeyboardView';
import StatusBar from '../../containers/StatusBar';
import sharedStyles from '../Styles';
import styles from './styles';
import images from '../../assets/images';
import Button from '../../containers/Button';
import TextInput from '../../containers/TextInput';
import {loginSuccess as loginSuccessAction} from '../../actions/login';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import {showErrorAlert, showToast} from '../../lib/info';
import {isValidEmail} from '../../utils/validators';
import firebaseSdk from '../../lib/firebaseSdk';
import AsyncStorage from '@react-native-community/async-storage';
import {CURRENT_USER} from '../../constants/keys';
import {appStart as appStartAction} from '../../actions/app';
import I18n from '../../i18n';
import {VectorIcon} from '../../containers/VectorIcon';
import LinearGradient from 'react-native-linear-gradient';
import {
    HEADER_BAR_END,
    HEADER_BAR_START,
    NAV_BAR_START,
    themes,
} from '../../constants/colors';

class SingInView extends React.Component {
    static propTypes = {
        navigation: PropTypes.object,
        appStart: PropTypes.func,
        loginSuccess: PropTypes.func,
        theme: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            email: '',
            password: '',
        };
    }

    onGoToSignUp = () => {
        const {navigation} = this.props;
        navigation.navigate('SignUp');
    };

    forgotPassword = () => {
        prompt(
            I18n.t('Reset_Password'),
            I18n.t('please_enter_email'),
            [
                {text: I18n.t('Cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: I18n.t('Send'), onPress: email => console.log('OK Pressed, password: ' + email)},
            ],
            {
                type: 'email-address',
                cancelable: false,
                placeholder: I18n.t('Email')
            }
        );
    };

    isValid = () => {
        const {email, password} = this.state;
        if (!email.length) {
            showToast(I18n.t('please_enter_email'));
            this.emailInput.focus();
            return false;
        }
        if (!isValidEmail(email)) {
            showToast(I18n.t('error-invalid-email-address'));
            this.emailInput.focus();
            return false;
        }
        if (!password.length) {
            showToast(I18n.t('please_enter_password'));
            this.passwordInput.focus();
            return false;
        }
        return true;
    };

    onSubmit = () => {
        if (this.isValid()) {
            const {email, password} = this.state;
            const {loginSuccess, appStart} = this.props;
            this.setState({isLoading: true});

            firebaseSdk.signInWithEmail(email, password)
                .then(async (user) => {
                    this.setState({isLoading: false});
                    await AsyncStorage.setItem(CURRENT_USER, JSON.stringify(user));
                    loginSuccess(user);
                })
                .catch(err => {
                    this.setState({isLoading: false});
                    if (err.indexOf('auth/user-not-found') > 0) {
                        showErrorAlert(I18n.t('error-user-not_registered'));
                    } else if (err.indexOf('auth/wrong-password') > 0) {
                        showErrorAlert(I18n.t('error-invalid-password'));
                    } else {
                        showErrorAlert(I18n.t('error-invalid-user'));
                    }
                    console.log('error', err);
                });
        }
    };

    render() {
        const {theme} = this.props;
        const {isLoading} = this.state;
        return (
            <KeyboardView
                style={sharedStyles.container}
                keyboardVerticalOffset={128}
            >
                <StatusBar/>
                <SafeAreaView style={{backgroundColor: NAV_BAR_START}}>
                <LinearGradient colors={[HEADER_BAR_START, HEADER_BAR_END]} style={sharedStyles.topLinearGradient} angle={90} useAngle/>
                <ScrollView style={{flexGrow: 1, backgroundColor: themes[theme].backgroundColor}} {...scrollPersistTaps}>
                        <View style={sharedStyles.headerContainer}>
                            <Image style={styles.logo} source={images.logo}/>
                            <Image style={styles.logoText} source={images.logo_text}/>
                        </View>
                        <View style={styles.formContainer}>
                            <TextInput
                                inputRef={(e) => {
                                    this.emailInput = e;
                                }}
                                iconLeft={images.mail}
                                placeholder={I18n.t('Email')}
                                returnKeyType="next"
                                keyboardType="email-address"
                                textContentType="oneTimeCode"
                                onChangeText={email => this.setState({email})}
                                onSubmitEditing={() => {
                                    this.passwordInput.focus();
                                }}
                                theme={theme}
                            />
                            <TextInput
                                inputRef={(e) => {
                                    this.passwordInput = e;
                                }}
                                iconLeft={images.password}
                                placeholder={I18n.t('Password')}
                                returnKeyType="send"
                                secureTextEntry
                                textContentType="oneTimeCode"
                                onChangeText={value => this.setState({password: value})}
                                theme={theme}
                            />
                            <View style={styles.forgotContainer}>
                                <Text style={[sharedStyles.link, styles.forgotText]} onPress={this.forgotPassword}>{I18n.t("Forgot_Password")}</Text>
                            </View>
                            <Button
                                style={styles.submitBtn}
                                title={I18n.t('Login')}
                                type="gradient"
                                size="W"
                                iconCenter={() => <VectorIcon name={'login'} type={'AntDesign'} color={'white'} size={18} style={{marginRight: 8}}/>}
                                onPress={this.onSubmit}
                                testID="login-submit"
                                loading={isLoading}
                                theme={theme}
                            />
                            <View style={styles.bottomContainer}>
                                <Text>{I18n.t('Do_not_have_an_account')}</Text>
                                <Text style={[{...sharedStyles.link}, {textDecorationLine: 'none'}]}
                                      onPress={this.onGoToSignUp}> {I18n.t('SignUp_Now')}</Text>
                            </View>
                        </View>
                </ScrollView>
                </SafeAreaView>
            </KeyboardView>
        );
    }
}


const mapDispatchToProps = dispatch => ({
    loginSuccess: params => dispatch(loginSuccessAction(params)),
    appStart: params => dispatch(appStartAction(params)),
});

export default connect(null, mapDispatchToProps)(withTheme(SingInView));
