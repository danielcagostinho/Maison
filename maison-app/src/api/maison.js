const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://8eac9035f71f.ngrok.io'
});

export default instance;