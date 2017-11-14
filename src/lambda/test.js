'use strict';

var http = require('http');

var url = 'http://bc-prod-deliver-elb-302405749.us-east-1.elb.amazonaws.com/task';
var url2 = 'http://bc-prod-deliver-elb-302405749.us-east-1.elb.amazonaws.com/api/item/count';

function makeCall (url, callback) {
    http.get(url,function (res) {
        res.on('data', function (d) {
             callback(JSON.parse(d));
        });
        res.on('error', function (e) {
            console.error(e);
        });
    });
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

    makeCall(url, function(results){ 
        callback(close(sessionAttributes, 'Fulfilled',
        {'contentType': 'PlainText', 'content': `You have ` + results.length + ' jobs waiting to be processed in Brand Central'}));
        
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