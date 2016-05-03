var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

// AlienWord
Parse.Cloud.beforeSave("AlienWord", function(req, res) {
	var word = req.object;
	console.log("BEFORESAVE1: " + word);
	console.log("BEFORESAVE2: " + word.get("users")._op);
	word.set("word", word.get("word").toUpperCase())
	if(willAddRelation(word, "users")){
		word.increment("usersCount");
	} else if(willRemoveRelation(word, "users")){
		console.log("DECREMENT");
		word.decrement("usersCount");
	}
	res.success();
});

// AlienWordTranslation
Parse.Cloud.beforeSave("AlienWordTranslation", function(req, res) {
	var wordTranslation = req.object;
	wordTranslation.set("translation", wordTranslation.get("translation").toUpperCase())
	wordTranslation.set("language", wordTranslation.get("language").toLowerCase())
	if(willAddRelation(wordTranslation, "users")){
		wordTranslation.increment("usersCount");
	} else if(willRemoveRelation(wordTranslation, "users")){
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
