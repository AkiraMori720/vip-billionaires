import { StyleSheet } from "react-native";

export default StyleSheet.create({
    logo: {
        maxHeight: 150,
        resizeMode: 'contain',
    },
    logoText: {
        maxWidth: '80%',
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    formContainer: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 18,
    },
    submitBtn: {
        marginTop: 8,
        paddingVertical: 2,
        alignSelf: 'center'
    },
    forgotContainer: {
        marginVertical: 20
    },
    forgotText: {
        textAlign: 'center',
        textDecorationLine: 'none'
    },
    oauthContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20
    }
});
