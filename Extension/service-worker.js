//importScripts("socket.io.min.js");
//importScripts("./js/constProxySetting.js");

//global variables
let urlActivityLog          = 'http://127.0.0.1:10099/logUserInteraction.V1/' ;
let urlReportHealth         = `http://127.0.0.1:10099/reportHealth.V1/` ;
let urlWardenRules          = `http://127.0.0.1:10099/fetchWardenRules.V1/` ;
let urlWebRules             = `http://127.0.0.1:10099/fetchWebRules.V1/` ;
let urlReportChromeSetting  = `http://127.0.0.1:10099/reportChromeSetting.V1/` ;

let gloablFocusFlag         = false ;
//global static code/data
const gloabalPeriodHeartbeat= 1 ;
const globalPeriodInMinutes = 5 ;
const globalPeriodCheckRule = 3 ;
const globalPeriodReport    = 7 ;

const gloabalUerID          = 'alexszhang@macAir' ;
const globalIPAddr          = '192.168.1.1' ;
const larkWatchPost         = ['xueqiu.com','www.google.com','127.0.0.1','newtab'] ;
const globalNoLogHost       = ['127.0.0.1','www.w3schools.com','github.com','stackoverflow.com','dev.to','192.168.1.119'] ;

let globalUrlsBlock         = ['learnbig.net'] ;
let globalUrlsRedirect      = ['sina.com.cn'] ;

let globalHostOtherWise     = ['google.com'] ;
let globalRedirectOtherWise = 'about:blank' ;

let globalKeywordsFilter    = [] ;
let globalDefaultOtherWise  = [ "127.0.0.1","192.168.1","newtab","chrome://extension","chrome://","about:blank"] ;
let globalFlagOnTopRuleOtherwise     = false ;
const defaultKeywordsFilter = ['ballet'] ;
const defaultOtherWise      = ["127.0.0.1","192.168.1","newtab","chrome://extension","chrome://","about:blank"] ;


// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));
chrome.runtime.onMessage.addListener(_onMessage);
chrome.runtime.onInstalled.addListener(_onInstallExtension);
chrome.runtime.onStartup.addListener(_onStartUpExtension);
chrome.contextMenus.onClicked.addListener(_onClickMenu);
chrome.tabs.onUpdated.addListener(_onUpdateTab); 
chrome.tabs.onActivated.addListener(_onActivatedTab); 
chrome.tabs.onCreated.addListener(_onCreateTab);
chrome.alarms.onAlarm.addListener(_onAlarm);


chrome.alarms.create('_keepAlive', { periodInMinutes: gloabalPeriodHeartbeat });




/*******below as functions to be triggered******/

async function _onStartUpExtension(){
  console.log('Chrome extension has started up.');
  // Perform any necessary initialization tasks here.
  

}

async function _onInstallExtension(details){
  console.log('Chrome extension _onInstallExtension.');

  chrome.contextMenus.create({
    id: 'signpost.Brambling',
    title: 'Brambling',
    type: 'normal',
    contexts: ['page'],
  });

}

let cssAAStockDIV=`#divContentContainer > div:nth-child(8) > div.grid_16.mar20T > div.content.comm-panel > table` ;
let cssYahooInCome='' ;
let cssYahooBalanceSh='' ;
let cssYahooCashFlow='';
let cssYahooKPI='' ;
async function _onClickMenu(item, tab){
  switch(item.menuItemId){
    case 'signpost.Brambling':
      console.log('menu lark clicked');
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      let tabURL = tab.url ;
      if(tab.url.indexOf(finance.yahoo.com)!=-1){
        let message = {
          serial:0,
          from: "serviceWorker",
          to:'csYahoo',
          command:'requestData',
          data:{
            element:{
              incomeStmt:cssYahooInCome,
              balanceSheet:cssYahooBalanceSh,
              cashFlow:cssYahooCashFlow,
              kpi:cssYahooKPI
            },//css selector
            type:'.table'
          }
        } ;
        const response = await chrome.tabs.sendMessage(tab.id,message);
        console.log(response) ;
      }else{
        let message = {
          serial:0,
          from: "serviceWorker",
          to:'csAAStock',
          command:'requestData',
          data:{
            element:cssAAStockDIV,//css selector
            type:'table'
          }
        } ;
        const response = await chrome.tabs.sendMessage(tab.id,message);
        console.log(response) ;
      }
      
      break ;
    default:
      console.log('menu click not ready');
  }
}



async function _onMessage(message, sender, sendResponse){
  switch(message.from){
    case "csAAStock":
      if(message.to==='serviceWorker'){
        console.log("SW.js Received message from sidePanel script:", message.data);
        await handleMessage2SW(message) ;
        await sendResponse({ status: "success", data: "got option Request" });
      }else{
        console.log('something wrong');
      }
      break ;
    default:
      break;
  }
  return true ;
}

async function handleMessage2SW(message){
  console.log(message) ;
  switch(message.command){
    case 'requestDataAck':
      let jsonMessageAck = message ;
      await uploadDIVData(jsonMessageAck.data.extrea.symbol,
        jsonMessageAck.data.content,
        'HKEX',
        jsonMessageAck.data.content[0].exOrEffDate) ;
    default:  
      break ;
  }
}

async function uploadDIVData(ticker,dividends,exchange,exDividendDate){
  let jsonDIV={
    ticker:ticker,
    dividends:dividends,
    exchange:exchange,
    date:exDividendDate,
    timestamp:(new Date()).getTime()
    /*annualizedDividend:jsonDIVHistory.data.annualizedDividend*/
  } ;

  let urlUpdateDIV = 'http://127.0.0.1:10088/updateDIV.V1/' ;
  try {
      const response = await fetch(urlUpdateDIV, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',       
        },
        body: JSON.stringify(jsonDIV), 
      });
  } catch (error) {
      console.error('Error:', error.message);
  }
}

async function _onCreateTab(tab){
  console.log("New tab created:", tab);

  
}

async function _onTargetTabCreated(details){
  console.log("Navigation target created:", details);
  //const tab = await chrome.tabs.get(details.tabId);
  //await _onUpdateTab(details.tabId,{},tab) ;

  
}


async function _onUpdateTab(tabId, changeInfo, tab) {
  if (!tab.url) return;

  try {
    const url = new URL(tab.url);


    if(urlUnderWatch(url.hostname)){
      await chrome.sidePanel.setOptions({tabId,path: 'sidepanel.html',enabled: true});
    }else{
      // Disables the side panel on all other sites
      await chrome.sidePanel.setOptions({tabId,enabled: false});
    }
  
  } catch (e) {
    if (e instanceof TypeError) {
      console.log(tab.url) ;
        //error handling procedure...
    } else {
        throw e;//cause we dont know what it is or we want to only handle TypeError
    }
  }
}


async function _onActivatedTab(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, async function(tab){
    console.log(tab.url);
    console.log(decodeURI(tab.url)) ;


    
  });
}

async function _onAlarm(alarm){
  //_keepAlive
  if (alarm.name === '_keepAlive') {
    let cDate = new Date() ;

    console.log('Alarm triggered, _keepAlive by hello...');

    return ;
  }

}

//==============>>>>>>>>>>>>>>>>>>>>
async function _reportHealth() {
  console.log('_reportHealth...');
  let cDate = new Date() ;
  let jsonReport={
    userID:gloabalUerID,
    address:globalIPAddr,
    timestamp:`${cDate.getFullYear()}-${cDate.getMonth()+1}-${cDate.getDate()}/${cDate.getHours()}:${cDate.getMinutes()}`
  } ;
  let jsonReportReq= {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonReport)
  } ;
  let addResponse = await fetch(urlReportHealth,jsonReportReq );
  console.log(await addResponse.json()) ;
}



//=================>>>>>>>
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
  let cdynamicID = _hashCode(objMoment.toLocaleTimeString()) + Math.round(Math.random()*100);
  
  return cdynamicID.toString() ;
}

async function getTab() {
  let queryOptions = { active: true, currentWindow: true };
  let tabs = await chrome.tabs.query(queryOptions);
  return tabs[0].url;
}


function urlUnderWatch(host){
  for(let i=0;i<larkWatchPost.length;i++){
    if(larkWatchPost[i]==host)return true ;
  }
  return false ;
}
