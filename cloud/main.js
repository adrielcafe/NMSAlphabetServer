var _ = require('underscore');

var Race = Parse.Object.extend("AlienRace");
var Word = Parse.Object.extend("AlienWord");
var WordTranslation = Parse.Object.extend("AlienWordTranslation");

Parse.Cloud.define("translateWords", function(req, res) {
	var words = _(req.params.words).toArray();
	var race = Race.createWithoutData(req.params.raceId);
	var language = req.params.language;
	var translations = {};

	var qWords = new Parse.Query(Word);
	qWords.containedIn("word", words);
	qWords.equalTo("race", race);
	qWords.find({
		success: function(results) {
			function getTranslation(word){
				var qTranslations = new Parse.Query(WordTranslation);
				qTranslations.equalTo("language", language);
				qTranslations.equalTo("race", race);
				qTranslations.equalTo("word", word);
				qTranslations.greaterThan("likesCount", 0);
				qTranslations.descending("likesCount");
				qTranslations.ascending("dislikesCount");
				return qTranslations.first().then(function(translation){
					translations[word.get("word")] = translation;
				});
			}

			Parse.Promise.when(results.map(getTranslation)).then(function(){
				res.success(translations);
			});
		},
		error: function(error) {
    		console.log("Error: " + error.code + " " + error.message);
    		res.error();
		}
	});
});

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

Parse.Cloud.beforeSave("AlienWordTranslation", function(req, res) {
	var wordTranslation = req.object;
	wordTranslation.set("translation", wordTranslation.get("translation").toUpperCase());
	wordTranslation.set("language", wordTranslation.get("language").toLowerCase());
	if(willAddRelation(wordTranslation, "users")){
		wordTranslation.increment("usersCount", 1);
	} else if(willRemoveRelation(wordTranslation, "users")){
		wordTranslation.increment("usersCount", -1);
	}
	if(willAddRelation(wordTranslation, "likes")){
		wordTranslation.increment("likesCount", 1);
	} else if(willRemoveRelation(wordTranslation, "likes")){
		wordTranslation.increment("likesCount", -1);
	}
	if(willAddRelation(wordTranslation, "dislikes")){
		wordTranslation.increment("dislikesCount", 1);
	} else if(willRemoveRelation(wordTranslation, "dislikes")){
		wordTranslation.increment("dislikesCount", -1);
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
