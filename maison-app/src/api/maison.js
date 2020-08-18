const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://fe9aadabc6ac.ngrok.io'
});

export default instance;