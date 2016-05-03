var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

function printError(tag, error){
	if(error){
		console.error("ERROR " + tag + ":" + error["code"] + " - " + error["message"]);
	}
};

Parse.Cloud.afterSave("AlienWord", function(req) {
	var tag =  "afterSave_AlienWord";
	var word = req.object;
	console.log("USERSCOUNT1: " + word.get("usersCount"));
	word.increment("usersCount");
	word.save();
	console.log("USERSCOUNT2: " + word.get("usersCount"));
});
