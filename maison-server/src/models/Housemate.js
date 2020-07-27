const mongoose = require('mongoose');

const nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    displayName: String,
});

const housemateSchema = new mongoose.Schema({
    name: nameSchema
});

mongoose.model('Housemate', housemateSchema);