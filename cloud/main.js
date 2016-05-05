var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

var errorWordAlreadyRegistered = "Word already registered";

// AlienWord
Parse.Cloud.beforeSave("AlienWord", function(req, res) {
	var newWord = req.object;
	if(!newWord.get("objectId") || willAddRelation(newWord, "users") || willRemoveRelation(newWord, "users")){
		if(willAddRelation(newWord, "users")){
			newWord.increment("usersCount", 1);
		} else if(willRemoveRelation(newWord, "users")){
			newWord.increment("usersCount", -1);
		}
		res.success();
	} else {
		var query = new Parse.Query(wordClass);
		query.equalTo("race", newWord.get("race"));
		query.equalTo("word", newWord.get("word"));
		query.find({
			success: function(word) {
				if(word){
	      				res.error(errorWordAlreadyRegistered);
				} else {
					word.set("word", word.get("word").toUpperCase())
					if(willAddRelation(word, "users")){
						word.increment("usersCount", 1);
					} else if(willRemoveRelation(word, "users")){
						word.increment("usersCount", -1);
					}
					res.success();
				}
			},
			error: function(error) {
	      			res.error(error.code + ": " + error.message);
			}
		});
	}
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
