console.log('Brambling csYahoo ') ;

/*
endpoints:
  csAAStock
  serviceWorker,
  sidePanel
command:
  uploadData/uploadDataAck
  requestData/requestDataAck
*/
function _sendMessage2SW(command,jsonMessage){
  let message = { 
    from: "csYahoo", 
    to:'serviceWorker',
    command:command,
    data:jsonMessage
  } ;

  chrome.runtime.sendMessage(message, (response) => {
    console.log("csSeekingAlpha Message response:", response);
    if (response.status === "success") {
      console.log("csSeekingAlpha Message sent successfully:", response.data);
    }else{
      console.error("csSeekingAlpha  Error sending message:", response.error);
    }
  });
}

function _onMessage(request, sender, sendResponse) {
  switch(request.command){
    case 'requestData':
      _doRequestData(request) ;
      break ;
    default:
      break;
  }
}

function parseLocationMeta(){
  let cLocation = window.location;
  let jsonURL={
    href:cLocation.href,
    hostname:cLocation.hostname,
    port:cLocation.port,
    pathname:cLocation.pathname,
    search:cLocation.search,
    module:'',
    symbol:''
  }

  // /quote/PAX/financials/
  let keyWords = jsonURL.pathname.split('/') ;
  if(keyWords[0]!='quote')alert('something wrong') ;

  jsonURL.module = keyWords[2];
  jsonURL.symbol = keyWords[1];

  console.log(jsonURL) ;
  return jsonURL ;
}


/**
    {
        "exOrEffDate": "11/29/2024",
        "type": "Cash",
        "amount": "$0.38",
        "declarationDate": "11/04/2024",
        "recordDate": "11/29/2024",
        "paymentDate": "12/31/2024",
        "currency": "USD"
    },
    [
    "Announce Date",    ==declarationDate
    "Year Ended",       ==no need
    "Event",            ==no need
    "Particular",       ==>amount, remove D:,add HKD
    "Type",             ==type
    "Ex-Date",          ==exOrEffDate recordDate
    "Book Close Date",  ==no need
    "Payable Date"      ==paymentDate
    ]

 */
//D:HKD 1.1700 (2nd Interim dividend in lieu of a final dividend)
function _parseAmount(csAmount){
  let csTemp = csAmount.replace('D:HKD ','').trimStart() ;
  let csArray = csTemp.split(' ') ;
  let retCode = parseFloat(csArray[0]) ;
  if(Number.isNaN(retCode)) return 0 ;
  return retCode ;
}

function _doRequestData(jsonMessage){
  console.log(jsonMessage) ;
  if(jsonMessage.data.type != 'table')return ;

  let tagTable = document.querySelector(jsonMessage.data.element) ;//table.cnhk-cf
  console.log(tagTable.innerHTML) ;
  let tagTRs = tagTable.querySelectorAll('tr') ;

  let jsonDIVs=[] ;
  for(let i=1;i<tagTRs.length;i++){
    let tagTDs = tagTRs[i].querySelectorAll('td') ;
    let jsonRow={
      "exOrEffDate": tagTDs[0].innerText,
      "type": "Cash",
      "amount": _parseAmount(tagTDs[3].innerText),//tagTDs[3].innerText.replace('D:HKD ',''),
      "declarationDate": tagTDs[0].innerText,
      "recordDate": tagTDs[5].innerText,
      "paymentDate": tagTDs[7].innerText,
      "currency": "HKD"
    } ;
    jsonDIVs.push(jsonRow) ;
  }
  console.log(jsonDIVs) ;
  
  let jsonURLMeta = parseLocationMeta() ;
  let jsonMessageAck={
        serial:0,
        from: "csAAStock",
        to:'serviceWorker',
        command:'requestDataAck',
        data:{
          element:jsonMessage.data.element,
          type:jsonMessage.data.type,
          content:jsonDIVs,
          extrea:{
            url:jsonURLMeta.href,
            module:jsonURLMeta.module,
            symbol:jsonURLMeta.symbol
          }
        }
  } ;
  chrome.runtime.sendMessage(jsonMessageAck) ;
}


chrome.runtime.onMessage.addListener(_onMessage);
