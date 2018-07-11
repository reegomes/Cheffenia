module.exports = {
    /*
        function: createConfig
        -Appends a config for a channel that does not have a config.
        parameters:
            -<newChannel>: Channel name to be added to the config.
        returns: 
            -If succeeds saving new config, return 1
            -If fail to save to config, return 0
        author: GkevinOD (2017)
    */
    createConfig: function(newChannel) {
        if(config.channels[newChannel] == undefined) {
            config.channels[newChannel] = {
                "titan": "unknown",
                "mention": "",
                "queue": {
                    "light": [],
                    "wood": [],
                    "water": [],
                    "dark": [],
                    "fire": []
                }
            }

            //saving config
            try{
                    fs.writeFileSync("./config/config.json", JSON.stringify(config, null, '\t'));
                    console.log(`* Added ${newChannel} to config`);
                    return 1;
            }catch (err){
                console.log(`* Failed to add ${newChannel} to config`);
                return 0;
            }
        }
    },

    /*
    function: checkPermission
    -Checks config if user has the level of permission required.
    pre: 
        -config global variable must be available.
    parameters:
        -<permRequire> - Minimum level of permission to check for.
        -<username> - Username of the user.
    returns:
        -If has permission, returns true.
        -If do not have permission, returns false.
    author: GkevinOD (2017)
    */
   checkPermission: function(permRequire, username) {
    //getting user permission
    var userPerm = config.permissions[username];

    if(userPerm == undefined) { //if undefined, create new permission for user as 'member'
        userPerm = "member"; config.permissions[username] = userPerm;
        fs.writeFileSync("./config/config.json", JSON.stringify(config, null, '\t'));
    }

    var inherit = config.inheritpermission[userPerm];
    while(inherit != undefined){ //loop through inherit permission
        if(permRequire == inherit) return true;
        inherit = config.inheritpermission[inherit];
    }

    if(permRequire == userPerm) return true; else return false;
    }
}