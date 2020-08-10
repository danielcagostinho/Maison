const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://b6d747a9c3a7.ngrok.io'
});

export default instance;