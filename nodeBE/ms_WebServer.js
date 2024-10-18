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


//app.get('/publish.V1', fetchAccountHoldings) ;             // http://127.0.0.1:8180/fetchProjects.V2
//app.get('/fetchGateway.V1/:user', fetchGatewayV1) ;    //http://127.0.0.1:9988/fetchGateway.V1/:alexszhang@gmail.com
//app.post('/updateGateway.V1/', updateGatewayV1) ;
//app.post('/addBookmark.V1/', addBookmarkV1) ;


app.get('/fetchHoldings.V1', fetchHoldingsV1) ;             // http://127.0.0.1:8180/fetchProjects.V2




async function fetchHoldingsV1(request, response) {
    let jsonHoldings = await libSQLite.fetchAllHoldings() ;
    console.log(jsonHoldings) ;
    response.json(jsonHoldings) ;
}

/*
async function updateGatewayV1(request, response) {
  let jsonData = request.body ;
  //console.log(`updateGatewayV1:${jsonData}`) ;
  //console.log(JSON.stringify(jsonData,null,3)) ;
  await libGatewayDB.updateGateway(jsonData) ;
  response.send({ retCode: '200' }) ;
}



async function addBookmarkV1(request, response) {
  let jsonData = request.body ;
  console.log(JSON.stringify(jsonData,null,3)) ;
  await libGatewayDB.addBookmark(jsonData) ;
  response.send({ retCode: '200' }) ;
}
*/