const express = require('express');
const fs = require('fs');
var path = require('path');
var cors = require('cors') ;
var bodyParser = require('body-parser');

const libSQLite = require('./libSQLite.js') ;



const app = express();
app.use(express.static('./public/')) ;
app.use(cors()) ;
app.use(express.json({limit: '50mb'}));

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const userID = 'alexszhang@gmail.com' ;
const port = 10088 ;//parseInt(process.env.YouTubePort);

console.log(`port:${port}`) ;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});



app.get('/fetchHoldings.V1', fetchHoldingsV1) ;             // http://127.0.0.1:10088/fetchHoldings.V1
app.get('/fetchAllTickers.V1', fetchAllTickersV1) ;         // http://127.0.0.1:10088/fetchAllTickers.V1
app.post('/updateQuote.V1/', updateQuoteV1) ;               
app.get('/fetchQuoteTTM.V1/:ticker', fetchQuoteTTMV1) ;    //http://127.0.0.1:10088/fetchQuoteTTM.V1/:01038

app.get('/fetchAllTriggers.V1', fetchAllTriggersV1) ;         // http://127.0.0.1:10088/fetchAllTriggers.V1
app.post('/updateTrigger.V1/', updateTriggerV1) ;               

app.post('/logTransaction.V1/', logTransactionV1) ;               
app.post('/updateDIV.V1/', updateDIVV1) ;               


async function fetchHoldingsV1(request, response) {
    let jsonHoldings = await libSQLite.fetchAllHoldings() ;
    console.log(jsonHoldings) ;
    response.json(jsonHoldings) ;
}


async function fetchAllTickersV1(request, response) {
  let jsonHoldings = await libSQLite.fetchAllTickers() ;
  console.log(jsonHoldings) ;
  response.json(jsonHoldings) ;
}


async function updateQuoteV1(request, response) {
  let jsonQuote = request.body ;
  //console.log(`updateGatewayV1:${jsonData}`) ;
  //console.log(JSON.stringify(jsonData,null,3)) ;
  await libSQLite.newUpdateQuoteTTM(jsonQuote) ;
  response.send({ retCode: '200' }) ;
}


async function logTransactionV1(request, response) {
  let jsonTransaction = request.body ;
  console.log(`logTransactionV1:${jsonTransaction}`) ;
  //console.log(JSON.stringify(jsonData,null,3)) ;
  await libSQLite.commitTransaction(jsonTransaction);
  response.json({ retCode: '200' }) ;
}
/*

async function addBookmarkV1(request, response) {
  let jsonData = request.body ;
  console.log(JSON.stringify(jsonData,null,3)) ;
  await libGatewayDB.addBookmark(jsonData) ;
  response.send({ retCode: '200' }) ;
}
*/

async function fetchQuoteTTMV1(request, response) {
  let {ticker } = request.params;
  console.log(ticker) ;
  ticker = ticker.replace(':','') ;
  //console.log(`updateGatewayV1:${jsonData}`) ;
  //console.log(JSON.stringify(jsonData,null,3)) ;
  let jsonQuote = await libSQLite.fetchQuoteTTM(ticker) ;
  response.send(jsonQuote) ;
}




async function fetchAllTriggersV1(request, response) {
  let jsonHoldings = await libSQLite.fetchAllTriggers() ;
  console.log(jsonHoldings) ;
  response.json(jsonHoldings) ;
}


async function updateTriggerV1(request, response) {
  let jsonTrigger = request.body ;
  //console.log(`updateGatewayV1:${jsonData}`) ;
  //console.log(JSON.stringify(jsonData,null,3)) ;
  await libSQLite.updateTrigger(jsonTrigger) ;
  response.send({ retCode: '200' }) ;
}



async function updateDIVV1(request, response) {
  let jsonTrigger = request.body ;
  //console.log(`updateGatewayV1:${jsonData}`) ;
  //console.log(JSON.stringify(jsonData,null,3)) ;
  await libSQLite.updateDIVNASDAQ(jsonTrigger) ;
  response.send({ retCode: '200' }) ;
}