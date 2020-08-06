const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://d9690bdc18ab.ngrok.io'
});

export default instance;