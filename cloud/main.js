var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

// AlienWord
Parse.Cloud.beforeSave("AlienWord", function(req, res) {
	var word = req.object;
	word.set("word", word.get("word").toUpperCase());
	console.log("BEFORE: "+word.get("usersCount"));
	word.increment("usersCount", getRelationIncrement(word));
	console.log("AFTER: "+word.get("usersCount"));
	res.success();
});

// AlienWordTranslation
/*Parse.Cloud.beforeSave("AlienWordTranslation", function(req, res) {
	var wordTranslation = req.object;
	console.log("TRANSLATE 1: "+JSON.stringify(wordTranslation));
	wordTranslation.set("translation", wordTranslation.get("translation").toUpperCase());
	wordTranslation.set("language", wordTranslation.get("language").toLowerCase());
	if(willAddRelation(wordTranslation, "users")){
		wordTranslation.increment("usersCount", 1);
	} else if(willRemoveRelation(wordTranslation, "users")){
		wordTranslation.increment("usersCount", -1);
	}
	console.log("TRANSLATE 2: "+JSON.stringify(wordTranslation));
	res.success();
});*/

// Util
function getRelationIncrement(obj){
	if(!obj.isNew()) {
		var relQueueJsonStr = JSON.stringify(obj.op(ClassConstants.Item.RELATION_QUEUE));
		if(relQueue !== undefined) {
			var relQueue = JSON.parse(relQueueJsonStr);
			var operation = relQueue.__op;
			if (operation == "AddRelation"){
				return 1;
			} else {
				return -1;
			}
		}
	}
	return 0;
}

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
