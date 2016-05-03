var wordClass = Parse.Object.extend("AlienWord");
var wordTranslationClass = Parse.Object.extend("AlienWordTranslation");

Parse.Cloud.afterSave("AlienWord", function(req) {
	var tag =  "afterSave_AlienWord";
	var wordId = req.object.id;
	console.log(wordId + ", " + wordClass + ", " + JSON.stringify(wordClass));
});
