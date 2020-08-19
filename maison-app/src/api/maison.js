const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://15bc74c5de62.ngrok.io'
});

export default instance;