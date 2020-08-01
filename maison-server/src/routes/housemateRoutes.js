const express = require("express");
const mongoose = require("mongoose");

const Housemate = mongoose.model("Housemate");
const router = express.Router();

router.get("/housemates", async (req, res) => {
  const housemates = await Housemate.find({});
  res.send(housemates);
});

router.post("/housemates", async (req, res) => {
  console.log("You made a POST request to /housemates")
  const { firstName, lastName, displayName } = req.body;
  try {
    const newHousemate = new Housemate({
      name: { firstName, lastName, displayName },
    });
    await newHousemate.save();
  } catch (err) {
    res.status(422).send(err);
  }
});
module.exports = router;
