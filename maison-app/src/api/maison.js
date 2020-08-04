const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://3160529af1be.ngrok.io'
});

export default instance;