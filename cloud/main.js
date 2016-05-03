var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

function willAddRelation(obj, relationName){
	var jsonSnippet = '"' + relationName + '":{"__op":"AddRelation"';
	return JSON.stringify(obj).contains(jsonSnippet);
}

function willRemoveRelation(obj, relationName){
	var jsonSnippet = '"' + relationName + '":{"__op":"RemoveRelation"';
	return JSON.stringify(obj).contains(jsonSnippet);
}

Parse.Cloud.beforeSave("AlienWord", function(req, res) {
	var word = req.object;
	if(willAddRelation(word, "users")){
		word.increment("usersCount");
	}
	res.success();
});

Parse.Cloud.beforeDelete("AlienWord", function(req, res) {
	var word = req.object;
	if(willRemoveRelation(word, "users")){
		word.decrement("usersCount");
	}
	res.success();
});
