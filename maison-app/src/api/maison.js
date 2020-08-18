const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://22e3fc46dc30.ngrok.io'
});

export default instance;