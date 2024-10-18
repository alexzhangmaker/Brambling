
const cron = require('node-cron');
const libSQLite = require('./libSQLite.js') ;
const libDataXQ = require('./libDataXQ.js') ;
const libDataYahoo = require('./libDataYahoo.js') ;
const libGMail = require('./libNodeMail.js') ;

async function checkTriggers(){
    let jsonTriggers = await libSQLite.fetchAllTriggers() ;
    for(let i=0;i<jsonTriggers.length;i++){
        let jsonQuote = await libSQLite.fetchQuoteTTM(jsonTriggers[i].ticker) ;
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
            
            libGMail.sendGoogleMail(mailOptions) ;
            //let jsonTrigger = jsonTriggers[i] ;
            jsonTriggers[i].actionResult = 'done' ;
            await libSQLite.updateTrigger(jsonTriggers[i]) ;


        }/*else{
            console.log(`${jsonTriggers[i].ticker} will not trigger`) ;
            let mailOptions = {
                from: 'alexszhang@gmail.com',
                to: 'alexszhang@gmail.com',
                subject: `${jsonTriggers[i].ticker} will not trigger`,
                text: 'That was easy!'
            };
            
            libGMail.sendGoogleMail(mailOptions) ;
        }
        */
    }
}

async function updatePortfolioQuotes(){
    let jsonTickers = await libSQLite.fetchAllTickers() ;

    for(let i=0;i<jsonTickers.length;i++){
        let jsonTicker = jsonTickers[i] ;
        if(jsonTicker.exchange == 'US' ){
            libDataYahoo.fetchQuoteYahoo(jsonTicker.ticker) ;
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
//libDataXQ.fetchQuotesXQ(globalTickers) ;
//libDataXQ.fetchQuotesXQ(globalTickersCN) ;
//libDataYahoo.fetchQuotesYahoo(globalTickersNCN) ;

//updatePortfolioQuotes() ;

/*
let globalCount = 0 ;
let mailOptions = {
    from: 'alexszhang@gmail.com',
    to: 'alexszhang@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

libGMail.sendGoogleMail(mailOptions) ;
*/

checkTriggers() ;


cron.schedule('*/5 * * * *', () => {
    console.log('running a task every 5 minute');
    //libDataXQ.fetchQuotesXQ(globalTickersCN) ;
    //libDataYahoo.fetchQuotesYahoo(globalTickersNCN) ;
    /*
    mailOptions.text = `#${globalCount} That was easy!`
    libGMail.sendGoogleMail(mailOptions) ;
    globalCount = globalCount + 1 ;
    */

    updatePortfolioQuotes() ;

    checkTriggers() ;

});