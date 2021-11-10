import React from 'react';
import PropTypes from "prop-types";
import {StyleSheet} from "react-native";
import { WebView } from 'react-native-webview';

import {HEADER_BAR_END, HEADER_BAR_START, themes} from '../constants/colors';
import StatusBar from "../containers/StatusBar";
import SafeAreaView from "../containers/SafeAreaView";
import {withTheme} from "../theme";
import {
    CONTENT_PRIVACY_POLICY, CONTENT_PRIVACY_POLICY_JP,
    CONTENT_TERMS_AND_CONDITIONS,
    CONTENT_TERMS_AND_CONDITIONS_JP,
    CONTENT_USER_AGREEMENT, CONTENT_USER_AGREEMENT_JP,
} from '../constants/app';
import sharedStyles from './Styles';
import LinearGradient from 'react-native-linear-gradient';
import {GradientHeader} from '../containers/GradientHeader';
import I18n from '../i18n';

const styles = StyleSheet.create({

})

class AboutView extends React.Component{
    static propTypes = {
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        const param_type = this.props.route.params?.type;
        let title = '';
        let content = '';
        if(param_type !== null){
            switch (param_type) {
                case 0:
                    title = I18n.t('Terms_of_use');
                    content = `<html><head><meta name="viewport" content="width=device-width, initial-scale=0.8"><style>body{padding: 8px; line-height: 1.4rem}</style></head><body>${I18n.locale === 'ja'?CONTENT_TERMS_AND_CONDITIONS_JP:CONTENT_TERMS_AND_CONDITIONS}</body></html>`;
                    break;
                case 1:
                    title = I18n.t('Privacy_policy');
                    content = `<html><head><meta name="viewport" content="width=device-width, initial-scale=0.8"><style>body{padding: 8px; line-height: 1.4rem}</style></head><body>${I18n.locale === 'ja'?CONTENT_PRIVACY_POLICY_JP:CONTENT_PRIVACY_POLICY}</body></html>`;
                    break;
                case 2:
                    title = I18n.t('User_agreement');
                    content = `<html><head><meta name="viewport" content="width=device-width, initial-scale=0.8"><style>body{padding: 8px; line-height: 1.4rem}</style></head><body>${I18n.locale === 'ja'?CONTENT_USER_AGREEMENT_JP:CONTENT_USER_AGREEMENT}</body></html>`;
            }
        }
        this.state = {
            type: param_type??0,    // 0: about, 1: privacy, 2: terms
            title: title,
            content: content
        }
        this.init();
    }

    init = () => {
        const {navigation} = this.props;
        navigation.setOptions({
            title: this.state.title,
            headerBackground: () => <GradientHeader/>
        });
    }



    render(){
        const {theme} = this.props;
        const {content} = this.state;
        return (
            <SafeAreaView style={{ backgroundColor: themes[theme].backgroundColor }}>
                <StatusBar/>
                <LinearGradient colors={[HEADER_BAR_START, HEADER_BAR_END]} style={sharedStyles.topLinearGradient} angle={90} useAngle/>
                <WebView originWhitelist={['*']} source={{ html: content, baseUrl: '' }} />
            </SafeAreaView>
        )
    }
}

export default withTheme(AboutView);
