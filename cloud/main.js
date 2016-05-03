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
	console.log("WORD: " + JSON.stringify(word));
	word.get("users").query().count({
		success: function(usersCount) {
			console.log("USERSCOUNT: " + userscount);
			word.set("usersCount", usersCount);
			word.save();
		},
		error: function(error) {
			printError(tag, error);
		}
	});
});
