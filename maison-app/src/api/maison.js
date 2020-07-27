const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://24c345603523.ngrok.io'
});

export default instance;