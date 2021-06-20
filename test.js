const venom = require("venom-bot");
var _ = require("lodash");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

axios
  .get("https://fierce-temple-86254.herokuapp.com/pick-up")
  .then(function (response) {
    console.log(response.data.pickup);
  });
