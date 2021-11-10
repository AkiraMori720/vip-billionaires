const axios = require('axios');

const API_BASE_URL = 'https://us-central1-vip-billionaires-c07df.cloudfunctions.net';

export const postCall = (api, data, successCallback, failCallback = null) => {
    console.log('postCall ', data);
    axios.post(
        `${API_BASE_URL}${api}`,
        data
    ).then((result) => {
        console.log('postCall Success :', result.data);
        successCallback(result.data);
    }).catch((error) => {
        console.log('postCall Failed', error);
        if(failCallback) {
            failCallback(error);
        }
    })
}

export const getCall = (api, successCallback, failCallback = null) => {
    axios({
        url: `${API_BASE_URL}${api}`,
        mothod: 'GET'
    }).then((result) => {
        console.log('getCall Success :', result.data);
        successCallback(result.data);
    }).catch((error) => {
        console.log('gettCall Failed', error);
        if(failCallback) {
            failCallback(error);
        }
    })
}
