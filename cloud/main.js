var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

function printError(tag, error){
	if(error){
		console.error("ERROR " + tag + ":" + error["code"] + " - " + error["message"]);
	}
};

Parse.Cloud.beforeSave("AlienWord", function(req, res) {
	var word = req.object;
	console.log("WORD 1: " + JSON.stringify(req));
	console.log("WORD 2: " + JSON.stringify(req.object));
	word.increment("usersCount");
	res.success();
});
