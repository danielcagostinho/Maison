const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://065327a336a4.ngrok.io'
});

export default instance;