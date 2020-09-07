const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://207c62be1239.ngrok.io'
});

export default instance;