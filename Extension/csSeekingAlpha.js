console.log('lark小妖 csSeekingAlpha ') ;

let globalArticle ;
async function talk2ServiceWorler(){
  let tagArticle = document.querySelector(`[data-test-id="article-section"]`) ;
  if(tagArticle!=null){
      console.log(tagArticle.getAttribute('data-test-id')) ;
      var articleClone = document.cloneNode(true);
      globalArticle = new Readability(articleClone).parse();
      //console.log(globalArticle.content) ;
  }
    let message = { 
        from: "contentScript", 
        to:'sidePanel',
        data:{
          article:globalArticle.content,
          url:window.location.href,
          title:document.querySelector(`[data-test-id="post-title"]`).innerText
        }

    } ;
    chrome.runtime.sendMessage(message, (response) => {
        console.log("csSeekingAlpha Message response:", response);

        if (response.status === "success") {
          console.log("csSeekingAlpha Message sent successfully:", response.data);
        } else {
          console.error("csSeekingAlpha  Error sending message:", response.error);
        }
    });
}

/*
let tagTitle = document.querySelector(`[data-test-id="post-title"]`) ;
*/
let jsonHello={
    url:window.location.href,
    title:'tagTitle.innerHTML'
} ;





chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'TabUpdated') {
    console.log(document.location.href);
    detechChange() ;
  }else{
    console.log(`sender: ${JSON.stringify(sender,null,3)}`) ;
    console.log(sender.tab ?
              "from a content script:" + sender.tab.url :
              "from the extension");
    console.log(`${JSON.stringify(request,null,3)}`);
    //talk2ServiceWorler(jsonHello) ;
    talk2ServiceWorler() ;

  }
});

//document.addEventListener('DOMContentLoaded', 
function injectAction(){
    console.log(`csSeekingAlpha on DOMContentLoaded`) ;
    let tagTitle = document.querySelector(`[data-test-id="post-title"]`) ;
    if(tagTitle!=null){
        console.log(`csSeekingAlpha on DOMContentLoaded op1`) ;

        let tagInject = document.createElement('span') ;
        tagTitle.appendChild(tagInject) ;
        tagInject.innerHTML = `lark` ;
    }else{
        console.log(`csSeekingAlpha on DOMContentLoaded op2`) ;

    }
}

injectAction() ;

/*
const startObserving = (domNode, classToLookFor) => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(function (mutation) {
        console.log(Array.from(mutation.addedNodes));
  
        const elementAdded = Array.from(mutation.addedNodes).some(
          element => {
            if (element.classList) {
              return element.classList.contains(classToLookFor);
            } else {
              return false;
            }
          },
        );
  
        if (elementAdded) {
          console.log('The element was added to the DOM');
        }
      });
    });
  
    observer.observe(domNode, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
    });
  
    return observer;
  };
  
  startObserving(document.body, 'my-class');
*/

/*
//https://stackoverflow.com/questions/32249997/how-to-check-if-data-attribute-exist-with-plain-javascript
//data-test-id="article-section"
document.body.addEventListener("DOMNodeInserted", (event) => {
    const newElement = event.target;
    let targetAttribute = `data-test-id` ;//data-test-id="article-section"
    if(newElement==null){
        return ;
    }

    for(let i=0;i<newElement.attributes.length;i++){
        console.log(`data-test-id" ${newElement.attributes[i].nodeName}`) ;
    }
    
    if (newElement.hasAttribute(targetAttribute)) {
      // Do something when the object with the attribute is created
      console.log(`New object with", ${targetAttribute}, "created!,value:${newElement.getAttribute(targetAttribute)}`);
      // You can access the element and its data with newElement.getAttribute(targetAttribute)
      //if()
    }
    
});
*/

function detechChange(){

  // Define the data attribute you want to watch
  let tagArticle = document.querySelector(`[data-test-id="article-section"]`) ;
  if(tagArticle == null){
    console.log('csSeekingAlpha [data-test-id="article-section"] not found,will observe it') ;
    const targetAttribute = "data-test-id";

    // Create a MutationObserver instance
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const addedNode of mutation.addedNodes) {
            // Check if the added node has the target attribute
            if(addedNode==null || addedNode==undefined) continue ;
            if (addedNode.hasAttribute(targetAttribute)) {
              // Do something when the object with the attribute is created
              console.log(`New object with ${targetAttribute}, created! value: ${addedNode.dataset.testId}`);
              // You can access the element and its data with addedNode.getAttribute(targetAttribute)
            }
          }
        }else if(mutation.type === "subtree"){
          for (const addedNode of mutation.addedNodes) {
            // Check if the added node has the target attribute
            if (addedNode.hasAttribute(targetAttribute)) {
              // Do something when the object with the attribute is created
              console.log(`New object with ${targetAttribute} created! value: ${addedNode.dataset.testId}`);
              // You can access the element and its data with addedNode.getAttribute(targetAttribute)
            }
          }
        }
      }
    });

    observer.observe(document.querySelector('main'), { 
      childList: true,
      subtree:true }
      );
  }else{
    console.log('csSeekingAlpha [data-test-id="article-section"] found ') ;
    // Create a MutationObserver instance
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const addedNode of mutation.addedNodes) {
            // Check if the added node has the target attribute
            if(addedNode==null || addedNode==undefined) continue ;
            if (addedNode.hasAttribute(targetAttribute)) {
              // Do something when the object with the attribute is created
              console.log(`New object with ${targetAttribute}, created! value: ${addedNode.dataset.testId}`);
              // You can access the element and its data with addedNode.getAttribute(targetAttribute)
            }
          }
        }else if(mutation.type === "subtree"){
          for (const addedNode of mutation.addedNodes) {
            // Check if the added node has the target attribute
            if (addedNode.hasAttribute(targetAttribute)) {
              // Do something when the object with the attribute is created
              console.log(`New object with ${targetAttribute} created! value: ${addedNode.dataset.testId}`);
              // You can access the element and its data with addedNode.getAttribute(targetAttribute)
            }
          }
        }
      }
    });

    observer.observe(tagArticle, { childList: true, subtree:true });
  }
}



detechChange() ;

/*
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'TabUpdated') {
    console.log(document.location.href);
    detechChange() ;
  }
}) ;
*/

/*
document.arrive(`[data-test-id="article-section"]`, function(newElem) {
  // newElem refers to the newly created element
  console.log(`arrive: ${newElem.tagName}`) ;
});
*/


// Start observing the document body for changes
/*
let tagArticle = document.querySelector(`[data-test-id="article-section"]`) ;
if(tagArticle!=null){
    console.log(tagArticle.getAttribute('data-test-id')) ;
    var articleClone = document.cloneNode(true);
    globalArticle = new Readability(articleClone).parse();
    console.log(globalArticle.content) ;
}else{
    observer.observe(document.querySelector('main'), { childList: true });
}
*/