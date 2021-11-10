import React from 'react';
import PropTypes from "prop-types";
import StatusBar from "../../containers/StatusBar";
import {withTheme} from "../../theme";
import {Image, Linking, Text, TouchableOpacity, View} from 'react-native';
import styles from "./styles";
import {setUser as setUserAction} from "../../actions/login";
import images from "../../assets/images";
import {connect} from "react-redux";
import MainScreen from '../../containers/MainScreen';
import * as HeaderButton from '../../containers/HeaderButton';
import {GradientHeader} from '../../containers/GradientHeader';
import {COLOR_YELLOW} from '../../constants/colors';
import I18n from '../../i18n';
import {SITE_VIP_MEMBERS_URL} from '../../constants/app';

class VipMembersClubView extends React.Component {
    static navigationOptions = ({navigation}) => ({
        headerLeft: () => <HeaderButton.Drawer navigation={navigation} testID='rooms-list-view-sidebar' />,
        title: 'VIP Billionaires',
        headerBackground: () => <GradientHeader/>
    })

    static propTypes = {
        user: PropTypes.object,
        theme: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            text: '',
            loading: true
        }
    }

    componentDidMount() {
        this.mounted = true;
    }

    render() {
        const {theme, navigation} = this.props;

        return (
            <MainScreen navigation={navigation}>
                <StatusBar/>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Image style={styles.logo} source={images.logo}/>
                    </View>
                    <Text style={[styles.mainText, {marginTop: 20}]}>{I18n.t('club_title_1')}</Text>
                    <Text style={styles.subText}>{I18n.t('club_title_3')}</Text>
                    <TouchableOpacity style={[styles.actionBtn, {backgroundColor: COLOR_YELLOW}]} onPress={() => Linking.openURL(SITE_VIP_MEMBERS_URL)}>
                        <Image source={images.become_member} style={styles.iconStyle}/>
                        <Text style={styles.actionText}>{I18n.t('become_a_member')}</Text>
                    </TouchableOpacity>
                </View>
            </MainScreen>
        )
    }
}

const mapStateToProps = state => ({
    user: state.login.user
})

const mapDispatchToProps = dispatch => ({
    setUser: params => dispatch(setUserAction(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(VipMembersClubView));
