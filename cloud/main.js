var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

var error1 = "Word already registered";
var error2 = "Word already translated to ";


// AlienWord
Parse.Cloud.beforeSave("AlienWord", function(req, res) {
	var newWord = req.object;
	if(!newWord.get("objectId") || willAddRelation(newWord, "users") || willRemoveRelation(newWord, "users")){
		saveWord(newWord, res);
	} else {
		var query = new Parse.Query(wordClass);
		query.equalTo("race", newWord.get("race"));
		query.equalTo("word", newWord.get("word"));
		query.find({
			success: function(word) {
				if(word){
	      				res.error(error1);
				} else {
					saveWord(word, res);
				}
			},
			error: function(error) {
	      			res.error(error.code + ": " + error.message);
			}
		});
	}
});

function saveWord(word, res){
	word.set("word", word.get("word").toUpperCase());
	if(willAddRelation(word, "users")){
		word.increment("usersCount", 1);
	} else if(willRemoveRelation(word, "users")){
		word.increment("usersCount", -1);
	}
	res.success();
}


// AlienWordTranslation
Parse.Cloud.beforeSave("AlienWordTranslation", function(req, res) {
	var newWordTranslation = req.object;
	if(!newWordTranslation.get("objectId") || willAddRelation(newWordTranslation, "users") || willRemoveRelation(newWordTranslation, "users")){
		saveWord(newWordTranslation, res);
	} else {
		var query = new Parse.Query(wordTranslationClass);
		query.equalTo("race", newWordTranslation.get("race"));
		query.equalTo("word", newWordTranslation.get("word"));
		query.equalTo("language", newWordTranslation.get("language"));
		query.find({
			success: function(wordTranslation) {
				if(wordTranslation){
	      				res.error(error2 + wordTranslation.get("language"));
				} else {
					saveWordTranslation(wordTranslation, res);
				}
			},
			error: function(error) {
	      			res.error(error.code + ": " + error.message);
			}
		});
	}
});

function saveWordTranslation(wordTranslation, res){
	wordTranslation.set("translation", wordTranslation.get("translation").toUpperCase())
	wordTranslation.set("language", wordTranslation.get("language").toLowerCase())
	if(willAddRelation(wordTranslation, "users")){
		wordTranslation.increment("usersCount", 1);
	} else if(willRemoveRelation(wordTranslation, "users")){
		wordTranslation.increment("usersCount", -1);
	}
	res.success();
}


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
