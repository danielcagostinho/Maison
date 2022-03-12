const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://4077-99-247-65-21.ngrok.io'
});

export default instance;