import { StyleSheet } from "react-native";

export default StyleSheet.create({
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        padding: 12,
        justifyContent: 'center',
        position: 'relative'
    },
    selectStyle: {

    },
    inputStyle: {
        height: 36,
        fontSize: 16,
        paddingVertical: 0,
        backgroundColor: 'white'
    },
    bioStyle: {
        height: 120,
        textAlignVertical: 'top'
    },
    avatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'grey'
    },
    iconContainer: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(125,125,125,0.46)',
        borderRadius:18,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputContainer: {
        flexGrow: 1,
        paddingVertical: 8,
        paddingHorizontal: 18,
    },
    submitBtn: {
        marginTop: 8,
        paddingVertical: 2,
        alignSelf: 'center'
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30
    }
});
