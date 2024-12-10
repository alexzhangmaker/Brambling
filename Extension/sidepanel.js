
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

document.addEventListener('DOMContentLoaded',async (event)=>{
  console.log('sidepanel DOMContentLoaded') ;
  
}) ;

async function getCurrentTabURL() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.url;
}

async function closeCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  await chrome.tabs.remove([tab.id]) ;
  
}


