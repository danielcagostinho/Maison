const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://92dbb0e0ee42.ngrok.io'
});

export default instance;