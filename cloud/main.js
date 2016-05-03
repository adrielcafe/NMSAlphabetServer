var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

function printError(tag, error){
	if(error){
		console.error("ERROR " + tag + ":" + error["code"] + " - " + error["message"]);
	}
};

Parse.Cloud.beforeSave("AlienWord", function(req, res) {
	var word = req.object;
	var users = word.get("users");
	console.log("USERS 1: " + users.get("__op"));
	console.log("USERS 2: " + users.__op);
	word.increment("usersCount");
	res.success();
});
