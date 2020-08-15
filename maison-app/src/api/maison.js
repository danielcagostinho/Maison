const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://5918242c152d.ngrok.io'
});

export default instance;