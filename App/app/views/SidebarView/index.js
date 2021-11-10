import React from 'react';
import PropTypes from "prop-types";
import {Image, ScrollView, Text, TouchableOpacity, View, Linking} from 'react-native';
import {connect} from "react-redux";

import {
    COLOR_WHITE,
    HEADER_BACKGROUND,
    HEADER_BAR_START,
    NAV_BAR_END,
    NAV_BAR_START,
    themes,
} from '../../constants/colors';
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import styles from "./styles";
import images from "../../assets/images";
import SidebarItem from "./SidebarItem";
import scrollPersistTaps from "../../utils/scrollPersistTaps";
import {logout as logoutAction} from "../../actions/login";
import {showConfirmationAlert} from "../../lib/info";
import {GradientHeader} from '../../containers/GradientHeader';
import LinearGradient from 'react-native-linear-gradient';
import Navigation from '../../lib/Navigation';
import I18n from '../../i18n';
import {SITE_SHOP_URL} from '../../constants/app';

class SidebarView extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: 'VIP Billionaires',
        headerBackground: () => <GradientHeader/>
    })

    static propTypes = {
        logout: PropTypes.func,
        user: PropTypes.object,
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {

        }

        this.menus = [
            {
                id: 'feed',
                name: I18n.t('Feed'),
                icon: images.menu_feed,
                route: 'Home',
                routes: ['Home']
            },
            {
                id: 'open_post',
                name: I18n.t('Open_posts'),
                icon: images.menu_open_post,
                route: 'Posts',
                routes: ['Posts']
            },
            {
                id: 'shop',
                name: I18n.t('Shop'),
                icon: images.menu_shop,
                route: 'Shop',
                routes: ['Shop']
            },
            {
                id: 'vip_members',
                name: I18n.t('Vip_members'),
                icon: images.menu_vip_members,
                route: 'VipMembers',
                routes: ['VipMembers']
            },
            {
                id: 'privacy_policy',
                name: I18n.t('Privacy_policy'),
                icon: images.menu_privacy,
                route: 'Privacy',
                routes: ['Privacy']
            },
            {
                id: 'terms_of_use',
                name: I18n.t('Terms_of_use'),
                icon: images.menu_terms,
                route: 'Terms',
                routes: ['Terms']
            },
            {
                id: 'eula',
                name: I18n.t('Eula'),
                icon: images.menu_eula,
                route: 'Eula',
                routes: ['Eula']
            },
            {
                id: 'setting',
                name: I18n.t('Settings'),
                icon: images.menu_settings,
                route: 'Setting',
                routes: ['Setting']
            },
        ]
    }

    onClick = (item) => {
        const {navigation} = this.props;
        switch (item.id){
            case 'terms_of_use':
                return this.onNavigate('About', {type: 0});
            case 'privacy_policy':
                return this.onNavigate('About', {type: 1});
            case 'eula':
                return this.onNavigate('About', {type: 2});
            case 'shop':
                return Linking.openURL(SITE_SHOP_URL);
            default:
                this.onNavigate(item.route);
        }
    };

    onNavigate = (routeName, params) => {
        const {navigation} = this.props;
        const route = Navigation.getCurrentRoute();
        if(route !== routeName){
            if(route !== 'Home'){
                navigation.popToTop();
                navigation.navigate(routeName, params);
            } else {
                navigation.navigate(routeName, params);
            }
        }
    }

    onLogOut = () => {
        const {logout} = this.props;
        showConfirmationAlert({
            title: I18n.t('Logout'),
            message: I18n.t('are_you_sure_to_log_out'),
            callToAction: I18n.t('Confirm'),
            onPress: () => logout()
        });
    }

    render(){
        const {user, theme} = this.props;
        const routeName = Navigation.getCurrentRoute();

        return (
            <View style={{ flex:1, backgroundColor: themes[theme].backgroundColor }}>
                <StatusBar/>
                <View style={{ backgroundColor: HEADER_BACKGROUND }}>
                    <LinearGradient style={styles.profileContainer} colors={[HEADER_BAR_START, COLOR_WHITE]} angle={90} useAngle>
                        <LinearGradient style={styles.profileInnerContainer} colors={[NAV_BAR_END, NAV_BAR_START]}>
                            <Image source={user.avatar?{uri: user.avatar}:images.default_avatar} style={styles.avatar}/>
                            <Text style={styles.profileName}>{user.displayName}</Text>
                        </LinearGradient>
                    </LinearGradient>
                </View>
                <ScrollView style={{flexGrow: 1, backgroundColor: HEADER_BACKGROUND}} {...scrollPersistTaps}>
                    <View style={styles.headerContainer}>
                        <Image source={images.logo} style={styles.logo}/>
                    </View>
                    {
                        this.menus.map(m => (
                            <SidebarItem
                                id={`sidebar-view-key-${m.id}`}
                                text={m.name}
                                left={(
                                    <Image
                                        source={m.icon}
                                        style={styles.menuIcon}
                                    />
                                )}
                                onPress={() => this.onClick(m)}
                                current={m.routes.includes(routeName)}
                            />
                        ))
                    }
                </ScrollView>
                <View style={{ backgroundColor: HEADER_BACKGROUND }}>
                    <LinearGradient style={styles.logoutContainer} colors={[HEADER_BAR_START, COLOR_WHITE]} angle={90} useAngle>
                        <LinearGradient style={styles.logoutInnerContainer} colors={[NAV_BAR_END, NAV_BAR_START]}>
                            <TouchableOpacity onPress={this.onLogOut} style={styles.logoutMenu}>
                                <Image source={images.ic_menu_logout} style={styles.logoutIcon}/>
                                <Text style={styles.logoutText}>{I18n.t('Logout')}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </LinearGradient>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch => ({
    logout: params => dispatch(logoutAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SidebarView));
