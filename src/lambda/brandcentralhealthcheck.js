'use strict';

var http = require('http');
//var http = require('request');

var itemCountURL = 'http://deliver.turnerbrandcentral.com/api/item/count';
var taskCountURL = 'http://deliver.turnerbrandcentral.com/task';
var recentlyIngestedCountURL = 'http://deliver.turnerbrandcentral.com/api/job/1?&type=AUTO_IMPORT&state=FINISHED&from=2017-10-12&to=2017-10-14';

const getItemCount = function(text){
    return new Promise((resolve, reject) => {
        http.get(itemCountURL, function(res) {
            res.on('data', function (chunk) {
              resolve(text + ' and Total Item Count is ' + chunk);
            });
          }).end();
        });
};

const getTaskCount = function(){
    return new Promise((resolve, reject) => {
        http.get(taskCountURL, function(res) {
            res.on('data', function (d) {
                resolve('Total Pending Jobs is ' + JSON.parse(d).length);
            });
            res.on('error', function (e) {
                 console.error(e);
             });
          })
    });
};

const getRecentlyIngestedCount = function(text){
    return new Promise((resolve, reject) => {
        http.get(recentlyIngestedCountURL, function(res) {
            
            // temporary data holder
              const body = [];
              // on every content chunk, push it to the data array
              res.on('data', (chunk) => body.push(chunk));
              
            //   //response.on('end', () => resolve(body.join('')));
            //   res.on('end', (body) => 
            //     console.log("test");
            //   resolve(body.join('')[2])
                    
            //   );
              
             // res.on('end', () => resolve(JSON.stringify(body.join('')).hits);
              //JSON.stringify(someJSObject
              
              //res.on('end', () => resolve(text + body.length);
              
            //   res.on('end', body,function (d) {
            //     console.log('timmy said', d);
            //     //var obj = JSON.parse(d);
            //     resolve(text + ' and Total Ingested Count4 Today is ');
            // });
              
            res.on('end', function (d) {
                console.log('timmy said', body.join(''));
                var result = JSON.parse(body.join(''));
                //var obj = JSON.parse(d);
                resolve(text + ' and Total Ingested Count Today is ' + result.hits);
            });
            // console.log('timmy said', JSON.parse(res));
            // //var obj = JSON.parse(res);
            // resolve(text + ' and Total Ingested Count Today is ');
            res.on('error', function (e) {
                 console.error(e);
             });
          })
    });
};

function makeCall (callback) {
    getTaskCount()
    .then((taskCount) =>
        getItemCount(taskCount)
        )
    .then((itemCount) =>
        getRecentlyIngestedCount(itemCount)
        )
        .then((totalCount) =>
            callback(totalCount));
}

// Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled 
function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}
 
// --------------- Events -----------------------
 
function dispatch(intentRequest, callback) {
    console.log('request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.intentName}');
    const sessionAttributes = intentRequest.sessionAttributes;

    makeCall(function(results){ 
        callback(close(sessionAttributes, 'Fulfilled',
        {'contentType': 'PlainText', 'content': results}));
        
    })
   
}
 
// --------------- Main handler -----------------------
 
// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
    try {
        dispatch(event,
            (response) => {
                callback(null, response);
            });
    } catch (err) {
        callback(err);
    }
};