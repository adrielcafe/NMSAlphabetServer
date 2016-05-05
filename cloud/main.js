var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

// AlienWord
Parse.Cloud.beforeSave("AlienWord", function(req, res) {
	var word = req.object;
	word.set("word", word.get("word").toUpperCase());
	if(willAddRelation(word, "users")){
		word.increment("usersCount", 1);
	} else if(willRemoveRelation(word, "users")){
		word.increment("usersCount", -1);
	}
	res.success();
});

// AlienWordTranslation
Parse.Cloud.beforeSave("AlienWordTranslation", function(req, res) {
	var wordTranslation = req.object;
	console.log("TRANSLATE 1: "+wordTranslation.get("translation"));
	wordTranslation.set("translation", wordTranslation.get("translation").toUpperCase());
	wordTranslation.set("language", wordTranslation.get("language").toLowerCase());
	console.log("TRANSLATE 2: "+wordTranslation.get("translation"));
	if(willAddRelation(wordTranslation, "users")){
		wordTranslation.increment("usersCount", 1);
	} else if(willRemoveRelation(wordTranslation, "users")){
		wordTranslation.increment("usersCount", -1);
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
