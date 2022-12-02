// Requirements.
const Discord = require("discord.js");
const fs = require("fs");

// Init.
const client = new Discord.Client();
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

// When the bot loads...
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Client ID: ${client.user.id}`);
  client.user.setActivity("🎄 help");
});

// Create prefix.
const prefix = "🎄";

// When a message is sent...
client.on("message", msg => {
  // Checks for bot recursion.
  if (msg.author != client.user) {
    // Checks for prefix.
    if (msg.content.startsWith(prefix)) {
      // Parse message.
      var message = msg.content
        .replace(/\s+/g, " ")
        .trim()
        .split(" ");
      var command = message[1];
      // Makes sure that the command is defined.
      if (!undefined) {
        // Create some helper variables.
        var user = msg.author;
        var guild = msg.channel.guild.id;
        var guild_name = msg.channel.guild;
        var file = "guilds/" + guild + ".txt";
        var file_date = "guilds/dates/" + guild + ".txt";

        // "help"
        // DM's the user the help menu.
        if (command === "help") {
          msg.channel.send(`Sending you the help menu via direct message!`);
          user.send(
            "```asciidoc\r\n= Hello and happy holidays! =\r\nMy name is Klaus, the Secret Santa helper.\r\n-----------------\r\n[All my commands are defined by the prefix '\uD83C\uDF84'.]\r\n[Server admins: please create a \"Head Elf\" role and assign it]\r\n[to users you want to be able to use the Head Elf commands.]\r\n\r\n= List of Commands =\r\n[Regular User]\r\n\uD83C\uDF84 help :: Sends you this menu through DM. You probably knew that.\r\n\uD83C\uDF84 register :: Registers you to be a part of the server's secret santa!\r\n\uD83C\uDF84 unregister :: Unregisters you from the active secret santa. \r\n\r\n[Head Elf]\r\n\uD83C\uDF84 delete :: Deletes the server's secret santa list (unregisters eveyrone).\r\n\uD83C\uDF84 start :: Assigns everyone their santas and messages them through DM!\r\n\r\n= Questions, comments, concerns? Message my programmer: dutchmargesta#4469 =\r\n```"
          );
        }
        // "register"
        // Adds the user to the file of participants.
        else if (command === "register") {
          try {
            // If the file exists
            if (fs.existsSync(file)) {
              // Grab all the users and format them into an array.
              fs.readFile(file, "utf8", function(err, data) {
                var users = data.split("\n");

                // Check if the user registering is already in the array.
                if (checkUsers(user.id, users)) {
                  // If they aren't in the file, add them.
                  fs.appendFile(file, "\n" + user.id, function(err) {
                    if (err) {
                      return console.log(err);
                    }
                    console.log(
                      `User "${user.id}" added to the "${guild}" secret santa.`
                    );
                  });

                  // Send the message to the user in the channel they registered from.
                  msg.channel.send(`Thank you for registering, <@${user.id}>!`);
                  // Send the user a direct message confirming them.
                  user.send(
                    `You are registered for the "${guild_name}" secret santa!` +
                      "\n" +
                      `Please wait for your head elf (server admin) to initiate the drawing.` +
                      "\n" +
                      "If you decide you would no longer like to participate, please use the command `🎄 unregister`."
                  );
                  // Console log all of the registered users.
                  fs.readFile(file, "utf8", function(err, users) {
                    console.log(users);
                  });
                } else {
                  // If they're in the list already, tell them they've already registered.
                  msg.channel.send(
                    `You are already registered for the secret santa, <@${user.id}>!`
                  );
                }
              });
            } else {
              // If the file doesn't exist, just make the file and add the user (no need to check if user already exists).
              fs.appendFile(file, user.id, function(err) {
                if (err) {
                  return console.log(err);
                }
                console.log(
                  `User "${user.id}" added to the "${guild_name}" secret santa.`
                );
              });

              // Send the message to the user in the channel they registered from.
              msg.channel.send(`Thank you for registering, <@${user.id}>!`);
              // Send the user a direct message confirming them.
              user.send(
                `You are registered for the "${guild_name}" secret santa!` +
                  "\n" +
                  `Please wait for your head elf (server admin) to initiate the drawing.` +
                  "\n" +
                  'If you decide you would no longer like to participate, please use the command `🎄 unregister`.'
              );
              // Console log all of the registered users.
              fs.readFile(file, "utf8", function(err, users) {
                console.log(users);
              });
            }
          } catch (err) {
            console.error(err);
          }
        }
        // "unregister"
        // Removes the user from the file of participants.
        else if (command === "unregister") {
          // Make sure that the file exists.
          try {
            if (fs.existsSync(file)) {
              var deleted = false;
              // Read the file.
              fs.readFile(file, "utf8", function(err, data) {
                var users = data.split("\n");
                // If the user exists, delete the user.
                for (var i = 0; i < users.length; i++) {
                  if (user.id === users[i]) {
                    users.splice(i, 1);
                    deleted = true;
                  }
                }
                // If the user was found and deleted...
                if (deleted) {
                  try {
                    fs.unlinkSync(file);
                  } catch (err) {
                    console.error(err);
                  }
                  // Re-write the file.
                  for (var i = 0; i < users.length; i++) {
                    if (i < users.length - 1) {
                      fs.appendFile(file, users[i] + "\n", function(err) {
                        if (err) {
                          return console.log(err);
                        }
                      });
                    } else {
                      fs.appendFile(file, users[i], function(err) {
                        if (err) {
                          return console.log(err);
                        }
                      });
                    }
                  }

                  // Tell the user that they've been removed.
                  msg.channel.send(
                    `You have been removed from the secret santa, <@${user.id}>.`
                  );
                  // Log that the user has been removed.
                  console.log(
                    `User "${user.id}" removed from the "${guild_name}" secret santa.`
                  );
                  // Console log all of the registered users.
                  fs.readFile(file, "utf8", function(err, users) {
                    console.log(users);
                  });
                } else {
                  msg.channel.sent(
                    `You're not registered for the secret santa, <@${user.id}>!`
                  );
                }
              });
            } else {
              msg.channel.send(
                `There are currently no registrees for this server's secret santa!`
              );
            }
          } catch (err) {
            console.error(err);
          }
        }
        // "date"
        // Check's the date string that the Head Elf set for the exchange.
        else if (command == "date") {
          try {
            if (fs.existsSync(file_date)) {
              fs.readFile(file_date, "utf8", function(err, data) {
                msg.channel.send("Your secret santa date is going to be `" + data + "`. Happy holidays!");
              });
            } else {
              msg.channel.send("It looks like your Head Elf hasn't set a date for the secret santa yet!");
            }
          } catch (err) {
            console.error(err);
          }
        }
        // "participants" 
        // Lists the participants in the secret santa.
        else if (command == "participants") {
          try {
            
          } catch (err) {
            console.error(err);
          }
        }
        // "start" - Head Elf only.
        // Starts the secret santa.
        else if (command === "start") {
          if (checkHeadElf(msg)) {
            try {
              // Check if the file exists.
              if (fs.existsSync(file)) {
                fs.readFile(file, "utf8", function(err, data) {
                  // Read the data from file.
                  var users = data.split("\n");
                  if (users.length >= 2) {
                    // Console log all of the users.
                    msg.channel.send(
                      `Alright, let's do this thing! Getting all of the users...`
                    );
                    console.log(
                      `Users participating in the "${guild_name}" secret santa: `
                    );
                    for (var i = 0; i < users.length; i++) {
                      console.log(users[i]);
                    }
                    // Duplicate user array.
                    var recipients = users.slice(0);
                    msg.channel.send(`...shuffling the santas...`);
                    do {
                      shuffle(recipients);
                    } while (!checkRecipients(users, recipients));
                    msg.channel.send(
                      `Direct messaging all of the participants...`
                    );
                    // Test users DMs.
                    // var id = "105109978926350336";
                    // var id2 = "197484066377957377";
                    // var id2name = client.users.get(id2).username
                    // client.users.get(id).send(`You are ${id2name}'s (<@${id2}>) secret santa!`);
                    for (var i = 0; i < users.length; i++) {
                      var id = users[i];
                      var id2 = recipients[i];
                      var id2name = client.users.cache.get(id2).username;
                      client.users
                        .cache.get(id)
                        .send(`You are ${id2name}'s (<@${id2}>) secret santa!`);
                    }
                    msg.channel.send(
                      `Saving the list of assignments to the server...`
                    );
                    try {
                      if (fs.existsSync("santas/" + guild + ".txt")) {
                        try {
                          fs.unlinkSync("santas/" + guild + ".txt");
                          msg.channel.send(
                            `Previous santa assignments were deleted.`
                          );
                        } catch (err) {
                          console.error(err);
                        }
                      }
                    } catch (err) {
                      console.error(err);
                    }
                    var master = [];
                    for (var i = 0; i < users.length; i++) {
                      master[i] = users[i] + "--->" + recipients[i];
                      console.log(master[i]);
                      fs.appendFile(
                        "santas/" + guild + ".txt",
                        master[i] + "\n",
                        function(err) {
                          if (err) {
                            return console.log(err);
                          }
                        }
                      );
                    }
                    msg.channel.send(
                      `Done! It's up to your head elf now to announce the gift exchange date. Happy holidays!`
                    );
                  } else {
                    msg.channel.send(
                      `There aren't enough participants... try getting more sign-ups!`
                    );
                  }
                });
              } else {
                msg.channel.send(`I can't start a secret santa without any particpants! Try getting at least 2 people to sign up.`);
              }
            } catch (err) {
              console.error(err);
            }
          }
        }
        // "delete" - Head Elf only.
        // Deletes the list of participants for the guild.
        else if (command === "delete") {
          if (checkHeadElf(msg)) {
            fs.unlink(file, err => {
              if (err) {
                console.error(err);
                msg.channel.send(
                  `It looks like "${guild_name}" already doesn't have a secret santa going right now!`
                );
                return;
              }
              console.log(`Participants (${file}) removed.`);
              msg.channel.send(
                `The "${guild_name}" secret santa has been canceled—all participants have been removed.`
              );
            });
          }
        }
        // "sdate" - Head Elf only.
        // Allows the head elf to set a string that contains the date and time for the exchange for their guild.
        else if (command == "sdate") {
          message.splice(0,2);
          date = message.join(" ");
          if (date != "") {
            try {
              // Check if the file exists.
              if (fs.existsSync(file_date)) {
                fs.unlinkSync(file_date);
                fs.appendFile(file_date, date, function(err) {
                 if (err) {
                   return console.error(err);
                 }
                });
                msg.channel.send("I've already found a date for the exchange, so I've gone ahead and replaced it. Anyone can check the date of the secret santa with `🎄 date`. Have fun!");
              } else {
                fs.appendFile(file_date, date, function(err) {
                 if (err) {
                   return console.error(err);
                 }
                });
                msg.channel.send("I've gone ahead and set the date for your secret santa! Anyone can check the date of the secret santa with `🎄 date`. Have fun!");
              }
            } catch (err) {
              console.error(err);
            }
          } else {
            msg.channel.send("I can't set the date without an actual date! Please specify one, like this: `🎄 sdate December 25th, 2020 @ 3:00pm`.")
          }
        }
        // "feet"
        // Joke command for Cameron, one of my bug testers.
        else if (command === "feet") {
          msg.channel.send(`Shut up, Cameron.`);
        }
        // Catch all for non-defined commands.
        else {
          msg.channel.send("I don't understand... try using `🎄 help`!");
        }
      }
    }
  }
});

// checkUsers(user, users)
// Checks recipients and returns false if any user is equal to itself.
function checkUsers(user, users) {
  for (var i = 0; i < users.length; i++) {
    if (users[i] === user) {
      return false;
    }
  }
  return true;
}

// checkRecipients(users, recipients)
// Checks recepients and returns false if any user is equal to itself.
function checkRecipients(users, recipients) {
  for (var i = 0; i < users.length; i++) {
    if (users[i] === recipients[i]) {
      return false;
    }
  }
  return true;
}

// checkHeadElf(msg)
// Permision checking.
function checkHeadElf(msg) {
  var role = msg.guild.roles.cache.find(role => role.name === "Head Elf");
  if (role) {
    if (msg.member.roles.cache.has(role.id)) {
      return true;
    } else {
      msg.channel.send(
        `You are not a <@&${role.id}>, <@${msg.author.id}>! You are unable to use this command.`
      );
      return false;
    }
  } else {
    msg.channel.send(
      'The "Head Elf" role has not been created yet! Make sure your server admin gives someone the role "Head Elf" for them to be able to administrate the secret santa.'
    );
    return false;
  }
}

// shuffle(a)
// Shuffles an array passed into it.
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

// Log in using bot token.
client.login(DISCORD_BOT_TOKEN);