const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://6cf2-99-247-65-21.ngrok.io'
});

export default instance;