const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://4e0320bbeaad.ngrok.io'
});

export default instance;