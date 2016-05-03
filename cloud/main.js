var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

function printError(tag, error){
	if(error){
		console.error("ERROR " + tag + ":" + error["code"] + " - " + error["message"]);
	}
};

function isAddRelation(obj, relationName){
	var jsonSnippet = '"' + relationName + '":{"__op":"AddRelation"';
	console.log(jsonSnippet);
	return JSON.stringify(obj).contains(jsonSnippet);
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
