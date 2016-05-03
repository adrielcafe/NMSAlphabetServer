var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

function printError(tag, error){
	if(error){
		console.error("ERROR " + tag + ":" + error["code"] + " - " + error["message"]);
	}
};

function isAddRelation(obj){
	console.log(JSON.stringify(obj));
	console.log(JSON.stringify(obj).contains("AddRelation")+"");
	return JSON.stringify(obj).contains("AddRelation");
}

Parse.Cloud.beforeSave("AlienWord", function(req, res) {
	var word = req.object;
	var users = word.get("users");
	if(isAddRelation(word)){
		console.log("USERS INCREMENT");
		word.increment("usersCount");
	}
	res.success();
});
