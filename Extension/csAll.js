console.log('csAll.js entered') ;


function appendCSS(fileName) {

    var head = document.head;
    var link = document.createElement("link");
  
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = fileName;
  
    head.appendChild(link);
}

function appendContentCSS(){
    console.log('appendContentCSS') ;

    // create a new style tag
    let tagStyle = document.createElement("style");
    // add the style tag to the head of the document
    document.head.appendChild(tagStyle);
    tagStyle.innerHTML=`
        .larkBar{
            position: fixed;
            bottom: 0;
            right: 0;
            width: auto;
            /*border: 3px solid #73AD21;*/
            padding: 10px;
            margin: 10px ;
            background-color: azure;

            display: flex;
            flex-direction: column;
            flex-wrap: nowrap ;
            justify-content: flex-start ;
            align-items:center;

            z-index: 1099;

        }

        .larkBar a{
            color:black ;
        }
        .signpostBTN{
            font-size: 18px;
        }
        .signpostBTN:hover{
            cursor: pointer;
        }
        
        .signpostBTN24{
            font-size: 24px;
        }
        .signpostBTN24:hover{
            cursor: pointer;
        }

        .signpostDragBTN24{
            font-size: 24px;
        }
        .signpostDragBTN24:hover{
            cursor: all-scroll;
        }

        .tableBorder{
            border: 1px solid black !important;
        }

        .chatFrame{
            position:fixed;
            bottom:200px ;
            right:0px;
            width:100px;
            height:100px ;
            border:None ;
            visibility: hidden;/*hidden  visible*/
        }

        .noShow{
            display:none;
        }

        #larkMarkdownDialog{
            width:80vw;
            height:80vh ;

            display:flex;
            flex-direction:column ;
        }

        .larkBTN{
            font-size:16px ;
            width: 24px;
            padding:0px ;
            border:0px;
            background-color:white ;
        }

    ` ;

    appendCSS(`https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css`);
    appendCSS(`https://cdnjs.cloudflare.com/ajax/libs/hint.css/3.0.0/hint.min.css`);


}



function appendContentUI(){
    let tagLarkBar = document.createElement('div');
    document.body.appendChild(tagLarkBar) ;
    tagLarkBar.classList.add('larkBar') ;
    tagLarkBar.classList.add('draggable') ;

    //<button spiketip-title="I'm a SpikeTip tooltip!" spiketip-pos="top">Hover Me!</button>

    // hint--bottom aria-label="Thank you!"
    tagLarkBar.innerHTML=`
        <button class="hint--left larkBTN" aria-label="Falcon Lib!">
            <a href="https://falconcnx.online:8082/larkCollectionsV2.html" target="_blank"><i class="bi-house-fill signpostBTN24"></i></a>
        </button>

        <button class="hint--left larkBTN" aria-label="SaveIt Later!">
            <i class="bi-markdown signpostBTN24 larkGrabArticle"></i>
        </button>

        <button class="hint--left larkBTN" aria-label="No Paywall!">
            <i class="bi-gear-wide-connected signpostBTN24 larkBypassPayWall"></i>
        </button>

        <button class="hint--left larkBTN" aria-label="UnClutter!">
            <i class="bi-file-earmark-excel signpostBTN24 larkUnClutter"></i>
        </button>

        <button class="hint--left larkBTN" aria-label="Take Note!">
            <i class="bi-chat-square-text signpostBTN24 larkTakeNote"></i>
        </button>

        <button class="hint--left larkBTN" aria-label="Mini Bar!">
            <i class="bi-x-square signpostBTN24 larkMinToolbar"></i>
        </button>

        <button class="hint--left larkBTN" aria-label="Full Bar!">
            <i class="bi-tv signpostBTN24 noShow larkFullToolbar"></i>
        </button>

    ` ;

    tagLarkBar.querySelector('.larkMinToolbar').addEventListener('click',(event)=>{
        let larkBar = event.target.closest('.larkBar') ;
        larkBar.querySelector('.bi-markdown').classList.add('noShow') ;
        larkBar.querySelector('.bi-gear-wide-connected').classList.add('noShow') ;
        larkBar.querySelector('.bi-file-earmark-excel').classList.add('noShow') ;
        larkBar.querySelector('.bi-chat-square-text').classList.add('noShow') ;
        larkBar.querySelector('.bi-x-square').classList.add('noShow') ;
        larkBar.querySelector('.bi-tv').classList.remove('noShow') ;
    }) ;

    tagLarkBar.querySelector('.larkFullToolbar').addEventListener('click',(event)=>{
        let larkBar = event.target.closest('.larkBar') ;
        larkBar.querySelector('.bi-markdown').classList.remove('noShow') ;
        larkBar.querySelector('.bi-gear-wide-connected').classList.remove('noShow') ;
        larkBar.querySelector('.bi-file-earmark-excel').classList.remove('noShow') ;
        larkBar.querySelector('.bi-chat-square-text').classList.remove('noShow') ;
        larkBar.querySelector('.bi-x-square').classList.remove('noShow') ;
        larkBar.querySelector('.bi-tv').classList.add('noShow') ;
    }) ;


    tagLarkBar.querySelector('.larkTakeNote').addEventListener('click',(event)=>{
        let larkBar = event.target.closest('.larkBar') ;
        alert('larkTakeNote TBD') ;
    }) ;

    tagLarkBar.querySelector('.larkUnClutter').addEventListener('click',(event)=>{
        let larkBar = event.target.closest('.larkBar') ;
        alert('larkUnClutter TBD') ;

    }) ;

    tagLarkBar.querySelector('.larkGrabArticle').addEventListener('click',(event)=>{
        //alert('going to save this page for later reading') ;
        let hostName = document.location.hostname ;
        let csTitle='' ;
        let csArticle = '' ;
        switch(hostName){
            case 'readcache.xyz':
                //alert('readcache.xyz') ;
                csTitle='[data-testid="storyTitle"]' ;
                csArticle = 'article' ;
                //[data-test-id="content-container"]
                request2SaveItLater(csArticle,csTitle) ;
                return ;
            case 'seekingalpha.com':
                alert('seekingalpha.com TBD in Chome, only on Firefox') ;
                return ;
            case 'mp.weixin.qq.com':
                csTitle='.rich_media_title' ;
                csArticle = '.rich_media_area_primary' ;
                request2SaveItLater(csArticle,csTitle) ;
                return ;
            case 'xueqiu.com':
                csTitle='.article__bd__title' ;
                csArticle = '.article__bd__detail' ;
                request2SaveItLater(csArticle,csTitle) ;
                return ;
            default:
                console.log('default TBD') ;
                break ;

        }

        let tagDialog = document.createElement('dialog') ;
        document.body.appendChild(tagDialog) ;
        tagDialog.id = "larkMarkdownDialog" ;
        
        tagDialog.innerHTML = `
            <div id="idArticleMeta">
                <span id="idArticleSelector" contenteditable=true>cssSelector here</span>
                <span id="idArticleTitle" contenteditable=true>title is here</span>
            </div>
            <button>close <i class="bi-x-square-fill"></i></button>
            <button id="idBTNSave">save <i class="bi-save2"></i></button>
            <div id="idArticlePreview"></div>
        ` ;
    
        tagDialog.querySelector('.bi-x-square-fill').addEventListener('click',(event)=>{
            let tagDialog = document.querySelector('#larkMarkdownDialog') ;
            if(tagDialog==null) return ;
            tagDialog.close() ;
            tagDialog.remove() ;
        }) ;
    
        tagDialog.querySelector("#idBTNSave"/*'.bi-save2'*/).addEventListener('click',(event)=>{
            let tagDialog = document.querySelector('#larkMarkdownDialog') ;
            let cURL = new URL(window.location.href) ;
            let csArticleSelector = '' ;
            let csArticleTitle = '' ;
            switch(cURL.host){
                case 'mp.weixin.qq.com':
                    csArticleSelector = '.rich_media_area_primary_inner' ;
                    csArticleTitle = '#activity-name' ;//.rich_media_title' ;//#activity-name
                    break;
                case 'xueqiu.com':
                    csArticleSelector = '.article__container' ;
                    csArticleTitle = '.article__bd__title' ;//.rich_media_title' ;//#activity-name
                    break ;
                default:
                    csArticleSelector = tagDialog.querySelector('#idArticleSelector').innerText ;
                    csArticleTitle = tagDialog.querySelector('#idArticleTitle').innerText ;
                    break ;
            }
            request2SaveItLater(csArticleSelector,csArticleTitle) ;
            tagDialog.close() ;
            tagDialog.remove() ;

        }) ;

        tagDialog.showModal();
    });

    //bi-chat-square-text
    tagLarkBar.querySelector('.larkBypassPayWall').addEventListener('click',(event)=>{
        let larkBar = event.target.closest('.larkBar') ;
        /*
        larkBar.querySelector('.bi-markdown').classList.remove('noShow') ;
        larkBar.querySelector('.bi-gear-wide-connected').classList.remove('noShow') ;
        larkBar.querySelector('.bi-file-earmark-excel').classList.remove('noShow') ;
        larkBar.querySelector('.bi-chat-square-text').classList.remove('noShow') ;
        larkBar.querySelector('.bi-x-square').classList.remove('noShow') ;
        larkBar.querySelector('.bi-tv').classList.add('noShow') ;
        */
       //doMemoQuill() ;

        let hostName = document.location.hostname ;
        switch(hostName){
            case 'medium.com':
            case 'javascript.plainenglish.io':
                let cMediumURL = window.location.href ;
                console.log(`lark.medium.Ext:${cMediumURL}`) ;
                let urlEncoded = encodeURIComponent(cMediumURL) ;
                console.log(`lark.medium.Ext:${urlEncoded}`) ;
                let urlCacheContent = `https://readcache.xyz/api/p?url=${urlEncoded}` ;
                console.log(`lark.medium.Ext:${urlCacheContent}`) ;
                
                window.open(urlCacheContent, '_blank').focus();
                break ;
            
            default:
                alert('default TBD') ;
                break ;

        }
        
    }) ;
}


window.addEventListener('load', function() {                 //   8   - Window onload
    console.log('Window onload event called.');

    appendContentCSS() ;
    appendContentUI() ;
    insertMemoUI() ;

});


window.addEventListener('DOMContentLoaded', function() {     //   3   - Window DOMContentLoaded
    console.log('Window DOMContentLoaded event called.');
    const currentUrl = window.location.href;
    console.log(currentUrl);
});



function request2SaveItLater(qsArticle,qsTitle){
    let tagArticle = document.querySelector(qsArticle) ;
    let gArticle = null ;

    if(tagArticle!=null){
        var articleClone = document.cloneNode(true);
        gArticle = new Readability(articleClone).parse();
    }

    let message = { 
        from: "contentScript", 
        to:'background',
        data:{
            command:'request2SaveItLater',
            article:gArticle.content,
            url:window.location.href,
            title:document.querySelector(qsTitle).innerText
        }
    } ;

    chrome.runtime.sendMessage(message, (response) => {
        console.log("csSeekingAlpha Message response:", response);
    });
}



//refer to https://interactjs.io/

const position = { x: 0, y: 0 }

interact('.draggable').draggable({
  listeners: {
    start (event) {
      console.log(event.type, event.target)
    },
    move (event) {
      position.x += event.dx
      position.y += event.dy

      event.target.style.transform =
        `translate(${position.x}px, ${position.y}px)`
    },
  }
}) ;


function insertMemoUI(){
    let htmlMemoUI=`
        <dialog class="larkEditoDialog"  style="border:none;border-radius: 5px;width:1024px;height:1000px;">
            <style>
                .dlgMain{
                display: flex;
                flex-direction: column;
                border: none;

                height:100%;
            }
            .larkEditorDlgBody{
                /*flex-basis: 40px;*/
                flex-grow: 1;
            }

            .larkEditorDlgHeader{
                flex-basis: 40px;
                flex-grow: 0;

                /*background-color: blue;*/
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-content: center;
            }

            .larkEditorDlgFooter{
                flex-basis: 40px;
                flex-grow: 0;

                display: flex;
                flex-direction: row;
                align-content: center;
                justify-content: flex-end;

            }

            .larkEditorFrame{
                min-height:400px;
                min-width:800px;
                width:100% ;
                height:100% ;
                border: none;
            }

            button{
                font-family: 'Aref Ruqaa';
                width: 10em;
                font-size: 16px;
            }
            </style>
            <div class="dlgMain">
                <div class="larkEditorDlgHeader">
                    <i class="bi-house"></i>
                    <div>
                        <i class="bi-sliders"></i>
                        <i class="bi-power larkDlgPowerOff"></i>
                    </div>
                </div>

                <div class="larkEditorDlgBody">
                    <iframe src="https://www.google.ie/gwt/x?u=[http://124.156.193.78:8082/larkMemoQuill.html]" class="larkEditorFrame" title="Iframe Example"></iframe>
                </div>

                <div class="larkEditorDlgFooter">
                    <div>
                        <button><i class="bi-x-square larkDlgClose"></i> cancel</button>
                        <button><i class="bi-cloud-arrow-up larkDlgSave"></i> save</button>
                    </div>
                </div>
            </div>
            
        </dialog>
    ` ;
    let memoDlgContainer= document.createElement('div') ;
    document.body.appendChild(memoDlgContainer) ;

    memoDlgContainer.innerHTML = htmlMemoUI ;
    let memoDlg = memoDlgContainer.querySelector('.larkEditoDialog') ;
    //larkDlgClose
    memoDlg.querySelector('.larkDlgClose').addEventListener('click',(event)=>{
        let memoDlg = document.querySelector('.larkEditoDialog') ;
        memoDlg.close() ;
    }) ;

    //larkDlgPowerOff
    memoDlg.querySelector('.larkDlgPowerOff').addEventListener('click',(event)=>{
        let memoDlg = document.querySelector('.larkEditoDialog') ;
        memoDlg.close() ;
    }) ;

    //larkDlgSave
    memoDlg.querySelector('.larkDlgSave').addEventListener('click',(event)=>{
        let memoDlg = document.querySelector('.larkEditoDialog') ;

        let jsonRequestMemo={
            request:'RequestMemo'
        } ;
        port1.postMessage(JSON.stringify(jsonRequestMemo));

        alert('will larkDlgSave') ;
        memoDlg.close() ;
    }) ;


    let iframe = memoDlg.querySelector(".larkEditorFrame");

    iframe.addEventListener("load", (event)=>{
        iframe.contentWindow.postMessage("init", "*", [channel.port2]);

        let jsonPara = {
            id:'id001',
            text:'demoText',
            amount:101
        } ;
        let vMsg = JSON.stringify(jsonPara) ;
        port1.postMessage(vMsg);
    });


}

function doMemoQuill(){
    //let memoDlg = document.querySelector('.larkEditoDialog') ;
    //memoDlg.showModal() ;
    window.open('http://124.156.193.78:8082/larkMemoQuill.html','_blank') ;
}


const channel = new MessageChannel();
const port1 = channel.port1;
port1.onmessage = onMessage;




// Handle messages received on port1
async function onMessage(e) {
    //output.innerHTML = e.data;
    //input.value = "";
    console.log(`larkNoteEditor.html onMessage ${e.data}`) ;
    let jsonMessage = JSON.parse(e.data) ;
    switch(jsonMessage.request){
        case 'RequestMemoAck':
            console.log(jsonMessage.memo) ;
            let jsonMemo={
                memoID:'tbd',
                timeStamp:'2024-05-19 11:31:03',
                memoType:'memo',//concept,summary,key points,
                about:'Hello,What is the meaning of FIFA?',
                memo:[jsonMessage.memo],
                refer:[
                    {
                        title:'FIFA',
                        url:'https://en.wikipedia.org/wiki/FIFA'
                    }
                ],
                tags:['CMU/Culture','fun']
            } ;
            await cbSaveMemo(jsonMemo) ;
            break;
        default:
            console.log('defualt in case');
            break;
    }
}

async function cbSaveMemo(jsonMemo){
    let cURL = '' ;
    if(jsonMemo.memoID == 'tbd'){
        cURL = '/memo/newMemo.V2' ;
    }else{
        cURL = '/memo/updateMemo.V2' ;
    }

    let jsonRequest={
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonMemo,null,3)
    } ;

    let response = await fetch(cURL, jsonRequest) ;
    let jsonResponse = await response.json() ;
    console.log(jsonResponse) ;
}


async function updateMemoBox(){
    if(jsonMemo.memoID == 'tbd'){
        let larkMemoList = document.querySelector('.larkListViewBody') ;
        let activeMemoBoxID = larkMemoList.dataset.memoBoxID ;

        cURL = `/memo/fetchMemoBox.V2/:${activeMemoBoxID}` ;
        response = await fetch(cURL);
        let jsonMemoBox = await response.json();
        jsonMemoBox.memoIDs.push(jsonResponse.memoID) ;

        cURL ='memo/updateMemoBox.V2' ;
        jsonRequest={
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonMemoBox,null,3)
        } ;

        response = await fetch(cURL, jsonRequest) ;
        jsonResponse = await response.json() ;
        console.log(jsonResponse) ;
    }
}