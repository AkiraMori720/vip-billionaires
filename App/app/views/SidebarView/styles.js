import { StyleSheet } from "react-native";
import {isIOS} from '../../utils/deviceInfo';

export default StyleSheet.create({
    profileContainer: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        height: isIOS?140:100
    },
    profileInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        paddingHorizontal: 24,
        paddingTop: isIOS?60: 20,
        height: isIOS?135:95
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 160,
    },
    logo: {
        width: 220,
        height: 90,
        resizeMode: 'contain'
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'white'
    },
    profileName: {
        marginLeft: 12,
        fontSize: 16,
        color: 'white'
    },
    menuIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 12,
        paddingRight: 24,
        borderTopRightRadius: 32,
        borderBottomRightRadius: 32
    },
    itemLeft: {
        marginRight: 10,
        width: 30,
        alignItems: 'center'
    },
    itemCenter: {
        marginRight: 8
    },
    itemText: {
        marginVertical: 12,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    itemsRight: {
        flex: 1,
        height: 0.5,
        backgroundColor: 'white'
    },
    logoutContainer: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        height: 70,
        paddingTop: 5,
    },
    logoutInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        justifyContent: 'center',
        textAlign: 'center',
        height: 65
    },
    logoutMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 12,

    },
    logoutText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    logoutIcon: {
        width: 20,
        height: 20,
        marginRight: 8
    }
});
