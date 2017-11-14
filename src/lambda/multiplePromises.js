var http = require('http');
var urls = ['http://bc-prod-deliver-elb-302405749.us-east-1.elb.amazonaws.com/task', 'http://bc-prod-deliver-elb-302405749.us-east-1.elb.amazonaws.com/api/item/count'];
var completed_requests = 0;

var itemCountURL = 'http://bc-prod-deliver-elb-302405749.us-east-1.elb.amazonaws.com/api/item/count';

getItemCount = function(size){
  return new Promise((resolve, reject) => {
  // reject and resolve are functions provided by the Promise
  // implementation. Call only one of them.

  
  //var id = event.id;"");

  var query = client.query("UPDATE beercount SET beercount = (beerCount + 1) WHERE beersize = " + size);

  query.on("end", function (result) {
      resolve('SUCCESS is here');
  });
})
}

urls.forEach(function(url) {
  var responses = [];
  http.get(url, function(res) {
    res.on('data', function(chunk){
      responses.push(chunk);
    });

    res.on('end', function(){
      if (completed_requests++ == urls.length - 1) {
        // All downloads are completed
        console.log('body:', responses.join());
      }      
    });
  });
})