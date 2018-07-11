module.exports = {
    /* 
    function: titanAdd
    - Adds a user to a queue for titans within that channel.
    pre:
        -Global variable of Message class named 'currMessage'.
        -Must have config set.
    parameters:
        [arg1] - Element of the titan queue.
        [arg2] - String of the name of the user.
    returns:
        - If failed to add user, returns 0.
        - If succeeded to add user, returns 1.
    author: GkevinOD (2017)
    */
    titanAdd: function(arg1, arg2) {
        var channel = config.channels[currMessage.channel.name];

        if(arg2 == undefined){
                if(arg1 == undefined){ /* add */
                    if(channel.titan == "unknown") {currMessage.reply("Current titan has not been set! Try /add *element* instead!"); return 0;}
                    if(channel.queue[channel.titan].indexOf(currMessage.author.username) != -1) {currMessage.reply(`You are already in the queue for the ${channel.titan} titan! Type /queue ${channel.titan} to check the queue.`); return 0;}
                    channel.queue[channel.titan].push(currMessage.author.username);
                    currMessage.reply(`You have been added to the ${channel.titan} titan queue!`);
                }else{ /* add <element> */
                    if(channel.queue[arg1] == undefined) {currMessage.reply(`Unknown element: *${arg1}*! Available titan are: light, wood, water, dark, fire.`); return 0;}
                    if(channel.queue[arg1].indexOf(currMessage.author.username) != -1) {currMessage.reply(`You are already in the queue for the ${arg1} titan! Type /queue ${arg1} to check the queue.`); return 0;}
                    channel.queue[arg1].push(currMessage.author.username);
                    currMessage.reply(`You have been added to the ${arg1} titan queue!`);
                }
        }else{ /* add <element> <user> */
            if(channel.queue[arg1] == undefined) {currMessage.reply(`Unknown element: *${arg1}*! Available titan are: light, wood, water, dark, fire.`); return 0;}
            if(channel.queue[arg1].indexOf(arg2) != -1) {currMessage.reply(`${arg2} is already in the queue for the ${arg1} titan! Type /queue ${arg1} to check the queue.`); return 0;}
            channel.queue[arg1].push(arg2);
            currMessage.reply(`You have added *${arg2}* to the ${arg1} titan queue!`);
        }

        return 1;
    },

    /*
    function: titanRemove
    - Removes a user from a queue for titans within that channel.
    pre:
        -Global variable of Message class name 'currMessage'.
        -must have config set.
    parameters:
        [arg1] - Element of the titan queue.
        [arg2] - String of the name of the user.
    returns:
        -If failed to remove user, returns 0.
        -If succeeded to remove user, returns 1.
    author: GkevinOD (2017)
    */
    titanRemove: function(arg1, arg2) {
        var channel = config.channels[currMessage.channel.name];

        if(arg2 == undefined){
            if(arg1 == undefined){ /* remove */
                if(channel.titan == "unknown") {currMessage.reply("Current titan has not been set! Try /remove *element* instead!"); return 0;}

                var index = channel.queue[channel.titan].indexOf(currMessage.author.username);
                if(index == -1) {currMessage.reply(`You are not in the ${channel.titan} titan queue!`); return 0;}

                channel.queue[channel.titan].splice(index, 1);
                currMessage.reply(`You have been removed from the ${channel.titan} titan queue!`);
            }else{ /* remove <element> */ /* remove all */
				if (arg1 == "all") { 
					if(channel.queue.fire == undefined) {currMessage.reply(`This channel does not have a queue system!`); return 0;}
					
					currMessage.reply(`You have cleared the queue for all titan!`);
					channel.queue.fire = []; channel.queue.light = []; channel.queue.wood = []; channel.queue.water = []; channel.queue.dark = [];
					return 1;
				}
				
                if (channel.queue[arg1] == undefined) {currMessage.reply(`Unknown element: *${arg1}*! Available titan are: light, wood, water, dark, fire.`); return 0;}

                var index = channel.queue[arg1].indexOf(currMessage.author.username);
                if(index == -1) {currMessage.reply(`You are not in the ${arg1} titan queue!`); return 0;}

                channel.queue[arg1].splice(index, 1);
                currMessage.reply(`You have been removed from the ${arg1} titan queue!`);
            }
        }else{ /* remove <element> <userID> */
             if (channel.queue[arg1] == undefined) {currMessage.reply(`Unknown element: *${arg1}*! Available titan are: light, wood, water, dark, fire.`); return 0;}
             if (arg2 == "all") {currMessage.reply(`You have cleared the queue for ${arg1} titan!`); channel.queue[arg1] = []; return 1;}

             var index = parseInt(arg2)-1;
             if (isNaN(index) == true) { //non-number
                index = channel.queue[arg1].indexOf(arg2);
                if (index == -1) {currMessage.reply(`The player you have entered is not valid! Type /queue ${arg1} to check the queues.`); return 0;}
            }else{ //number
                if (channel.queue[arg1][index] == undefined) {currMessage.reply(`The queue id you have entered is not valid! Type /queue ${arg1} to check the queues.`); return 0;}
             }

             currMessage.reply(`You have removed *${channel.queue[arg1][index]}* from the ${arg1} titan queue!`);
             channel.queue[arg1].splice(index, 1);
         }

        return 1;
    },

    /*
    function: titanQueue
    -Shows the queue for an element titan.
    pre:
        -Global variable of Message class name 'currMessage'.
        -must have config set.
    parameters:
        -arg1: Element of the titan to check queue for.
    return:
        -On success, returns 1.
        -On fail, returns 0.
    author: GkevinOD (2017)
    */
    titanQueue : function(arg1){
        var channel = config.channels[currMessage.channel.name];
        var element = "";

        if(arg1 == undefined){  /* queue */
            if(channel.titan == "unknown") {currMessage.reply("Current titan has not been set! Try /queue *element* instead!"); return 0;}
            element = channel.titan;
        }else{ /* queue <element> */
            if (channel.queue[arg1] == undefined) {currMessage.reply(`Unknown element: *${arg1}*! Available titan are: light, wood, water, dark, fire.`); return 0;}
            element = arg1;
        }

        if(channel.queue[element].length == 0) {currMessage.reply(`There is no one in queue for ${element} titan! To add yourself to the queue try: /add`); return 0;}
        
        var strQueue = `Current queue for ${element} titan: \n`;
        for(var i = 0; i < channel.queue[element].length; i++){
            strQueue += (i+1) + ". " + channel.queue[element][i] + "\n";
        }
        currMessage.channel.sendCode("text", strQueue);

        return 1;
    },

    /*
    functions: titan
    -Display or modify current titan.
    parameters:
        -[arg1]: If there is argument, argument is to set titan.
    returns:
        -on success, return 1;
        -on fail, return 0;
    author: GkevinOD (2017)
    */
    titan : function(arg1) {
        var channel = config.channels[currMessage.channel.name];
        if(arg1 == undefined){ /* titan */
            if(channel.titan == "unknown") {currMessage.reply(`Current titan has not been set. Ask a moderator to change the titan!`); return 0;};
            
            var passive = ""; var active = "";
            switch(arg1){
                case "fire":
                    passive = "Thirst"; active = "Stun"; break;
                case "light":
                    passive = "Atk Down"; active = "Seal"; break;
                case "wood":
                    passive = "Fatigue"; active = "Def Down"; break;
                case "water":
                    passive = "Seal"; active = "Atk Down"; break;
                case "dark":
                    passive = "Silence"; active = "Def Down"; break;
                default:
                    passive = "unknown"; active = "unknown";
            }

            currMessage.reply(`Current titan is ${channel.titan} titan! Passive: ${passive}, Active: ${active}`);
        }else{ /* titan <element>*/
            if(arg1 == "off") {currMessage.channel.send(channel.mention + `Clan titan is now over! The clan will be notified when titan changes!`); channel.titan = "unknown"; return 0;}
            if(channel.queue[arg1] == undefined) {currMessage.reply(`Unknown element: *${arg1}*! Available titan are: light, wood, water, dark, fire.`); return 0;}

            var passive = ""; var active = "";
            switch(arg1){
                case "fire":
                    passive = "Thirst"; active = "Stun"; break;
                case "light":
                    passive = "Atk Down"; active = "Seal"; break;
                case "wood":
                    passive = "Fatigue"; active = "Def Down"; break;
                case "water":
                    passive = "Seal"; active = "Atk Down"; break;
                case "dark":
                    passive = "Silence"; active = "Def Down"; break;
                default:
                    passive = "unknown"; active = "unknown";
            }

            currMessage.channel.send(channel.mention + `, Titan has changed to ${arg1} titan! Passive: ${passive}, Active: ${active}`);
            channel.titan = arg1;
        }

        var strQueue = `Current queue for ${channel.titan} titan: \n`;
        for(var i = 0; i < channel.queue[channel.titan].length; i++){
            strQueue += (i+1) + ". " + channel.queue[channel.titan][i] + "\n";
        }
        currMessage.channel.sendCode("text", strQueue);

        return 1;
    },

    /*
    function: clean
    -Cleans all the miho posts and if miho is mentioned clean that too.
    pre:
        -Have currMessage as global variable, Message class.
    parameters: N/A
    return: N/A
    post:
        -Discord chat will be cleaned of some posts.
    author: GkevinOD (2017)
    */
    clean : function(){
        currMessage.channel.fetchMessages({limit: 20})
         .then(messages => currMessage.channel.bulkDelete(messages.filterArray(function (temp){return (temp.author.username == "Miho");})))
         .catch(err => null);

        currMessage.channel.fetchMessages({limit: 20})
         .then(messages => currMessage.channel.bulkDelete(messages.filterArray(function (temp){return (temp.content.indexOf("277194611229851648") != -1);})))
         .catch(err => null);
    },

    /*
    function: displayAstromon
    -Display astromon tier, max stats, skills
    pre:
        -must have currMessage as Message global.
        -astromonData must be set.
    parameters:
        -element: Element of the astromon.
        -astromon: Name of the astromon.
    returns:
        -On success, returns 1
        -On fail, returns 0
    author: GkevinOD (2017)
    */
    displayAstromon: function(element, astromon){
        astromon = astromon.toLowerCase();
        if(astromonData[astromon] == undefined) {currMessage.reply(`Astromon, *${astromon}*, not found! Try to type the evo1 name!`); return 0;}
        
        var monster = astromonData[astromon][element];
        if(monster == undefined) {currMessage.reply(`The *${element}* element for this astromon does not exist! Try another element!`); return 0;}

        currMessage.reply(`Here is the stats for ${element} ${astromon.substr(0,1).toUpperCase()}${astromon.substr(1)}:`);
        var gemSplit = monster.gem.split(" ");

        currMessage.channel.sendCode("text", `Leader bonus: ${astromonData[astromon].leader}\nPassive skill: ${monster.passive}\nActive skill: ${monster.active}\nTarget: ${monster.target}\nMax HP: ${monster.hp}\nMax Attack: ${monster.attack}\nMax Defense: ${monster.defense}\nMax Recovery: ${monster.recovery}\nRecommended Gems: (${gemSplit[3]}) ${gemSplit[0]} + ${gemSplit[1]} + ${gemSplit[2]}`)
    },

    /*
    function: help
    -Display the help for all commands.
    pre:
        -currMessage as global variable, Message class.
        -config file must be set with all commands and help.
    parameters:
        -[arg1] - Command name.
    returns:
        -On success, returns 1;
        -On fail, returns 0;
    */
    help: function(arg1){
        if(arg1 == undefined){ /* help */
            currMessage.author.sendCode("text", config.commands.help.help);
        }else{ /* help command */
            if(config.commands[arg1] == undefined) {currMessage.reply(`*${arg1}* command does not exist! Type /help for the list of commands.`); return 0;}

            currMessage.author.sendCode("text", config.commands[arg1].help);
        }
        return 1;
    },

    /*
    function: purge
    -Deletes number of messages in chat
    pre:
        -currMessage as global variable, Message class.
        -config file must be set all commands and help.
    parameters:
        -[arg1] - Number of messages to Deletes
    returns:
        -On success, returns 1;
        -On fail, returns 0;
    */
    purge: function(arg1){
        var num = parseInt(arg1);
        if (arg1 == undefined) {num = 10;}
        if (isNaN(num) == true) {currMessage.reply(`${arg1} is a invalid input for the purge command.`); return 0;}
        if (num > 100 || num < 1) {currMessage.reply(`${arg1} has to be greater than 1 and less than 100.`); return 0;}
        num++;

        currMessage.channel.fetchMessages({limit: num})
         .then(messages => currMessage.channel.bulkDelete(messages))
         .catch(err => null);

        return 1;
    }
}