const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://542dc381698a.ngrok.io'
});

export default instance;