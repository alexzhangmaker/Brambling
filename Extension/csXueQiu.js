console.log('lark小妖 csSeekingAlpha ') ;
let qsArticle = '.article__container' ;
let globalArticle ;

async function talk2ServiceWorker(){
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
        title:tagArticle.querySelector(`.article__bd__title`).innerText
      }

  } ;
  chrome.runtime.sendMessage(message, (response) => {
      console.log("csSeekingAlpha Message response:", response);
      return true ;
  });
}




chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.message === 'TabUpdated') {
    console.log(document.location.href);
  }else{
    console.log(`sender: ${JSON.stringify(sender,null,3)}`) ;
    console.log(sender.tab ? "from a content script:" + sender.tab.url :"from the extension");
    console.log(`${JSON.stringify(request,null,3)}`);
    if(request.data.command==='requestArticle'){
      talk2ServiceWorker() ;
    }else if(request.data.command ==='lark.Table'){
      
      //extractStatement_XQ('.stock-info-content') ;
      let jsonStatement = extractStatement_XQ('[data-lark-table-i-d="larkTable"]') ;
      let jsonMessage={
        from:'csXueQiu',
        to:'background',
        data:{
          command:'lark.Table.Response',
          payload:jsonStatement
        }
      } ;
      chrome.runtime.sendMessage(jsonMessage);
    }
  }
  return true ;
});


let larkTableID = 'larkTable' ;

document.body.addEventListener('contextmenu', function(event) { 
  //alert('show your custom context menu'); 
  let elementType = event.target.nodeName.toLowerCase();
  let typeArray = ['th','td','tr','table','tbody'] ;

  console.log('cs Context:'+ elementType) ;
  if(typeArray.includes(elementType)!=true){
    let tagTable = event.target.closest('table') ;
    if(tagTable==null) return false;
  }

  if(elementType == 'table'){
    event.target.dataset.larkTableID = larkTableID ;
    //tableBorder
    event.target.classList.add('.tableBorder') ;
  }else{
    let tagTable = event.target.closest('table') ;
    tagTable.dataset.larkTableID = larkTableID ;
    event.target.classList.add('.tableBorder') ;

  }

  // Send a message to the background script with the element type
  let jsonMessage={
    from:'csXueQiu',
    to:'background',
    data:{
      command:'rightClick',
      payload:{
        elementType:'table'
      }
    }
  } ;
  chrome.runtime.sendMessage(jsonMessage);
  return false; 
}, false);

//'.stock-info-content'

//https://xueqiu.com/snowman/S/00388/detail#/ZYCWZB -->ZYCWZB //综合财务指标
//https://xueqiu.com/snowman/S/00388/detail#/ZCFZB  -->ZCFZB  //资产负债表
//https://xueqiu.com/snowman/S/00388/detail#/GSLRB  -->GSLRB  //综合损益表
//https://xueqiu.com/snowman/S/00388/detail#/XJLLB  -->XJLLB  //现金流量表
//https://xueqiu.com/snowman/S/00388/detail#/FHPS   -->FHPS   //分红派送
function extractStatement_XQ(cSelector){
  //let tagTableDIV = document.querySelector(cSelector) ;
  let tagTable = document.querySelector(cSelector) ;
  console.log(tagTable.innerHTML) ;
  let tagHeadRow = tagTable.querySelector('thead').querySelector('tr') ;
  let tableHead=[] ;
  let tagHeadTHs = tagHeadRow.querySelectorAll('th') ;
  if(tagHeadTHs.length>0){
    tagHeadTHs.forEach(tagTH=>{
      tableHead.push(tagTH.innerText) ;
    }) ;
  }else{
    let tagHeadTHs = tagHeadRow.querySelectorAll('td') ;
    tagHeadTHs.forEach(tagTH=>{
        tableHead.push(tagTH.innerText) ;
    }) ;
  }

  let tagTBody = tagTable.querySelector('tbody') ;
  let tagRows = tagTBody.querySelectorAll('tr') ;
  let tableRows=[];
  for(let i=0;i<tagRows.length;i++){
    let tagRow = tagRows[i] ;
    let tagTDs = tagRow.querySelectorAll('td') ;
    let rowData = [] ;
    tagTDs.forEach(tagTD=>{
      rowData.push(tagTD.innerText) ;
    }) ;
    tableRows.push(rowData) ;
  }
  /*
  tagRows.forEach(tagRow=>{
    let tagTDs = tagRow.querySelectorAll('td') ;
    let rowData = [] ;
    tagTDs.forEach(tagTD=>{
      rowData.push(tagTD.innerText) ;
    }) ;
    tableRows.push(rowData) ;
  }) ;
  */
  console.log(tableHead) ;
  console.log(tableRows) ;

  let cURL =window.location.href;
  cURL= cURL.replace('https://xueqiu.com/snowman/S/','') ;
  cURL= cURL.replace('/detail#/',' ') ;
  let cParas = cURL.split(' ') ;

  let jsonStatements = {} ;
  jsonStatements.ticker = cParas[0] ;
  jsonStatements.statement = cParas[1] ;
  jsonStatements.source='xueqiu' ;

  /*
  if(jsonStatements.statement != 'FHPS'){
    const mapTable = new Map();
    for(let i=1;i<tableHead.length;i++){
      let jsonYearlyData = {} ;
      for(let j=0;j<tableRows.length;j++){
        jsonYearlyData[tableRows[j][0]]=tableRows[j][i] ;
      }
      console.log(jsonYearlyData) ;
      //mapTable.set(tableHead[i],jsonYearlyData) ;
      jsonStatements[tableHead[i]]=jsonYearlyData ;
    }
  }else*/
  {
    jsonStatements['table']=[] ;
    jsonStatements['table'].push(tableHead);
    for(let i=0;i<tableRows.length;i++){
      jsonStatements['table'].push(tableRows[i]);
    }
  }
  



  console.log(JSON.stringify(jsonStatements,null,3)) ;
  return jsonStatements ;
}
