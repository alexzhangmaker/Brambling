// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//const GOOGLE_ORIGIN = 'https://www.google.com';
const larkWatchPost=[
  'xueqiu.com',
  'seekingalpha.com',
  'mp.weixin.qq.com',
  'zhuanlan.zhihu.com',
  'finance.yahoo.com',
  'ir.mklgroup.com',
  'bn.brookfield.com',
  'bam.brookfield.com'
] ;


function urlUnderWatch(host){
  return true ;
  /*
  for(let i=0;i<larkWatchPost.length;i++){
    if(larkWatchPost[i]==host)return true ;
  }
  return false ;
  */
}

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));


function _hashCode(str, seed = 0){
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for(let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

function _generateDynamicID(){
  let objMoment = new Date() ;
  //let cBookmarkID = `${objMoment.toLocaleTimeString()}` ;
  let cdynamicID = _hashCode(objMoment.toLocaleTimeString()) + Math.round(Math.random()*100);
  
  //console.log(cdynamicID) ;
  return cdynamicID.toString() ;
}


chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  if(urlUnderWatch(url.host)){
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'larkSPNotes.html',
      enabled: true
    });
  }else{
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({tabId,enabled: false});
  }

  if(info.url) {
    chrome.tabs.sendMessage( tabId, {message: 'TabUpdated',url: info.url}) ;
  }
});


async function getTab() {
  let queryOptions = { active: true, currentWindow: true };
  let tabs = await chrome.tabs.query(queryOptions);
  return tabs[0].url;
}



chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {

  switch(message.from){
    case "sidePanel":
      if(message.to==='contentScript'){
        console.log("SW.js Received message from sidePanel script:", message.data);
        let queryOptions = { active: true, currentWindow: true };
        let tabs = await chrome.tabs.query(queryOptions);
        chrome.tabs.sendMessage(tabs[0].id, message, function(response) {});  
      }else{
        console.log('something wrong');
      }
      break ;
    case "contentScript":
      // Process the message from the content script
      if(message.to==='sidePanel'){
        console.log("SW.js Received message from content script:", message.data);
        // Forward the message to the side panel (you can modify it here)
        let newMeesgae = { 
          from: "background", 
          to:'sidePanel',
          data:message.data
        } ;
        chrome.runtime.sendMessage(newMeesgae, (response) => {
          sendResponse({ status: "success", data: response.data });
        });
      }else{
        console.log('contentScript message to Non-SidePanel') ;
        await handleMessage2SW(message) ;
      }
      break ;
    default:
      await handleMessage2SW(message) ;
      break ;
  }
  return true ;
});
 

async function handleMessage2SW(message){
  console.log(`handleMessage2SW: ${message}`) ;

  switch(message.data.command){
    case 'rightClick':
      updateContextMenuTitle(message.data.payload.elementType) ;
      break ;

    case 'lark.Table.Response':
      let jsonTable = message.data.payload ;
      console.log(jsonTable) ;
      await uploadStatement(jsonTable)
      break ;

    case 'request2SaveItLater':
      let jsonArticle={
        articleID:_generateDynamicID(),
        title:message.data.title,     //document.querySelector('#idTitle').innerHTML,
        author:'DEMO',
        date:'2024-02-11',
        category:'inbox',
        tags:[],
        status:'to-read',
        sourceURL: message.data.url,  //document.querySelector('#idURL').innerHTML,
        article: message.data.article //document.querySelector('#larkViewer').innerHTML
      };
      doSaveItLater(jsonArticle) ;

    default:  
      break ;
  }
}


async function uploadStatement(jsonTable){

  //let urlStatement = 'http://127.0.0.1:8180/appendStatement.V2' ;
  let urlStatement = 'https://script.google.com/macros/s/AKfycbwtxKcK7ZUiVk2Foo0amd_d2yPVLn1BFY1oJ-Q-dk8TctyUbZ6N2gCo1ugc4Td4pTGW/exec' ;
  let jsonStatementReq= {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonTable)
  } ;
  let addResponse = await fetch(urlStatement,jsonStatementReq );
  console.log(await addResponse.json());
}



chrome.runtime.onInstalled.addListener(async () => {

  chrome.contextMenus.create({
    id: 'google',
    title: 'Gogole',
    type: 'normal',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'lark.PageAction',
    title: 'lark',
    type: 'normal',
    contexts: ['page'],
  });

});

// Open a new search tab when the user clicks a context menu
chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  switch(item.menuItemId){
    case 'google':
      const tld = item.menuItemId;
      const url = new URL(`https://google.${tld}/search`);
      url.searchParams.set('q', item.selectionText);
      chrome.tabs.create({ url: url.href, index: tab.index + 1 });
      break ;
    case 'lark.PageAction':
      console.log('menu lark clicked');
      let queryOptions = { active: true, currentWindow: true };
      let tabs = await chrome.tabs.query(queryOptions);
      //return tabs[0].url;
      let jsonMessage={
        from:'background',
        to:'csAll',
        data:{
          command:'lark.Table',//forward,rightClick,lark.Table,lark.Article
          payload:{}
        }
      } ;

      chrome.tabs.sendMessage(tabs[0].id, jsonMessage, function(response) {});  
      break ;
    default:
      console.log('menu click not ready');
  }
});





// Create a function to update the context menu title
function updateContextMenuTitle(elementType) {
  console.log('will updateContextMenuTitle') ;
  let title = '';
  switch(elementType) {
      case 'table':
          title = 'lark.Table';
          break;
      case 'p':
      case 'article':
      case 'span':
          title = 'lart.Article';
          break;
      // Add more cases for other element types if needed
      default:
          title = 'lark';
          break;
  }
  chrome.contextMenus.update('lark.PageAction', { title: title });
}

//https://developers.google.com/sheets/api/samples/reading
//https://stackoverflow.com/questions/53227508/write-form-data-from-my-chrome-extension-to-google-sheets
function updateGSheet(){

  chrome.identity.getAuthToken({interactive: true}, function(token) {
    var params = {
        'values': [
            ['Row 1 Col A','Row 1 Col B'],
            ['Row 2 Col A','Row 2 Col B'],
        ]
    };
    let init = {
        method: 'PUT',
        async: true,
        body: JSON.stringify(params),
        
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        contentType: 'json',
    };

    let cRange="Sheet1!A1:B2';";
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/110kjLG1mDQ0caZzWf9GhQarKNivYra7tCxpxYTABJUY/values/${cRange}?valueInputOption=USER_ENTERED&key=AIzaSyCkO8hiXPPfDC9jpNKE3HplVGG9aUAlHBY`, init)
        .then((response) => response.json())
        .then(function(data) {
            //console.log(data);
            //Returns spreadsheet ID, update tange, cols and rows
            console.log(data) ;
        });
    }) ;
}

async function doSaveItLater(jsonArticle){

  //let cSaveURL = `http://124.156.193.78:8082/saveArticle.V2` ;
  let cSaveURL = `https://falconcnx.online:8082/saveArticle.V2` ;

  let jsonSaveArticleReq= {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonArticle)
  } ;

  const rawResponse = await fetch(cSaveURL,jsonSaveArticleReq );
  const content = await rawResponse.json();

  let oURL = new URL(jsonArticle.sourceURL);
  let cCategory = 'other' ;
  switch(oURL.hostname){
    case 'xueqiu.com':
      cCategory = 'xueqiu' ;
      break ;
    case 'mp.weixin.qq.com':
      cCategory = 'weichat' ;
      break ;
    case 'seekingalpha.com':
      cCategory = 'SeekingAlpha' ;
      break ;
  }

  //let urlAdd2Collection = 'http://124.156.193.78:8082/addArticle2Collection.V2' ;
  let urlAdd2Collection = 'https://falconcnx.online:8082/addArticle2Collection.V2' ;

  let jsonFile={
      articleID:jsonArticle.articleID,
      title:jsonArticle.title,
      summary:['TBD Summary'],
      source:oURL.hostname,
      sourceURL:jsonArticle.sourceURL,
      asset_device:'server',
      asset_path:`./public/CMSLib/${jsonArticle.articleID}/`,
      assetName:`index_${jsonArticle.articleID}.html`,
      mediaPath:`/${jsonArticle.articleID}/`,
      category:cCategory,
      tags:[]
  }

  let jsonAdd2CollectionReq= {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonFile)
  } ;
  let addColResponse = await fetch(urlAdd2Collection,jsonAdd2CollectionReq );
  await addColResponse.json();

}