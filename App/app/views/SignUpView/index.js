import React from 'react';
import PropTypes from 'prop-types';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import ScrollView from 'react-native-nested-scroll-view'

import {withTheme} from '../../theme';
import TextInput from '../../containers/TextInput';
import sharedStyles from '../Styles';
import StatusBar from '../../containers/StatusBar';
import styles from './styles';
import Button from '../../containers/Button';
import images from '../../assets/images';
import {isValidEmail} from '../../utils/validators';
import {showErrorAlert, showToast} from '../../lib/info';
import firebaseSdk from '../../lib/firebaseSdk';
import LinearGradient from 'react-native-linear-gradient';
import {COLOR_YELLOW, HEADER_BAR_END, HEADER_BAR_START, NAV_BAR_START, themes} from '../../constants/colors';
import I18n from '../../i18n';
import CsSelectGender from '../../containers/CsSelectGender';
import ExDatePicker from '../../containers/ExDatePicker';
import ExSalary from '../../containers/ExSalary';
import KeyboardView from '../../containers/KeyboardView';
import ExYears from '../../containers/ExYears';
import AsyncStorage from '@react-native-community/async-storage';
import {CURRENT_USER} from '../../constants/keys';
import {loginSuccess as loginSuccessAction} from '../../actions/login';
import {connect} from 'react-redux';
import {VectorIcon} from '../../containers/VectorIcon';
import scrollPersistTaps from '../../utils/scrollPersistTaps';

class SingUpView extends React.Component {

    static propTypes = {
        navigation: PropTypes.object,
        theme: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            gender: null,
            city: '',
            phone: '',
            email: '',
            password: '',
            confirm_password: '',
            birthday: null,
            job: '',
            company: '',
            role: '',
            years_of_service: 1,
            salary: 2,
            purpose: '',
            topScrollEnable: true,
            allowTerms: false,
            isLoading: false
        };
    }

    onGoToSignIn = () => {
        const {navigation} = this.props;
        navigation.navigate('SignIn');
    };

    onGotoTerms = () => {
        const {navigation} = this.props;
        navigation.navigate('About', {type: 0});
    }

    onGotoPrivacy = () => {
        const {navigation} = this.props;
        navigation.navigate('About', {type: 1});
    }

    isValid = () => {
        const {name, city, gender, password, confirm_password, email} = this.state;

        if (!name.length) {
            showToast(I18n.t('please_enter_name'));
            this.nameInput.focus();
            return false;
        }
        if (!gender) {
            showToast(I18n.t('please_select_gender'));
            return false;
        }
        if (!city.length) {
            showToast(I18n.t('please_enter_city'));
            this.cityInput.focus();
            return false;
        }
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
        if (password.length < 6) {
            showToast(I18n.t('please_enter_password_with_min_length_6'));
            this.passwordInput.focus();
            return false;
        }
        if (password !== confirm_password){
            showToast(I18n.t('error-invalid-password-repeat'));
            this.confirmPasswordInput.focus();
            return false;
        }
        return true;
    };

    onSubmit = () => {
        if (this.isValid()) {

            this.setState({isLoading: true});
            const {loginSuccess, navigation} = this.props;
            const {name, email, password, phone, gender, city, birthday, job, company, role, years_of_service, salary, purpose} = this.state;

            const user = {
                displayName: name,
                gender,
                city,
                phone,
                email: email,
                password: password,
                birthday,
                job,
                company,
                role,
                years_of_service,
                salary,
                purpose
            };

            firebaseSdk.signUp(user)
                .then(async () => {
                    showToast(I18n.t('Register_complete'));
                    firebaseSdk.signInWithEmail(email, password)
                        .then(async (user) => {
                            await AsyncStorage.setItem(CURRENT_USER, JSON.stringify(user));
                            this.setState({isLoading: false});
                            loginSuccess(user);
                        })
                        .catch((error) => {
                            navigation.navigate('SignIn');
                        })
                })
                .catch((err) => {
                    showErrorAlert(I18n.t('Register_fail'));
                    this.setState({isLoading: false});
                });
        }
    };

    render() {
        const {theme} = this.props;
        const {isLoading, birthday, gender, salary, years_of_service, topScrollEnable, allowTerms} = this.state;
        return (
            <KeyboardView
                contentContainerStyle={sharedStyles.container}
                keyboardVerticalOffset={128}
            >
                <StatusBar/>
                <SafeAreaView style={{backgroundColor: NAV_BAR_START}}>
                <LinearGradient colors={[HEADER_BAR_START, HEADER_BAR_END]} style={sharedStyles.topLinearGradient} angle={90} useAngle/>
                    <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: themes[theme].backgroundColor}} {...scrollPersistTaps}>
                        <View style={sharedStyles.headerContainer}>
                            <Image style={styles.logo} source={images.logo}/>
                            <Image style={styles.logoText} source={images.logo_text}/>
                        </View>
                        <View style={styles.formContainer}>
                            <TextInput
                                inputRef={(e) => {
                                    this.nameInput = e;
                                }}
                                label={I18n.t('Name')}
                                returnKeyType="next"
                                keyboardType="default"
                                textContentType="oneTimeCode"
                                inputStyle={styles.inputStyle}
                                onChangeText={value => this.setState({name: value})}
                                onSubmitEditing={() => {
                                    this.cityInput.focus();
                                }}
                                theme={theme}
                            />
                            <CsSelectGender
                                label={I18n.t('Gender')}
                                value={gender}
                                onChange={value => this.setState({gender: value})}
                                theme={theme}
                            />
                            <TextInput
                                inputRef={(e) => {
                                    this.cityInput = e;
                                }}
                                label={I18n.t('City')}
                                returnKeyType="next"
                                keyboardType="default"
                                textContentType="oneTimeCode"
                                inputStyle={styles.inputStyle}
                                onChangeText={value => this.setState({city: value})}
                                onSubmitEditing={() => {
                                    this.phoneInput.focus();
                                }}
                                theme={theme}
                            />
                            <TextInput
                                inputRef={(e) => {
                                    this.phoneInput = e;
                                }}
                                label={I18n.t('Phone')}
                                returnKeyType="next"
                                keyboardType="phone-pad"
                                textContentType="oneTimeCode"
                                inputStyle={styles.inputStyle}
                                onChangeText={phone => this.setState({phone})}
                                onSubmitEditing={() => {
                                    this.emailInput.focus();
                                }}
                                theme={theme}
                            />
                            <TextInput
                                inputRef={(e) => {
                                    this.emailInput = e;
                                }}
                                label={I18n.t('Email')}
                                returnKeyType="next"
                                keyboardType="email-address"
                                textContentType="oneTimeCode"
                                inputStyle={styles.inputStyle}
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
                                label={I18n.t('Password')}
                                returnKeyType="next"
                                secureTextEntry
                                textContentType="oneTimeCode"
                                inputStyle={styles.inputStyle}
                                onChangeText={value => this.setState({password: value})}
                                onSubmitEditing={() => {
                                    this.confirmPasswordInput.focus();
                                }}
                                theme={theme}
                            />
                            <TextInput
                                inputRef={(e) => {
                                    this.confirmPasswordInput = e;
                                }}
                                label={I18n.t('Confirm_password')}
                                returnKeyType="next"
                                secureTextEntry
                                textContentType="oneTimeCode"
                                inputStyle={styles.inputStyle}
                                onChangeText={value => this.setState({confirm_password: value})}
                                onSubmitEditing={() => {
                                    this.jobInput.focus();
                                }}
                                theme={theme}
                            />
                            <ExDatePicker
                                containerStyle={styles.selectStyle}
                                inputStyle={{backgroundColor: themes[theme].auxiliaryBackground}}
                                label={I18n.t('Birthday')}
                                value={birthday}
                                topScrollEnable={topScrollEnable}
                                toggleShow={(show) => {this.setState({topScrollEnable: !show})}}
                                action={({value}) => {
                                    if(!value){
                                        return;
                                    }
                                    this.setState({birthday: value});
                                }}
                                theme={theme}
                            />
                            <TextInput
                                inputRef={(e) => {
                                    this.jobInput = e;
                                }}
                                label={I18n.t('Job')}
                                returnKeyType="next"
                                keyboardType="default"
                                textContentType="oneTimeCode"
                                inputStyle={styles.inputStyle}
                                onChangeText={value => this.setState({job: value})}
                                onSubmitEditing={() => {
                                    this.companyInput.focus();
                                }}
                                theme={theme}
                            />
                            <TextInput
                                inputRef={(e) => {
                                    this.companyInput = e;
                                }}
                                label={I18n.t('Company')}
                                returnKeyType="next"
                                keyboardType="default"
                                textContentType="oneTimeCode"
                                inputStyle={styles.inputStyle}
                                onChangeText={value => this.setState({company: value})}
                                onSubmitEditing={() => {
                                    this.roleInput.focus();
                                }}
                                theme={theme}
                            />
                            <TextInput
                                inputRef={(e) => {
                                    this.roleInput = e;
                                }}
                                label={I18n.t('Role')}
                                returnKeyType="next"
                                keyboardType="default"
                                textContentType="oneTimeCode"
                                inputStyle={styles.inputStyle}
                                onChangeText={value => this.setState({role: value})}
                                onSubmitEditing={() => {
                                    this.purposeInput.focus();
                                }}
                                theme={theme}
                            />
                            <ExYears
                                containerStyle={styles.selectStyle}
                                label={I18n.t('Years_of_service')}
                                value={years_of_service}
                                topScrollEnable={topScrollEnable}
                                toggleShow={(show) => {this.setState({topScrollEnable: !show})}}
                                action={({value}) => {
                                    if(!value){
                                        return;
                                    }
                                    this.setState({years_of_service: value});
                                }}
                                theme={theme}/>
                            <ExSalary
                                containerStyle={styles.selectStyle}
                                label={I18n.t('Salary')}
                                value={salary}
                                topScrollEnable={topScrollEnable}
                                toggleShow={(show) => {this.setState({topScrollEnable: !show})}}
                                action={({value}) => {
                                    if(!value){
                                        return;
                                    }
                                    this.setState({salary: value});
                                }}
                                theme={theme}/>
                            <TextInput
                                inputRef={(e) => {
                                    this.purposeInput = e;
                                }}
                                label={I18n.t('Membership_purpose')}
                                keyboardType="default"
                                textContentType="oneTimeCode"
                                inputStyle={styles.textareaStyle}
                                multiline={true}
                                onChangeText={value => this.setState({purpose: value})}
                                theme={theme}
                            />
                            <View style={styles.terms}>
                                <View style={styles.termItem}>
                                    <TouchableOpacity style={{marginHorizontal: 8}} onPress={() => this.setState({allowTerms: !allowTerms})}>
                                        <VectorIcon name={allowTerms ? 'check-square-o' : 'square-o'} type={'FontAwesome'} size={24} color={allowTerms?COLOR_YELLOW:'black'} />
                                    </TouchableOpacity>
                                    <Text style={{color: themes[theme].buttonText}}>I agree with the </Text>
                                    <Text style={{...sharedStyles.link, color: themes[theme].buttonText}}
                                          onPress={this.onGotoTerms}> Terms and Conditions </Text>
                                    <Text style={{color: themes[theme].buttonText}}> and </Text>
                                </View>
                                <View style={{marginLeft: 30}}>
                                    <Text style={{...sharedStyles.link, color: themes[theme].buttonText}}
                                          onPress={this.onGotoPrivacy}> Privacy Policy </Text>
                                </View>
                            </View>
                            <Button
                                style={styles.submitBtn}
                                title={I18n.t('Register')}
                                type="gradient"
                                size="W"
                                onPress={this.onSubmit}
                                testID="login-view-submit"
                                loading={isLoading}
                                disabled={!allowTerms}
                                theme={theme}
                            />
                            <View style={styles.bottomContainer}>
                                <Text>{I18n.t('Have_an_account')}</Text>
                                <Text style={[{...sharedStyles.link}, {textDecorationLine: 'none'}]}
                                      onPress={this.onGoToSignIn}> {I18n.t('SignIn')}</Text>
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
});

export default connect(null, mapDispatchToProps)(withTheme(SingUpView));
