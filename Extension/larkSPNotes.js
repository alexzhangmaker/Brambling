
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

/*
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(`sidepanel chrome.runtime.onMessage sender: ${JSON.stringify(sender,null,3)}`) ;
  console.log(`sidepanel chrome.runtime.onMessage message: ${JSON.stringify(message,null,3)}`) ;

  if (message.from === "background") {
    console.log("sidepanel Received message from background:", message.data);

    // Update the side panel based on the received data
    // ...
    let jsonMessage = message.data ;
    let tagConsole = document.querySelector('#idConsole') ;

    document.querySelector('#idTitle').innerHTML = jsonMessage.title ;
    document.querySelector('#idURL').innerHTML = jsonMessage.url ;

    document.querySelector('#larkViewer').innerHTML=jsonMessage.article ;
    //larkViewer

    sendResponse({ status: "success", data: "Updated side panel" });

    try {
      let articleID = _generateDynamicID() ;
      await localforage.setItem(articleID,message.data);
      // This code runs once the value has been loaded
      // from the offline store.
      //console.log(value);
    } catch (err) {
        // This code runs if there were any errors.
        console.log(err);
    }  
  }
});
*/


document.addEventListener('DOMContentLoaded',async (event)=>{
  console.log('sidepanel DOMContentLoaded') ;
  // Add fonts to whitelist


  const quill = new Quill('#editor', {
      debug: 'info',
      modules: {
          toolbar: '#toolbar',
      },
      placeholder: 'Compose an epic...',
      theme: 'snow',
  });
  quill.enable();
  const Font = Quill.import('formats/font');
  // We do not add Aref Ruqaa since it is the default
  Font.whitelist = ['mirza', 'roboto'];
  Quill.register(Font, true);

  let cURL = await getCurrentTabURL() ;
  console.log(cURL) ;
  let tagPageMeta = document.querySelector('.larkNote_Header') ;
  tagPageMeta.innerText = cURL ;
}) ;
/*
document.querySelector('#idBTNSaveItLater').addEventListener('click',async (event)=>{
  //document.querySelector('#idTitle').innerHTML = jsonMessage.title ;
  let cURLValue = document.querySelector('#idURL').innerText ; 

  let jsonArticle={
    articleID:_generateDynamicID(),
    title:document.querySelector('#idTitle').innerHTML,
    author:'DEMO',
    date:'2024-02-11',
    category:'inbox',
    tags:[],
    status:'to-read',
    sourceURL:document.querySelector('#idURL').innerHTML,
    article:document.querySelector('#larkViewer').innerHTML
  };
  
  let cSaveURL = `http://124.156.193.78:8082/saveArticle.V2` ;
  //console.log(cSaveURL) ;

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

  let oURL = new URL(cURLValue);
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

  let urlAdd2Collection = 'http://124.156.193.78:8082/addArticle2Collection.V2' ;
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


  let cPageURL = await getCurrentTabURL()
  console.log(cPageURL) ;
  //await chrome.bookmarks.search({})
  removeBookmark(cPageURL) ;
  closeCurrentTab() ;

}) ;
*/

async function getCurrentTabURL() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.url;
}


function removeBookmark(cURL) {
  chrome.bookmarks.search({ url: cURL }, (results) => {
    for (const result of results) {
      if (result.url === cURL) {
        chrome.bookmarks.remove(result.id, () => {
          console.log(`${cURL} removed from bookmark as ${result.id}`) ;
        });
      }
    }
    //location.reload();
  });
}

async function closeCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  await chrome.tabs.remove([tab.id]) ;
  
}


document.querySelector('.larkBTNTakeNote').addEventListener('click',async (event)=>{
  let response = await fetch(`https://falconcnx.online:8082/memo/fetchMemoBoxIDs.V2`);
  let memoBoxIDs = await response.json();
  console.log(memoBoxIDs) ;
}) ;