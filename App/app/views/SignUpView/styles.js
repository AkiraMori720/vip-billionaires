import { StyleSheet } from "react-native";
import sharedStyles from '../Styles';

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
    inputStyle: {
        height: 36,
        fontSize: 16,
        paddingVertical: 0
    },
    selectStyle: {
    },
    textareaStyle: {
        height: 120,
        textAlignVertical: 'top',
        paddingVertical: 24
    },
    submitBtn: {
        marginTop: 12,
        paddingVertical: 2,
        alignSelf: 'center'
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 40
    },
    oauthContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12
    },
    forgotContainer: {
        marginVertical: 20
    },
    forgotText: {
        textAlign: 'center',
        textDecorationLine: 'none'
    },
    back: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 0
    },
    terms: {
    },
    termItem: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});
