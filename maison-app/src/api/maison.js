const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://695b3bf60c87.ngrok.io'
});

export default instance;