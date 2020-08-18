const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://552e62ef6cb7.ngrok.io'
});

export default instance;