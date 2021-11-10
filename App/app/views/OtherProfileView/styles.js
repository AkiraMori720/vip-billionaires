import { StyleSheet } from "react-native";

export default StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        maxHeight: 150,
        resizeMode: 'contain',
    },
    profileContainer: {
        paddingVertical: 12,
        paddingHorizontal: 12
    },
    mainInfo: {
        flexDirection: 'row'
    },
    bio: {
        marginTop: 2,
        fontSize: 12
    },
    location: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    website: {
        marginTop: 2,
        fontSize: 12
    },
    job: {
        marginTop: 2,
        fontSize: 12
    },
    avatarContainer: {
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 1,
        borderColor: 'grey'
    },
    profileInfo: {
        marginLeft: 20,
        flexGrow: 1
    },
    profileHeader:{

    },
    profileTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    profileName: {
        fontSize: 18
    },
    handle: {
        fontSize: 12,
        color: 'grey'
    },
    settingIcon: {
    },
    editProfile: {
        marginTop: 12,
    },
    editProfileBtn: {
        width: 100,
        height: 24,
        resizeMode: 'contain',
    },
    actionContainer:{
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemAction: {
        width: 102,
        height: 24,
        resizeMode: 'contain',
        alignItems: 'center',
        justifyContent: 'center'
    },
    actionText: {
        color: 'white',
        fontSize: 12,
        marginLeft: 12
    },
    options: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        justifyContent: 'space-around'
    },
    optionContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '30%'
    },
    borderLeft: {
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderLeftColor: 'grey'
    },
    borderRight: {
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: 'grey'
    },
    optionValue: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    optionTitle: {
        fontSize: 12
    },
});
