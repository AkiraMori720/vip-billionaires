import { StyleSheet } from "react-native";

export default StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    backAction: {
        position: 'absolute',
        bottom: 12,
        right: 12
    },
    backImage: {
        width:'100%',
        height: 200,
        resizeMode: 'cover',
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
        marginTop: 4,
        fontSize: 12
    },
    city: {
        marginTop: 2,
        fontSize: 12
    },
    location: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    website: {
        marginTop: 2,
    },
    job: {
        marginTop: 2,
        fontSize: 12
    },
    avatarContainer: {
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        borderWidth: 1,
        borderColor: 'grey'
    },
    profileInfo: {
        marginLeft: 20,
        flexGrow: 1,
    },
    profileTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    handle: {
        fontSize: 12,
        color: 'grey'
    },
    profileHeader:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    profileName: {
        fontSize: 18
    },
    settingIcon: {
        width: 16,
        height: 16,
        resizeMode: 'contain'
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
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemAction: {
        width: 100,
        height: 24,
        resizeMode: 'contain',
        alignItems: 'center',
        justifyContent: 'center'
    },
    actionText: {
        color: 'white'
    },
    options: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: 8
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
