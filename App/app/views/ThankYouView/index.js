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
import I18n from '../../i18n';
import LinearGradient from 'react-native-linear-gradient';
import scrollPersistTaps from '../../utils/scrollPersistTaps';

class ThankYouView extends React.Component {
    static propTypes = {
        user: PropTypes.object,
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
                    <View style={[styles.contentContainer, {backgroundColor: themes[theme].backgroundColor}]}>
                        <Text style={[styles.mainText, {marginTop: 40}]}>{I18n.t('Thank_you_title_1')}</Text>
                        <Text style={styles.subText}>Your application will be examined and within a few hours you will be notified of the result.</Text>
                        <Text style={styles.subText}>* There might be cases your application might not be approved. In that case, the payment will be fully refunded.</Text>
                        <Text style={styles.subText}>このたびは入会のご申請をいただきありがとうございます。これより入会審査の後数時間で結果をお知らせさせていただきます。</Text>
                        <Text style={styles.subText}>※審査の結果、入会のご希望に添えない場合もございます。　その場合にはいただいた代金は返金させていただきます。</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

export default connect(mapStateToProps, null)(withTheme(ThankYouView));
