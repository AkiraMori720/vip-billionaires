import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Image, ImageBackground, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";

import {withTheme} from "../../theme";
import KeyboardView from "../../containers/KeyboardView";
import sharedStyles from "../Styles";
import StatusBar from "../../containers/StatusBar";
import styles from "./styles";
import ImagePicker from "react-native-image-crop-picker";
import images from "../../assets/images";
import scrollPersistTaps from "../../utils/scrollPersistTaps";
import SafeAreaView from "../../containers/SafeAreaView";
import {showErrorAlert, showToast} from "../../lib/info";
import firebaseSdk, {DB_ACTION_UPDATE} from "../../lib/firebaseSdk";
import {setUser as setUserAction} from "../../actions/login";
import {checkCameraPermission, checkPhotosPermission, imagePickerConfig} from '../../utils/permissions';
import * as HeaderButton from '../../containers/HeaderButton';
import TextInput from '../../containers/TextInput';
import CsDatePicker from '../../containers/CsDatePicker';
import {CsSelect} from '../../containers/CsSelect';
import ActivityIndicator from '../../containers/ActivityIndicator';
import {Countries, Genders} from '../../constants/app';
import {isValidURL} from '../../utils/validators';
import {GradientHeader} from '../../containers/GradientHeader';
import LinearGradient from 'react-native-linear-gradient';
import {HEADER_BAR_END, HEADER_BAR_START} from '../../constants/colors';
import I18n from '../../i18n';
import {VectorIcon} from '../../containers/VectorIcon';
import ExDatePicker from '../../containers/ExDatePicker';

class ProfileEditView extends React.Component{
    static propTypes = {
        navigation: PropTypes.object,
        user: PropTypes.object,
        setUser: PropTypes.func,
        theme: PropTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {
            image_path: null,
            displayName: props.user.displayName,
            email: props.user.email,
            phone: props.user.phone??'',
            gender: props.user.gender??'',
            birthday: props.user.birthday?new Date(props.user.birthday):null,
            purpose: props.user.purpose??'',
            city: props.user.city??'',
            website: props.user.website??'',
            isLoading: false,
        }
        this.init();
    }

    init = () => {
        const {navigation} = this.props;
        navigation.setOptions({
            title: I18n.t('Edit_profile'),
            headerRight: () => <HeaderButton.Save navigation={navigation} onPress={this.onSubmit} testID='rooms-list-view-create-channel'/>,
            headerBackground: () => <GradientHeader/>
        });
    }

    takePhoto = async () => {
        if(await checkCameraPermission()){
            ImagePicker.openCamera(imagePickerConfig).then(image => {
                this.setState({image_path: image.path});
            });
        }
    }

    chooseFromLibrary = async () => {
        if(await checkPhotosPermission()) {
            ImagePicker.openPicker(imagePickerConfig).then(image => {
                this.setState({image_path: image.path});
            });
        }
    }

    toggleAction = () => {
        Alert.alert(
            '',
            I18n.t('Upload_profile_photo'),
            [
                {
                    text: I18n.t("Cancel"), onPress: () => {
                    }
                },
                {
                    text: I18n.t('Take_a_photo'), onPress: () => {
                        this.takePhoto();
                    }
                },
                {
                    text: I18n.t('Choose_a_photo'), onPress: () => {
                        this.chooseFromLibrary();
                    }
                },
            ]);
    }

    isValid = () => {
        const {displayName, email, website} = this.state;
        if(!displayName.length){
            showToast(I18n.t('please_enter_name'));
            this.nameInput.focus();
            return false;
        }
        if(!email.length){
            showToast(I18n.t('please_enter_email'));
            this.emailInput.focus();
            return false;
        }
        if(website.length && !isValidURL(website)){
            showToast(I18n.t('please_enter_valid_website'));
            this.websiteInput.focus();
            return false;
        }
        return true;
    }

    onSubmit = () => {
        if(this.isValid()){
            const {image_path} = this.state;
            this.setState({isLoading: true});
            if(image_path){
                firebaseSdk.uploadMedia(firebaseSdk.STORAGE_TYPE_AVATAR, image_path).then(image_url => {
                    this.saveUser(image_url);
                }).catch((err) => {
                    showErrorAlert(err, I18n.t('Oops'));
                    this.setState({isLoading: false});
                })
            } else {
                this.saveUser();
            }
        }
    }

    saveUser = (image_url = null) => {
        const {user, navigation, setUser} = this.props;
        const {displayName, phone, email, gender, birthday, purpose, city, website} = this.state;

        let userInfo = {
            id: user.id,
            displayName: displayName,
            phone: phone,
            email: email,
            gender: gender,
            birthday: birthday,
            purpose: purpose,
            city: city,
            website: website,
        }

        if(image_url){
            userInfo = {...userInfo, avatar: image_url};
        }

        firebaseSdk.setData(firebaseSdk.TBL_USER, DB_ACTION_UPDATE, userInfo)
            .then(() => {
                showToast(I18n.t('Update_profile_complete'));
                this.setState({isLoading: false});
                const updateUser = {...user, ...userInfo};
                setUser(updateUser);
                navigation.pop();
            })
            .catch(err => {
                showToast(I18n.t(err.message));
                this.setState({isLoading: false});
            })
    }

    render(){
        const {user, theme} = this.props;
        const {image_path, displayName, phone, email, gender, birthday, purpose, city, website, isLoading} = this.state;
        return (
            <KeyboardView
                contentContainerStyle={sharedStyles.container}
                keyboardVerticalOffset={128}
            >
                <StatusBar/>
                <LinearGradient colors={[HEADER_BAR_START, HEADER_BAR_END]} style={sharedStyles.topLinearGradient} angle={90} useAngle/>
                <ScrollView contentContainerStyle={{flexGrow: 1}} {...scrollPersistTaps}>
                    <SafeAreaView>
                        {
                            isLoading && <ActivityIndicator absolute theme={theme} size={'large'}/>
                        }
                        <View style={styles.headerContainer}>
                            <View style={styles.imageContainer}>
                                <Image style={styles.avatar} source={image_path?{uri: image_path}:(user.avatar?{uri: user.avatar}:images.default_avatar)}/>
                                <TouchableOpacity style={styles.iconContainer} onPress={this.toggleAction}>
                                    <VectorIcon type={"MaterialIcons"} name={"edit"} size={24} color={"white"}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                inputRef={(e) => {
                                    this.nameInput = e;
                                }}
                                inputStyle={styles.inputStyle}
                                value={displayName}
                                label={I18n.t('Name')}
                                returnKeyType='next'
                                keyboardType='default'
                                onChangeText={name => this.setState({displayName: name})}
                                onSubmitEditing={() => {
                                    this.websiteInput.focus();
                                }}
                                theme={theme}
                            />
                            <TextInput
                                inputRef={(e) => {
                                    this.websiteInput = e;
                                }}
                                inputStyle={styles.inputStyle}
                                value={website}
                                label={I18n.t('Website')}
                                returnKeyType='next'
                                keyboardType='default'
                                placeholder={'https://google.com'}
                                onChangeText={website => this.setState({website})}
                                onSubmitEditing={() => {
                                    this.phoneInput.focus();
                                }}
                                theme={theme}
                            />
                            <TextInput
                                inputRef={(e) => {
                                    this.phoneInput = e;
                                }}
                                inputStyle={styles.inputStyle}
                                value={phone}
                                label={I18n.t('Phone')}
                                returnKeyType='next'
                                keyboardType='phone-pad'
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
                                inputStyle={styles.inputStyle}
                                value={email}
                                label={I18n.t('Mail')}
                                returnKeyType='next'
                                keyboardType='email-address'
                                onChangeText={email => this.setState({email})}
                                onSubmitEditing={() => {
                                    this.cityInput.focus();
                                }}
                                theme={theme}
                            />
                            <CsSelect
                                label={I18n.t('Gender')}
                                options={Genders}
                                theme={theme}
                                value={gender}
                                onChange={value =>  this.setState({gender: value})}
                            />
                            <ExDatePicker
                                label={I18n.t('Birthday')}
                                containerStyle={styles.selectStyle}
                                topScrollEnable={false}
                                toggleShow={(show) => {}}
                                value={birthday}
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
                                    this.cityInput = e;
                                }}
                                inputStyle={styles.inputStyle}
                                value={city}
                                label={I18n.t('City')}
                                returnKeyType='next'
                                keyboardType='default'
                                onChangeText={value => this.setState({city: value})}
                                onSubmitEditing={() => {
                                    this.bioInput.focus();
                                }}
                                theme={theme}
                            />
                            <TextInput
                                inputRef={(e) => {
                                    this.bioInput = e;
                                }}
                                inputStyle={styles.bioStyle}
                                wrapStyle={{alignItems: 'flex-start', paddingVertical: 12}}
                                value={purpose}
                                label={I18n.t('Bio')}
                                returnKeyType='next'
                                keyboardType='default'
                                onChangeText={purpose => this.setState({purpose})}
                                multiline={true}
                                theme={theme}
                            />
                        </View>
                    </SafeAreaView>
                </ScrollView>
            </KeyboardView>
        );
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch =>({
    setUser: params => dispatch(setUserAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ProfileEditView));
