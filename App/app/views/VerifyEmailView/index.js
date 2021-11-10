import React from 'react';
import PropTypes from "prop-types";
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import {Image, ScrollView, Text, View} from 'react-native';
import styles from "./styles";
import images from "../../assets/images";
import {connect} from "react-redux";
import sharedStyles from '../../views/Styles';
import {
    COLOR_WHITE,
    HEADER_BAR_START,
    NAV_BAR_END,
    NAV_BAR_START, themes,
} from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import {loginSuccess as loginSuccessAction} from '../../actions/login';

class VerifyEmailView extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        loginSuccess: PropTypes.func,
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
        }
    }

    componentDidMount() {
        this.mounted = true;
    }

    render() {
        const {theme} = this.props;

        return (
            <View style={[sharedStyles.container, {backgroundColor: themes[theme].navbarBackground}]}>
                <StatusBar/>
                <ScrollView {...scrollPersistTaps} style={{flex: 1}} contentContainerStyle={{flexGrow: 1, backgroundColor: themes[theme].backgroundColor}}>
                    <View style={{ backgroundColor: themes[theme].backgroundColor }}>
                        <LinearGradient style={styles.logoContainer} colors={[HEADER_BAR_START, COLOR_WHITE]} angle={90} useAngle>
                            <LinearGradient style={styles.logoInnerContainer} colors={[NAV_BAR_START, NAV_BAR_END]}>
                                <Image style={styles.logo} source={images.logo}/>
                                <Image style={styles.logoText} source={images.logo_text}/>
                            </LinearGradient>
                        </LinearGradient>
                    </View>
                    <View style={[styles.container, {backgroundColor: themes[theme].backgroundColor}]}>
                        <Text style={[styles.mainText, {marginTop: 40}]}>Verify your email address</Text>
                        <Text style={styles.subText}>Thank you for your registration, before we move forward please verify your email address</Text>
                        <Text style={styles.subText}>{"ご登録ありがとうございます。 \n次に進む前にメールアドレスの確認をお願いいたします。"}</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch => ({
    loginSuccess: params => dispatch(loginSuccessAction(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(VerifyEmailView));
