const express = require("express");
const mongoose = require("mongoose");
const Housemate = mongoose.model("Housemate");
const Transaction = mongoose.model("Transaction");

const router = express.Router();

router.get("/updatedebts", async (req, res) => {
  const currentId = req.query.currentId;
  try {
    const housemates = await Housemate.find({});
    const usersTransactions = await Transaction.find({
      $or: [{ "debtors.housemateId": currentId }, { ownerId: currentId }, ],
    });

    const pendingTransactions = usersTransactions.filter(transaction => !transaction.isPaid)

    const housemateDebts = [];
    housemates.forEach((housemate) => {
      let amount = 0;
      let transactions = [];
      if (currentId != housemate._id) {
        // find transactions for this person
        for (let i = 0; i < pendingTransactions.length; i++) {
          let currentTransaction = pendingTransactions[i];
          if (currentTransaction.ownerId.equals(currentId)) {
            for (let j = 0; j < currentTransaction.debtors.length; j++) {
              let currentDebtor = currentTransaction.debtors[j];
              if (currentDebtor.housemateId.equals(housemate._id)) {
                amount -= currentDebtor.share;
                transactions.push(currentTransaction);
              }
            }
          } else if (currentTransaction.ownerId.equals(housemate._id)) {
            for (let j = 0; j < currentTransaction.debtors.length; j++) {
              let currentDebtor = currentTransaction.debtors[j];
              if (currentDebtor.housemateId.equals(currentId)) {
                amount += currentDebtor.share;
                transactions.push(currentTransaction);
              }
            }
          }
        }
        housemateDebts.push({
          housemateId: housemate._id,
          amount: amount.toFixed(2),
          transactions,
        });
      }
    });
    res.send(housemateDebts);
  } catch (err) {
    res.status(422).send(err);
  }
});

router.get("/transactions", async (req, res) => {
  const currentId = req.query.currentId;
  const housemateId = req.query.housemateId;
  let transactions;
  if (!currentId || !housemateId) {
    transactions = await Transaction.find();
  } else {
    transactions = await Transaction.find({
      $or: [
        { ownerId: housemateId, "debtors.housemateId": currentId },
        { ownerId: currentId, "debtors.housemateId": housemateId },
      ],
    }).sort({'timestamp': 'desc'});
  }
  res.send(transactions);
});

router.post("/transactions", async (req, res) => {
  const { title, amount, isPaid, timestamp, debtors, ownerId } = req.body;
  try {
    // Create and save new transaction
    const transaction = new Transaction({
      title,
      amount,
      isPaid,
      timestamp,
      debtors,
      ownerId,
    });
    await transaction.save((err, t) => t._id);
    
    res.send("You made a POST Request to /transactions");
  } catch (err) {
    return res.status(422).send(err);
  }
});

router.put("/transactions", async (req, res) => {
  const { _id } = req.body;

  await Transaction.findByIdAndUpdate(
    { _id },
    { isPaid: true },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

router.post("/transactions/pay", async (req, res) => {
  const {transactionIds, userId} = req.body;
  console.log("[transactionRoutes.js] POST /transactions/pay paying these transactions", transactionIds);
  const serializedIds = transactionIds.map(ti => {
    return mongoose.Types.ObjectId(ti);
  });
  const usersTransactions = await Transaction.find({
    "_id" : { $in: serializedIds}
  }, (err, docs) => {
    // console.log(docs);
  });
  console.log(usersTransactions);
  res.status(200).send(usersTransactions);
});

module.exports = router;
