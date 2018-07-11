/*
    Program: Miho-Bot
    - Bot for discord dedicated to MoonArcher clan in Monster Super League.
    Author: GkevinOD (2017)
    Version: 1.0.0
*/

//requirements
fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const chatbot = require("cleverbot.io");

//variables
commands = {};
functions = {};
config = {};
astromonData = {};

console.log("\n *Importing functions and commands");
try{
    functions = require("./functions/functions.js");
    commands = require("./functions/commands.js");
}catch(err){
    console.log("\n *Could not import functions or commands")
}

cbot = new chatbot("t4xvSm3UIjZwymPq", "mNM43opAGRYNZIwSCJMBYC7oWI6Zr9rR");
cbot.setNick("Cheffenia");
cbot.create(function (err, Cheffenia) {});

//reading config files and login client----------------------------------------------------------------------------------
console.log("\n *Reading config files.");
try{
    var astromonDataRaw = fs.readFileSync('./data/astromon.json');
    astromonData = JSON.parse(astromonDataRaw);

    var configRaw = fs.readFileSync('./config/config.json');
    config = JSON.parse(configRaw);
}catch(err){
    console.log("\n *Error in reading config file.");
}

console.log("\n *Logging in discord client.");
client.login(config.client.token);

//event listeners--------------------------------------------------------------------------------------------------------
client.on('ready', () => {
    console.log("\n\n ~~Bot is now ready~~ \n\n");
    client.user.setGame("/help for commands!")
});

currMessage = undefined; //global variable for message
client.on('message', msg => {
    currMessage = msg; 

    //checking for commands
    if(msg.content.substr(0, 1) == "/"){
        console.log(`(${msg.channel.name}) ${msg.author.username}: ${msg.content}`);

        //getting command and arguments
        var commandRaw = msg.content.substring(1).split(" ");

        var name = commandRaw[0];
        var args = commandRaw.splice(1);

        var command = config.commands[name];

        var permission = config.permissions[msg.content.username]

        if(command != undefined){ //is a command
            if(command.permissions[args.length] != undefined){
                if(command.channels.indexOf(msg.channel.name) == -1 && command.channels.indexOf("any") == -1) {msg.reply(`This command is not for this channel!`); return 0;} //checking if command works on the channel
                if(functions.checkPermission(command.permissions[args.length], msg.author.username) == false) {msg.reply(`You do not have permission for this command!\nYou must be at least *${command.permissions[args.length]}* to access this command.`); return 0;}

                commands[command.function](...args);
                fs.writeFileSync("./config/config.json", JSON.stringify(config, null, '\t'));
                msg.delete().catch(err => {console.log("*Could not delete the command.")});
            }else{
                msg.reply(`Incorrect use of */${name}*! Type /help ${name} to see its usage.`);
				msg.delete().catch(err => {console.log("*Could not delete the command.")});
            }
        }else{ //not a command
            msg.reply(`*${name}* command does not exist!`);
			msg.delete().catch(err => {console.log("*Could not delete the command.")});
        }
    }else{
        //checking for mentions
        if(msg.isMentioned(client.user) == true){
            var cleanMsg = msg.content.replace("<@277194611229851648>", "").replace("<@!277194611229851648>", "");
            console.log(`(${msg.channel.name}) ${msg.author.username}: ${cleanMsg}`);
            
            cbot.ask(cleanMsg, function (err, response) {
                if(response == "") response = ". . .";
                msg.reply(response);
                console.log(`(${msg.channel.name}) Cheffenia: ${response}`);
            });
        }else{
            if(msg.content == "ping") {msg.reply("Pong!");}
        }
    }
});