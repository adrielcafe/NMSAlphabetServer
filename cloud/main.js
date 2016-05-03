var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

function printError(tag, error){
	if(error){
		console.error("ERROR " + tag + ":" + error["code"] + " - " + error["message"]);
	}
};

Parse.Cloud.beforeSave("AlienWord", function(req, res) {
	var tag =  "afterSave_AlienWord";
	var word = req.object;
	word.increment("usersCount");
	word.save();
	res.success();
});
