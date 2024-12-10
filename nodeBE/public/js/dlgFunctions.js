async function _onClickLogDeal(event){
  

  let jsonDialog={
      cssContainer:'#idDlgContainer',
      theme:{
          backgroundColor:'aqua',
          border:'blue',
          font:'asap-condensed-regular'
      },
      layout:{
          width:600,
          height:450
      },
      content:{
          title:'Brambling Log Transaction',
          fields:[
              {
                  label:'accountID:',
                  content:{
                      type:'input.Text',
                      default:'accountID?',//jsonEvent.title,//'about what?',
                      name:'accountID'
                  }
              },{
                  label:'ticker:',
                  content:{
                      type:'input.Text',
                      default:'ticker?',
                      name:'ticker'
                  }
              },{
                  label:'company:',
                  content:{
                      type:'input.Text',
                      default:'company',//info.dateStr,
                      name:'company'
                  }
              },
              {
                  label:'operation:',
                  content:{
                      type:'input.Text',
                      default:'operation',//'10:00',
                      name:'operation'
                  }
              },{
                  label:'price:',
                  content:{
                      type:'input.Text',
                      default:'price?',//'12:00',
                      name:'price'
                  }
              },{
                  label:'amount:',
                  content:{
                      type:'input.Text',
                      default:'amount?',//'https://www.google.com',
                      name:'amount'
                  }
              }
          ]
      },
      callback:{
          commitFunc:'_callback_LogDeal'
      },
      callParameters:{
          
      }
  } ;
  createLarkDialog(jsonDialog) ;

}


function _callback_LogDeal(jsonDeal){
    console.log(jsonDeal) ;
  
    let cDate = new Date() ;
    let jsonTransaction={
        transactionID:'d',
        accountID:jsonDeal.accountID,
        ticker:jsonDeal.ticker,
        company:jsonDeal.company,
        operation:jsonDeal.operation,
        price:parseFloat(jsonDeal.price),
        amount:parseInt(jsonDeal.amount),
        cDateTime:cDate.getTime(),
        currency:'HKD',
        exchange:'HK'
    } ;
  
    let urlLogTrans = `/logTransaction.V1/` ;
    fetch(urlLogTrans, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonTransaction)
    }).then(res => res.json())
    .then(resJSON =>{
      console.log(resJSON) ;
    });
  }



async function _onClickRulePlus(event){
  

    let jsonDialog={
        cssContainer:'#idDlgContainer',
        theme:{
            backgroundColor:'aqua',
            border:'blue',
            font:'asap-condensed-regular'
        },
        layout:{
            width:600,
            height:450
        },
        content:{
            title:'Brambling Log Transaction',
            fields:[
                {
                    label:'accountID:',
                    content:{
                        type:'input.Text',
                        default:'accountID?',//jsonEvent.title,//'about what?',
                        name:'accountID'
                    }
                },{
                    label:'ticker:',
                    content:{
                        type:'input.Text',
                        default:'ticker?',
                        name:'ticker'
                    }
                },{
                    label:'company:',
                    content:{
                        type:'input.Text',
                        default:'company',//info.dateStr,
                        name:'company'
                    }
                },
                {
                    label:'operation:',
                    content:{
                        type:'input.Text',
                        default:'operation',//'10:00',
                        name:'operation'
                    }
                },{
                    label:'price:',
                    content:{
                        type:'input.Text',
                        default:'price?',//'12:00',
                        name:'price'
                    }
                },{
                    label:'amount:',
                    content:{
                        type:'input.Text',
                        default:'amount?',//'https://www.google.com',
                        name:'amount'
                    }
                }
            ]
        },
        callback:{
            commitFunc:'_callback_RulePlus'
        },
        callParameters:{
            
        }
    } ;
    createLarkDialog(jsonDialog) ;
  
  }

  function _callback_RulePlus(jsonDeal){
    alert('idBTNRulePlus') ;
  }