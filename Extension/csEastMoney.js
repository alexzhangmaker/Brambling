
console.log('entered csEastMoney.js') ;


function grabTable(){
    let tagTables = document.querySelectorAll('table') ;
    for(let i=0;i<tagTables.length;i++){
        table2JSON(tagTables[i]) ;
    }
}

function table2JSON(tagTable){
    console.log(tagTable.innerHTML) ;
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    /*
    if (request.message === 'TabUpdated') {
        console.log(document.location.href);
    }else{
        console.log(`sender: ${JSON.stringify(sender,null,3)}`) ;
        console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
        console.log(`${JSON.stringify(request,null,3)}`);
        //talk2ServiceWorler() ;
    }
    */
    grabTable() ;
});

let tagLarkBarCS = document.querySelector('.larkBar') ;
tagLarkBarCS.querySelector('.bi-file-earmark-excel').addEventListener('click',(event)=>{
    let tagTables = document.querySelectorAll('table') ;
    for(let i=0;i<tagTables.length;i++){
        //table2JSON(tagTables[i]) ;
        tagTables.forEach(tagTable=>{
            tagTable.addEventListener('click',(event)=>{
                console.log('clicked:'+tagTable.innerHTML) ;
            }) ;
        }) ;
    }
}) ;

document.addEventListener('contextmenu', function(event) {
    // Get the type of the element that was right-clicked
    let elementType = event.target.nodeName.toLowerCase();
    console.log('cs Context:'+ elementType) ;
    // Send a message to the background script with the element type
    chrome.runtime.sendMessage({type: elementType});
});