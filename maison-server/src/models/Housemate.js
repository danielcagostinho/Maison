const mongoose = require('mongoose');

const nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    displayName: String,
});

const housemateSchema = new mongoose.Schema({
    name: nameSchema,
    avatarURL: String
});

mongoose.model('Housemate', housemateSchema);