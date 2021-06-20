// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require("venom-bot");
var _ = require("lodash");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var stealCooldown = String(new Date());

var begCooldown = String(new Date());

const moneySchema = {
  name: String,
  money: Number,
  saving: Number,
  daily: String,
};

const moneyhead = {
  lottery: String,
};

const shopSchema = {
  id: Number,
  title: String,
  desc: String,
  const: Number,
  price: Number,
};

const Shop = mongoose.model("shop", shopSchema);

const ShopRes = mongoose.model("shopreserve", shopSchema);

const Money = mongoose.model("moneys", moneySchema);

const head = mongoose.model("moneyhead", moneyhead);

var lotteryDate = "Mon May 22 2021 09:34:49 GMT+0530 (India Standard Time)";

venom
  .create()
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => {
    if (message.isGroupMsg && message.chat.name.indexOf("HASHes") !== -1) {
      console.log(message.chat.name);
    } else {
      console.log(message);
      var d = new Date();
      var data = message.body;
      var blocks = data.split(" ");
      var sendMessage = "";
      var day = d.getDay();
      var textmsg = "";
      var daystr = Day[day];
      console.log(daystr);
      var getlink;
      var name = "";
      var senderno = _.trim(message.sender.id, "@c.us");
      console.log(message.sender.id);
      console.log(senderno);
      blocks[0] = _.camelCase(blocks[0]);

      namehandlers.forEach(function (element) {
        if (blocks[0] === element && blocks.length > 1)
          name = _.camelCase(blocks[1]);
      });
      if (blocks.length > 1) {
        if (_.camelCase(blocks[1]) === "link") {
          getlink = _.camelCase(blocks[2]);
        } else if (name === "") daystr = _.camelCase(blocks[1]);
      }
      console.log(blocks);
      console.log(name);
      console.log(daystr);
      console.log(day);

      let add = "";
      switch (blocks[0]) {
        case "meme":
          let url = "wholesomememes";
          switch (_.camelCase(blocks[1])) {
            case "dark":
              url = "IndianMeyMeys";
              break;
            case "dank":
              url = "dankmemes";
              break;
          }
          axios
            .get("https://meme-api.herokuapp.com/gimme/" + url)
            .then(function (response) {
              console.log(response.data.url);
              client
                .sendImage(message.from, response.data.url)
                .then((result) => {
                  console.log("Result: ", result); //return object success
                })
                .catch((erro) => {
                  console.error("Error when sending: ", erro); //return object error
                });
            });
          break;
        case "compliment":
          axios.get("https://complimentr.com/api").then(function (response) {
            sendMessage = ["Dear ", name, ",", response.data.compliment];
            console.log(sendMessage);
            sendMessage.forEach(function (txt) {
              textmsg += txt + add;
            });
            client
              .sendText(message.from, textmsg)
              .then((result) => {
                console.log("Result: ", result); //return object success
              })
              .catch((erro) => {
                console.error("Error when sending: ", erro); //return object error
              });
          });
          break;

        case "pickup":
          axios
            .get("https://fierce-temple-86254.herokuapp.com/pick-up")
            .then(function (response) {
              sendMessage = ["Dear ", name, ",", response.data.pickup];
              console.log(sendMessage);
              sendMessage.forEach(function (txt) {
                textmsg += txt + add;
              });
              client
                .sendText(message.from, textmsg)
                .then((result) => {
                  console.log("Result: ", result); //return object success
                })
                .catch((erro) => {
                  console.error("Error when sending: ", erro); //return object error
                });
            });
          break;
        case "slap":
          let msg = _.trim(message.sender.id, "@c.us") + " Slapped " + name;
          client
            .reply(message.from, msg, message.id)
            .then((result) => {
              console.log("Result: ", result); //return object success
            })
            .catch((erro) => {
              console.error("Error when sending: ", erro); //return object error
            });
          break;
        case "kick":
          let kick = _.trim(message.sender.id, "@c.us") + " kicked " + name;
          client
            .reply(message.from, kick, message.id)
            .then((result) => {
              console.log("Result: ", result); //return object success
            })
            .catch((erro) => {
              console.error("Error when sending: ", erro); //return object error
            });
          break;
        case "kill":
          let kill = _.trim(message.sender.id, "@c.us") + " kill " + name;
          client
            .reply(message.from, kill, message.id)
            .then((result) => {
              console.log("Result: ", result); //return object success
            })
            .catch((erro) => {
              console.error("Error when sending: ", erro); //return object error
            });
          break;
        case "define":
          axios
            .get("https://api.dictionaryapi.dev/api/v2/entries/en_US/" + name)
            .then(function (response) {
              sendMessage = [
                name,
                " :  ",
                response.data[0].meanings[0].definitions[0].definition,
                "\n  For Example  : ",
                response.data[0].meanings[0].definitions[0].example,
              ];
              console.log(sendMessage);
              sendMessage.forEach(function (txt) {
                textmsg += txt + add;
              });
              client
                .sendText(message.from, textmsg)
                .then((result) => {
                  console.log("Result: ", result); //return object success
                })
                .catch((erro) => {
                  console.error("Error when sending: ", erro); //return object error
                });
            })
            .catch(function (err) {
              client
                .sendText(message.from, "Word not found.. Sorry")
                .then((result) => {
                  console.log("Result: ", result); //return object success
                })
                .catch((erro) => {
                  console.error("Error when sending: ", erro); //return object error
                });
            });
          break;

        case "money":
          Money.findOne({ name: senderno }, function (err, response) {
            console.log(response);
            if (response === null || response == undefined) {
              const newMoney = new Money({
                name: senderno,
                money: 1500,
                daily: String(new Date()),
                saving: 0,
              });
              newMoney.save();
              client
                .reply(
                  message.from,
                  "Created New account for " +
                    senderno +
                    " with 1500 bucks cash",
                  message.id
                )
                .then((result) => {
                  console.log("Result: ", result);
                })
                .catch((erro) => {
                  console.error("Error when sending: ", erro);
                });
            } else {
              console.log(response);
              let save = 0;
              if (response.saving !== undefined) {
                save = response.saving.toFixed(2);
              }
              const msg =
                "Your balance is : " +
                response.money.toFixed(2) +
                "\nYour savings account balance is : " +
                save;

              client
                .reply(message.from, msg, message.id)
                .then((result) => {
                  console.log("Result: ", result);
                })
                .catch((erro) => {
                  console.error("Error when sending: ", erro);
                });
              // }
            }
          });
          break;

        case "steal":
          var currDate = new Date();
          var prevDate = new Date(stealCooldown);

          var dif = Math.abs((currDate.getTime() - prevDate.getTime()) / 1000);

          console.log(dif);
          if (dif > 3) {
            stealCooldown = String(currDate);

            Money.findOne({ name: name }, function (f_e, stealacc) {
              if (stealacc == null) {
                client
                  .reply(
                    message.from,
                    "Sorry the user doesn't have a bank account",
                    message.id
                  )
                  .then((result) => {
                    console.log("Result: ", result);
                  })
                  .catch((erro) => {
                    console.error("Error when sending: ", erro);
                  });
              } else {
                var multiplyamt = stealacc.money / 8;
                var plusOrMinus = Math.random() < 0.75 ? 1 : -1;
                const stealamt =
                  Math.floor(Math.random() * multiplyamt) * plusOrMinus;
                console.log(stealacc);
                if (multiplyamt <= 0) {
                  client
                    .reply(
                      message.from,
                      "Person is too gareeb to steal",
                      message.id
                    )
                    .then((result) => {
                      console.log("Result: ", result);
                    })
                    .catch((erro) => {
                      console.error("Error when sending: ", erro);
                    });
                } else {
                  Money.findOneAndUpdate(
                    { name: stealacc.name },
                    {
                      $inc: { money: -stealamt },
                    },
                    function (err, response) {
                      console.log(response);
                      if (response == null) {
                        client
                          .reply(
                            message.from,
                            "Sorry the user doesn't have a bank account",
                            message.id
                          )
                          .then((result) => {
                            console.log("Result: ", result);
                          })
                          .catch((erro) => {
                            console.error("Error when sending: ", erro);
                          });
                      } else {
                        Money.findOneAndUpdate(
                          { name: senderno },
                          {
                            $inc: {
                              money: +stealamt,
                            },
                          },
                          function (err, res) {
                            if (res != null) {
                              let msg;
                              if (plusOrMinus == 1)
                                msg =
                                  senderno +
                                  " stole " +
                                  stealamt +
                                  " bucks from " +
                                  name;
                              else
                                msg =
                                  "Oops!!" +
                                  senderno +
                                  " lost " +
                                  -1 * stealamt +
                                  " bucks from " +
                                  name;
                              console.log(msg);
                              client
                                .reply(message.from, msg, message.id)
                                .then((result) => {
                                  console.log("Result: ", result);
                                })
                                .catch((erro) => {
                                  console.error("Error when sending: ", erro);
                                });
                            } else {
                              client
                                .reply(
                                  message.from,
                                  "Sorry you don't have a bank account",
                                  message.id
                                )
                                .then((result) => {
                                  console.log("Result: ", result);
                                })
                                .catch((erro) => {
                                  console.error("Error when sending: ", erro);
                                });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            });
          } else {
            client
              .reply(
                message.from,
                "Please Wait for " + (3 - dif).toFixed(2) + " seconds",
                message.id
              )
              .then((result) => {
                console.log("Result: ", result);
              })
              .catch((erro) => {
                console.error("Error when sending: ", erro);
              });
          }
          break;

        case "beg":
          var c_date = new Date();
          var last_beg = new Date(begCooldown);
          var dif = Math.abs((c_date.getTime() - last_beg.getTime()) / 1000);
          var plusOrMinus = Math.random() < 0.1 ? -1 : 1;
          const beg = Math.floor(Math.random() * 50) * plusOrMinus;

          if (dif > 1) {
            begCooldown = String(c_date);
            Money.findOneAndUpdate(
              { name: senderno },
              {
                $inc: { money: beg },
              },
              function (err, response) {
                if (response !== null) {
                  let msg;
                  if (plusOrMinus === 1) {
                    msg = "You earned " + beg + " gareeb";
                  } else {
                    msg = "You lost " + beg + " LMAO";
                  }
                  client
                    .reply(message.from, msg, message.id)
                    .then((result) => {
                      console.log("Result: ", result);
                    })
                    .catch((erro) => {
                      console.error("Error when sending: ", erro);
                    });
                } else {
                  client
                    .reply(
                      message.from,
                      "Please make a bank accont first",
                      message.id
                    )
                    .then((result) => {
                      console.log("Result: ", result);
                    })
                    .catch((erro) => {
                      console.error("Error when sending: ", erro);
                    });
                }
              }
            );
          } else {
            client
              .reply(
                message.from,
                "Please beg after " + (1 - dif).toFixed(2) + " seconds",
                message.id
              )
              .then((result) => {
                console.log("Result: ", result);
              })
              .catch((erro) => {
                console.error("Error when sending: ", erro);
              });
          }
          break;

        case "invest":
          var currentBal;
          Money.findOne({ name: senderno }, function (err, response) {
            if (response !== null) {
              console.log(response);
              currentBal = response.money;
              var plusOrMinus = Math.random() < 0.6 ? 1 : -1;
              var amt = parseInt(name);
              const invest = amt * plusOrMinus;
              console.log(invest + "and name is " + name + "  " + currentBal);

              if (
                currentBal < parseInt(name) ||
                parseInt(name) < 0 ||
                amt == NaN
              ) {
                client
                  .reply(message.from, "Paise to rakho pehle itne", message.id)
                  .then((result) => {
                    console.log("Result: ", result);
                  })
                  .catch((erro) => {
                    console.error("Error when sending: ", erro);
                  });
              } else {
                Money.findOneAndUpdate(
                  { name: senderno },
                  {
                    $inc: {
                      money: +invest,
                    },
                  },
                  function (err, response) {
                    if (response !== null) {
                      let msg;
                      if (plusOrMinus === 1) {
                        msg = "You just doubled your investment.. YAYYY";
                      } else {
                        msg = " YOU LOST ALL";
                      }
                      client
                        .reply(message.from, msg, message.id)
                        .then((result) => {
                          console.log("Result: ", result);
                        })
                        .catch((erro) => {
                          console.error("Error when sending: ", erro);
                        });
                    } else {
                      client
                        .reply(
                          message.from,
                          "Please make a bank accont first",
                          message.id
                        )
                        .then((result) => {
                          console.log("Result: ", result);
                        })
                        .catch((erro) => {
                          console.error("Error when sending: ", erro);
                        });
                    }
                  }
                );
              }
            }
          });

          break;

        case "give":
          var person;
          var amt;
          var total = "";
          if (blocks.length > 2) {
            person = _.camelCase(blocks[1]);
            for (var i = 2; i < blocks.length; i++) {
              total += blocks[i];
            }
            amt = parseInt(_.camelCase(total));
          }
          var currentBal;
          Money.findOne({ name: senderno }, function (err, result) {
            if (result !== null) {
              currentBal = result.money;
              if (currentBal < amt || amt < 0) {
                client
                  .reply(message.from, "Aukat ke Andar Pls", message.id)
                  .then((result) => {
                    console.log("Result: ", result);
                  })
                  .catch((erro) => {
                    console.error("Error when sending: ", erro);
                  });
              } else {
                Money.findOneAndUpdate(
                  { name: senderno },
                  {
                    $inc: {
                      money: -amt,
                    },
                  },
                  function (err, response) {
                    Money.findOneAndUpdate(
                      { name: person },
                      {
                        $inc: {
                          money: amt,
                        },
                      },
                      function (err, p_res) {
                        if (p_res !== null) {
                          client
                            .reply(
                              message.from,
                              "Successfully Donated " + amt + " to " + person,
                              message.id
                            )
                            .then((result) => {
                              console.log("Result: ", result);
                            })
                            .catch((erro) => {
                              console.error("Error when sending: ", erro);
                            });
                        } else {
                          client
                            .reply(
                              message.from,
                              "User doesnt have a bank account",
                              message.id
                            )
                            .then((result) => {
                              console.log("Result: ", result);
                            })
                            .catch((erro) => {
                              console.error("Error when sending: ", erro);
                            });
                        }
                      }
                    );
                  }
                );
              }
            } else {
              client
                .reply(
                  message.from,
                  "Pls Make a bank account first",
                  message.id
                )
                .then((result) => {
                  console.log("Result: ", result);
                })
                .catch((erro) => {
                  console.error("Error when sending: ", erro);
                });
            }
          });
          break;

        case "daily":
          Money.findOne(
            {
              name: senderno,
            },
            function (err, res) {
              if (res == null) {
                client
                  .reply(message.from, "Pls make and account first", message.id)
                  .then((result) => {
                    console.log("Result: ", result);
                  })
                  .catch((erro) => {
                    console.error("Error when sending: ", erro);
                  });
              } else if (res.daily === null) {
                Money.findOneAndUpdate(
                  { name: senderno },
                  {
                    $inc: {
                      money: 500,
                    },
                    $set: {
                      daily: String(new Date()),
                    },
                  },
                  function (erro, response) {
                    if (!erro) {
                      client
                        .reply(
                          message.from,
                          "You got 500 bucks as daily bonus.. Niceeee",
                          message.id
                        )
                        .then((result) => {
                          console.log("Result: ", result);
                        })
                        .catch((erro) => {
                          console.error("Error when sending: ", erro);
                        });
                    }
                  }
                );
              } else {
                console.log(res.daily);

                let datadate = new Date(res.daily);
                var today = new Date();

                let hours = Math.abs(today - datadate) / 36e5;
                console.log(hours);
                console.log(String(today));

                if (hours > 2) {
                  Money.findOneAndUpdate(
                    {
                      name: senderno,
                    },
                    {
                      $inc: {
                        money: 500,
                      },
                      $set: {
                        daily: String(today),
                      },
                    },
                    function (e, response) {
                      client
                        .reply(
                          message.from,
                          "You got 500 bucks as daily bonus.. Niceeee",
                          message.id
                        )
                        .then((result) => {
                          console.log("Result: ", result);
                        })
                        .catch((erro) => {
                          console.error("Error when sending: ", erro);
                        });
                    }
                  );
                } else {
                  client
                    .reply(
                      message.from,
                      "Please come back after " +
                        (2 - hours).toFixed(2) +
                        " hours",
                      message.id
                    )
                    .then((result) => {
                      console.log("Result: ", result);
                    })
                    .catch((erro) => {
                      console.error("Error when sending: ", erro);
                    });
                }
              }
            }
          );
          break;
        case "roast":
          console.log("IN roast");
          axios
            .get("https://evilinsult.com/generate_insult.php?lang=en&type=json")
            .then(function (response) {
              console.log(response);
              if (
                response.data.number == "111" ||
                response.data.number === "119" ||
                response.data.number === "121" ||
                response.data.number === "10" ||
                response.data.number === "11"
              )
                sendMessage = ["Ooops..", " Please try again"];
              else
                sendMessage = [
                  "Dear ",
                  _.camelCase(blocks[1]),
                  ",",
                  response.data.insult,
                ];
              console.log(sendMessage);
              sendMessage.forEach(function (txt) {
                textmsg += txt + add;
              });
              console.log(textmsg);
              client
                .reply(message.from, textmsg, message.id)
                .then((result) => {
                  console.log("Result: ", result); //return object success
                })
                .catch((erro) => {
                  console.error("Error when sending: ", erro); //return object error
                });
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            });

          break;

        case "save":
          var numtext = "";
          for (var i = 1; i < blocks.length; i++) {
            numtext += blocks[i];
          }
          var num = parseInt(_.camelCase(numtext));

          Money.findOne({ name: senderno }, function (err, res) {
            if (res == null) {
              client
                .reply(message.from, "Please make an account first", message.id)
                .then((result) => {
                  console.log("Result: ", result); //return object success
                })
                .catch((erro) => {
                  console.error("Error when sending: ", erro); //return object error
                });
            } else {
              if (num == NaN || num > res.money || num < 0) {
                client
                  .reply(
                    message.from,
                    "Please Specify a proper amount to save or you don't have enough cash",
                    message.id
                  )
                  .then((result) => {
                    console.log("Result: ", result); //return object success
                  })
                  .catch((erro) => {
                    console.error("Error when sending: ", erro); //return object error
                  });
              } else {
                Money.findOneAndUpdate(
                  { name: senderno },
                  {
                    $inc: {
                      money: -num,
                      saving: num,
                    },
                  },
                  function (error, result) {
                    client
                      .reply(
                        message.from,
                        "Successfully added " + num + " amount to your savings",
                        message.id
                      )
                      .then((result) => {
                        console.log("Result: ", result); //return object success
                      })
                      .catch((erro) => {
                        console.error("Error when sending: ", erro); //return object error
                      });
                  }
                );
              }
            }
          });
          break;

        case "withdraw":
          var numtext = "";
          for (var i = 1; i < blocks.length; i++) {
            numtext += blocks[i];
          }
          var num = parseInt(_.camelCase(numtext));
          Money.findOne({ name: senderno }, function (err, res) {
            if (res == null) {
              client
                .reply(message.from, "Please make an account first", message.id)
                .then((result) => {
                  console.log("Result: ", result); //return object success
                })
                .catch((erro) => {
                  console.error("Error when sending: ", erro); //return object error
                });
            } else {
              if (num == NaN || num > res.saving || num < 0) {
                client
                  .reply(
                    message.from,
                    "Please Specify a proper amount to save",
                    message.id
                  )
                  .then((result) => {
                    console.log("Result: ", result); //return object success
                  })
                  .catch((erro) => {
                    console.error("Error when sending: ", erro); //return object error
                  });
              } else {
                Money.findOneAndUpdate(
                  { name: senderno },
                  {
                    $inc: {
                      money: num,
                      saving: -num,
                    },
                  },
                  function (error, result) {
                    client
                      .reply(
                        message.from,
                        "Successfully Withdrawn " +
                          num +
                          " amount from your savings",
                        message.id
                      )
                      .then((result) => {
                        console.log("Result: ", result); //return object success
                      })
                      .catch((erro) => {
                        console.error("Error when sending: ", erro); //return object error
                      });
                  }
                );
              }
            }
          });
        case "math":
          let fullmsg = "";
          for (var i = 1; i < blocks.length; i++) {
            fullmsg += blocks[i];
          }
          axios
            .get(
              "http://api.mathjs.org/v4/?expr=" + encodeURIComponent(fullmsg)
            )
            .then(function (response) {
              client
                .reply(message.from, response.data.toString(), message.id)
                .then((result) => {
                  console.log("Result: ", result); //return object success
                })
                .catch((erro) => {
                  console.error("Error when sending: ", erro); //return object error
                });
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            });

          break;

        case "meet":
          if (_.camelCase(blocks[1]) === "new") {
            client
              .reply(
                message.from,
                "Create new meet by this URL : http://meet.google.com/new",
                message.id
              )
              .then((result) => {
                console.log("Result: ", result); //return object success
              })
              .catch((erro) => {
                console.error("Error when sending: ", erro); //return object error
              });
          }
          break;
        case "richest":
          Money.find()
            .sort("-money")
            .limit(10)
            .exec(function (error, data) {
              let richest = "RICH LIST:  \n";
              for (var i = 0; i < data.length; i++) {
                richest +=
                  data[i].name + " : " + data[i].money.toFixed(2) + "\n";
              }
              client
                .reply(message.from, richest, message.id)
                .then((result) => {
                  console.log("Result: ", result); //return object success
                })
                .catch((erro) => {
                  console.error("Error when sending: ", erro); //return object error
                });
            });
          break;
        case "gareeb":
          Money.find()
            .sort("money")
            .limit(10)
            .exec(function (error, data) {
              let gareeb = "GAREEB LIST:  \n";
              for (var i = 0; i < data.length; i++) {
                gareeb +=
                  data[i].name + " : " + data[i].money.toFixed(2) + "\n";
              }
              client
                .reply(message.from, gareeb, message.id)
                .then((result) => {
                  console.log("Result: ", result); //return object success
                })
                .catch((erro) => {
                  console.error("Error when sending: ", erro); //return object error
                });
            });
          break;
        case "lottery":
          head.find({}, function (e, info) {
            let currDate = new Date();
            console.log(info);
            let lot_date = new Date(info[0].lottery);
            let hours = Math.abs(currDate - lot_date) / 36e5;

            console.log(hours);

            if (hours >= 2) {
              head.findOneAndUpdate(
                { _id: "60ab6b29f1070171fc14cc51" },
                {
                  $set: {
                    lottery: String(currDate),
                  },
                },
                function (err, curr) {
                  Money.findOneAndUpdate(
                    { name: senderno },
                    {
                      $inc: {
                        money: 1500,
                      },
                    },
                    function (err, res) {
                      if (res === null) {
                        client
                          .reply(
                            message.from,
                            "Create a bank account first",
                            message.id
                          )
                          .then((result) => {
                            console.log("Result: ", result);
                          })
                          .catch((erro) => {
                            console.error("Error when sending: ", erro);
                          });
                      } else {
                        client
                          .reply(
                            message.from,
                            "Congrats, you got 1500 bucks",
                            message.id
                          )
                          .then((result) => {
                            console.log("Result: ", result);
                          })
                          .catch((erro) => {
                            console.error("Error when sending: ", erro);
                          });
                      }
                    }
                  );
                }
              );
            } else {
              client
                .reply(
                  message.from,
                  "Try again after " + (2 - hours).toFixed(2) + " hour(s)",
                  message.id
                )
                .then((result) => {
                  console.log("Result: ", result);
                })
                .catch((erro) => {
                  console.error("Error when sending: ", erro);
                });
            }
          });

          break;
        default:
          break;
      }
      console.log(sendMessage);
      if (sendMessage !== "") {
        sendMessage.forEach(function (txt) {
          textmsg += txt + add;
        });
      }
      switch (blocks[0]) {
        case "ashhar":
          textmsg = "Ashhar Chutiya h";
          break;
      }
      console.log(textmsg);

      if (message.isGroupMsg && message.chat.name.indexOf("HHEY") !== -1) {
        if (sendMessage != "") {
          client
            .reply(message.from, textmsg, message.id)
            .then((result) => {
              console.log("Result: ", result); //return object success
            })
            .catch((erro) => {
              console.error("Error when sending: ", erro); //return object error
            });
        }
      }
    }
  });
}
