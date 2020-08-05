const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://1488c94ff41d.ngrok.io'
});

export default instance;