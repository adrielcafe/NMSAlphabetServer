var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

// AlienWord
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

// AlienWordTranslation
Parse.Cloud.beforeSave("AlienWordTranslation", function(req, res) {
	var wordTranslation = req.object;
	if(willAddRelation(wordTranslation, "users")){
		wordTranslation.increment("usersCount");
	}
	res.success();
});
Parse.Cloud.beforeDelete("AlienWordTranslation", function(req, res) {
	var wordTranslation = req.object;
	if(willRemoveRelation(wordTranslation, "users")){
		wordTranslation.decrement("usersCount");
	}
	res.success();
});

// Util
function willAddRelation(obj, relationName){
	var jsonSnippet = '"' + relationName + '":{"__op":"AddRelation"';
	return JSON.stringify(obj).contains(jsonSnippet);
}
function willRemoveRelation(obj, relationName){
	var jsonSnippet = '"' + relationName + '":{"__op":"RemoveRelation"';
	return JSON.stringify(obj).contains(jsonSnippet);
}

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
