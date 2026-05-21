require('./models/Housemate');
require('./models/Transaction');
const mongoose = require('mongoose');
const express = require('express');
const transactionRoutes = require('./routes/transactionRoutes');
const housemateRoutes = require('./routes/housemateRoutes');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json())
app.use(transactionRoutes);
app.use(housemateRoutes);


const dbURL = 'mongodb+srv://admin:passwordpassword@cluster0-lgirv.mongodb.net/maison-db?retryWrites=true&w=majority';
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false 
});

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance')
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongo', err)
})

app.get('/', (req, res)=> {
    res.send('Hi There')
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
});