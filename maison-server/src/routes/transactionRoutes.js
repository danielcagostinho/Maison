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
      $or: [{ "debtors.housemateId": currentId }, { ownerId: currentId }],
    });

    const housemateDebts = [];
    housemates.forEach((housemate) => {
      let amount = 0;
      let transactions = [];
      if (currentId != housemate._id) {
        // find transactions for this person
        for (let i = 0; i < usersTransactions.length; i++) {
          let currentTransaction = usersTransactions[i];
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
    });
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
    
    // for (let i = 0; i < debtors.length; i++) {
    //   let currentDebtor = debtors[i];
    //   let damage;
    //   if (currentDebtor.housemateId == ownerId) {
    //     damage = currentDebtor.share - amount;
    //   } else {
    //     damage = currentDebtor.share;
    //   }

      // // Find housemate and update the debt to that housemate and net debt
      // const housemate = await Housemate.findById({
      //   _id: currentDebtor.housemateId,
      // });
      // // Find the owner of the transaction and change the current housemates debt towards
      // // for (let j = 0; j < housemate.debts.length; j++) {
      // //   // If not the owner search through and find the owner
      // //   let housemateToCheck = housemate.debts[j];
      // //   if (!ownerId == housemate._id) {
      // //     if (ownerId == housemateToCheck.housemateId) {
      // //       // for the housemate, if this current other user is the owner of the transaction
      // //       housemateToCheck.amount -= Number(currentDebtor.share); // increase the debt for that user
      // //       housemateToCheck.transactionIds.push(transaction._id); // add the transactions id
      // //     }
      // //   } else {
      // //     //if it is the transaction owner, cycle through the housemates and add debts to the ones involved
      // //     for (let k = 0; k < debtors.length; k++) {
      // //       if (debtors[k].housemateId == housemateToCheck.housemateId) {
      // //         housemateToCheck.amount -= Number(currentDebtor.share); // increase the debt for that user
      // //         housemateToCheck.transactionIds.push(transaction._id); // add the transactions id
      // //       }
      // //     }
      // //   }
      // // }
      // housemate.debt = Number(housemate.debt) + Number(damage);
      // await housemate.save();
    //}
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

module.exports = router;
