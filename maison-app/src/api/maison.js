const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://48ba11b7121d.ngrok.io'
});

export default instance;