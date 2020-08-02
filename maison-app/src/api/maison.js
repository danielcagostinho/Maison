const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://c5e1a87aa470.ngrok.io'
});

export default instance;