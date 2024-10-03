console.log('lark小妖 csSeekingAlpha ') ;
let qsArticle = '.Post-Main' ;
let globalArticle ;

async function talk2ServiceWorler(){
  let tagArticle = document.querySelector(qsArticle) ;
  if(tagArticle!=null){
    var articleClone = document.cloneNode(true);
      globalArticle = new Readability(articleClone).parse();
    }
    let message = { 
        from: "contentScript", 
        to:'sidePanel',
        data:{
          article:globalArticle.content,
          url:window.location.href,
          title:tagArticle.querySelector(`.Post-Title`).innerText
        }

    } ;
    chrome.runtime.sendMessage(message, (response) => {
        console.log("csSeekingAlpha Message response:", response);
    });
}




chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'TabUpdated') {
    console.log(document.location.href);
}else{
    console.log(`sender: ${JSON.stringify(sender,null,3)}`) ;
    console.log(sender.tab ?
              "from a content script:" + sender.tab.url :
              "from the extension");
    console.log(`${JSON.stringify(request,null,3)}`);
    talk2ServiceWorler() ;
  }
});

//document.addEventListener('DOMContentLoaded', 
function injectAction(){
    /*
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
    */
}

injectAction() ;




