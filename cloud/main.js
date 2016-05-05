var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

// AlienWord
Parse.Cloud.beforeSave("AlienWord", function(req, res) {
	var newWord = req.object;
	console.log("WORD STR: "+newWord.get("word"));
	var query = new Parse.Query(wordClass);
	query.equalTo("race", newWord.get("race"));
	query.equalTo("word", newWord.get("word"));
	query.find({
		success: function(word) {
			console.log("WORD: "+word);
			if(word){
				console.log("OK");
			} else {
				console.log("NOPE");
			}
			res.success();
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
	/*word.set("word", word.get("word").toUpperCase())
	if(willAddRelation(word, "users")){
		word.increment("usersCount", 1);
	} else if(willRemoveRelation(word, "users")){
		word.increment("usersCount", -1);
	}*/
});

// AlienWordTranslation
Parse.Cloud.beforeSave("AlienWordTranslation", function(req, res) {
	var wordTranslation = req.object;
	wordTranslation.set("translation", wordTranslation.get("translation").toUpperCase())
	wordTranslation.set("language", wordTranslation.get("language").toLowerCase())
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
