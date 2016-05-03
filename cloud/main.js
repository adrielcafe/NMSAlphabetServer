
Parse.Cloud.define('hello', function(req, res) {
  console.log("NMS LOG");
  console.error("NMS ERROR");
  res.success('Hi');
});
