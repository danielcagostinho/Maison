const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://f916300295fe.ngrok.io'
});

export default instance;