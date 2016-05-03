var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

function printError(tag, error){
	if(error){
		console.error("ERROR " + tag + ":" + error["code"] + " - " + error["message"]);
	}
};

Parse.Cloud.afterSave("AlienWord", function(req) {
	var tag =  "afterSave_AlienWord";
	var wordId = req.object.id;
	new Parse.Query(wordClass).get(wordId).then(function(word) {
	    word.increment("usersCount");
	    word.save();
	  }, function(error) {
	    throw "Got an error " + error.code + " : " + error.message;
	});
});
