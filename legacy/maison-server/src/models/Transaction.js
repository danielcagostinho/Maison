const mongoose = require('mongoose');

const debtorsSchema = new mongoose.Schema({
    housemateId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Housemate'
    },
    share: Number,
    sharePaid: {
        type: Boolean,
        default: false
    }
});

const transactionSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ''
    },
    amount: Number,
    isPaid: {
        type: Boolean,
        default: false
    },
    timestamp: Date,
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Housemate'
    },
    debtors: [debtorsSchema]
});

mongoose.model("Transaction", transactionSchema);