
Parse.Cloud.define('hello', function(req, res) {
  console.log("NMSALPHABET LOG");
  console.error("NMSALPHABET ERROR");
  res.success('Hi');
});
