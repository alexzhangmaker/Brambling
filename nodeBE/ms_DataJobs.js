const cron = require('node-cron');
const fetch = require('node-fetch') ;
const libSQLite = require('./libSQLite.js') ;
const libDataXQ = require('./libDataXQ.js') ;
const libDataYahoo = require('./libDataYahoo.js') ;
const libDataDiv = require('./libDividendData.js') ;

const libGMail = require('./libNodeMail.js') ;
const libTelegram = require('./libPushTelegram.js') ;

async function checkTriggers(){
    let urlFetchTriggers = 'http://127.0.0.1:10088/fetchAllTriggers.V1' ;
    let response = await fetch(urlFetchTriggers) ;//libSQLite.fetchAllTickers() ;
    let jsonTriggers = await response.json() ;
    //let jsonTriggers = await libSQLite.fetchAllTriggers() ;
    console.log(jsonTriggers) ;
    for(let i=0;i<jsonTriggers.length;i++){
        let urlFetchQuoteTTM = `http://127.0.0.1:10088/fetchQuoteTTM.V1/:${jsonTriggers[i].ticker}` ;
        response = await fetch(urlFetchQuoteTTM) ;
        let jsonQuote = await response.json();//await libSQLite.fetchQuoteTTM(jsonTriggers[i].ticker) ;
        if(jsonQuote==undefined)continue ;

        console.log(jsonQuote) ;
        if(jsonQuote.quoteTTM<=jsonTriggers[i].lowerThan){
            if(jsonTriggers[i].actionResult == 'done')continue ;

            console.log(`${jsonTriggers[i].ticker} will trigger`) ;
            let mailOptions = {
                from: 'alexszhang@gmail.com',
                to: 'alexszhang@gmail.com',
                subject: `${jsonTriggers[i].ticker} will trigger`,
                text: 'That was easy!'
            };
            
            //libGMail.sendGoogleMail(mailOptions) ;

            libTelegram.notifyTelegram(mailOptions.subject,mailOptions.text) ;

            //let jsonTrigger = jsonTriggers[i] ;
            jsonTriggers[i].actionResult = 'done' ;
            //await libSQLite.updateTrigger(jsonTriggers[i]) ;
            let urlUpdateTrigger = `http://127.0.0.1:10088/updateTrigger.V1` ;
            try {
                const response = await fetch(urlUpdateTrigger, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',       
                  },
                  body: JSON.stringify(jsonTriggers[i]), 
                });
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
    }
}


async function updatePortfolioQuotes(){
    const noFetchTickers=['MKL.SMART','BRK.SMART','BN.PR.B','FTS.PR.G','JPM.PRD','SPG.PRJ','US-T25','US-T29'];
    let urlFetchTickers = 'http://127.0.0.1:10088/fetchAllTickers.V1' ;
    let response = await fetch(urlFetchTickers) ;//libSQLite.fetchAllTickers() ;
    let jsonTickers = await response.json() ;
    console.log(jsonTickers) ;
    for(let i=0;i<jsonTickers.length;i++){
        let jsonTicker = jsonTickers[i] ;
        if(noFetchTickers.includes(jsonTicker.ticker))continue ;

        if(jsonTicker.exchange == 'US' ){
            libDataYahoo.fetchQuoteYahoo(jsonTicker.ticker) ;
            continue ;
        }
        if(jsonTicker.exchange == 'TSE' ){
            //libDataYahoo.fetchQuoteYahoo(jsonTicker.ticker) ;
            continue ;
        }
        if(jsonTicker.exchange == 'SGX' ){
            //libDataYahoo.fetchQuoteYahoo(jsonTicker.ticker) ;
            continue ;
        }
        if(jsonTicker.exchange == 'LSE' ){
            libDataYahoo.fetchQuoteYahoo(jsonTicker.ticker) ;
            continue ;
        }
        if(jsonTicker.exchange == 'CN'){
            libDataXQ.fetchQuoteXQ(jsonTicker.ticker) ;
            continue ;
        }
        if(jsonTicker.exchange == 'HK'){
            libDataXQ.fetchQuoteXQ(jsonTicker.ticker) ;
            continue ;
        }
    }
}

let globalDIVTickers=[] ;


async function updatePortfolioDIVs(){
    const fetchDIVTickers=['BN','APO','PAX','BIPC','BEPC','PFF','EWA','EWU','NGG',
        'TLT','PFE','MCD','PAC','PDD','ADC','ASR','KOF','OMAB','UNP','SHV','VZ',
        '00388','00010','01972','01038','00823'];//'SCHD','BAM','O',

    if(globalDIVTickers.length==0){
        let urlFetchTickers = 'http://127.0.0.1:10088/fetchAllTickers.V1' ;
        let response = await fetch(urlFetchTickers) ;//libSQLite.fetchAllTickers() ;
        globalDIVTickers = await response.json() ;
        //console.log(globalDIVTickers) ;
    }

    //for(let i=0;i<globalDIVTickers.length;i++)

    let jsonTicker = globalDIVTickers[0] ;
    console.log(`updatePortfolioDIVs will check: ${jsonTicker.ticker}`) ;
    if(fetchDIVTickers.includes(jsonTicker.ticker)!=true){
        globalDIVTickers.splice(0,1) ;
        return ;
    } ;

    console.log(`updatePortfolioDIVs will do: ${jsonTicker.ticker}`) ;
    if(jsonTicker.exchange == 'US' ){
        libDataDiv.fetchDividendNASDQ(jsonTicker.ticker) ;
        globalDIVTickers.splice(0,1) ;

        return ;
    }
    
    if(jsonTicker.exchange == 'HK'){
        //libDataDiv.fetchDividendMorningStar(jsonTicker.ticker) ;
        globalDIVTickers.splice(0,1) ;
        return ;
    }
}

updatePortfolioQuotes() ;

cron.schedule('*/5 * * * *', () => {
    console.log('running a task every 5 minute');
    updatePortfolioQuotes() ;
    checkTriggers() ;
});

