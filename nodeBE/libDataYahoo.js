const fetch = require('node-fetch');
const cron = require('node-cron');
const libSQLDB = require('./libSQLite.js') ;
/*
{
    "quoteType": {
        "result": [
            {
                "symbol": "BN",
                "quoteType": "EQUITY",
                "exchange": "NYQ",
                "shortName": "Brookfield Corporation",
                "longName": "Brookfield Corporation",
                "messageBoardId": "finmb_364332",
                "exchangeTimezoneName": "America/New_York",
                "exchangeTimezoneShortName": "EDT",
                "gmtOffSetMilliseconds": "-14400000",
                "market": "us_market",
                "isEsgPopulated": false,
                "hasSelerityEarnings": false
            }
        ],
        "error": null
    }
}
*/
const url = `https://query2.finance.yahoo.com/v1/finance/quoteType/?symbol=BN&lang=en-US&region=US`;
const urlRTQuote = `https://query1.finance.yahoo.com/v7/finance/quote?&symbols=BN&fields=currency,fromCurrency,toCurrency,exchangeTimezoneName,exchangeTimezoneShortName,gmtOffSetMilliseconds,regularMarketChange,regularMarketChangePercent,regularMarketPrice,regularMarketTime,preMarketTime,postMarketTime,extendedMarketTime&crumb=6P2MIwNTMsc&formatted=false&region=US&lang=en-US`;
const urlLSEQuote= `https://query1.finance.yahoo.com/v7/finance/quote?&symbols=NG.L&fields=currency,fromCurrency,toCurrency,exchangeTimezoneName,exchangeTimezoneShortName,gmtOffSetMilliseconds,regularMarketChange,regularMarketChangePercent,regularMarketPrice,regularMarketTime,preMarketTime,postMarketTime,extendedMarketTime&crumb=6P2MIwNTMsc&formatted=false&region=US&lang=en-US` ;
const urlLSEQuote1=`https://query1.finance.yahoo.com/v7/finance/quote?&symbols=HICL.L&fields=currency,fromCurrency,toCurrency,exchangeTimezoneName,exchangeTimezoneShortName,gmtOffSetMilliseconds,regularMarketChange,regularMarketChangePercent,regularMarketPrice,regularMarketTime,preMarketTime,postMarketTime,extendedMarketTime&crumb=6P2MIwNTMsc&formatted=false&region=US&lang=en-US` ;
const urlSGIQuote= `https://query1.finance.yahoo.com/v7/finance/quote?&symbols=C38U.SI&fields=currency,fromCurrency,toCurrency,exchangeTimezoneName,exchangeTimezoneShortName,gmtOffSetMilliseconds,regularMarketChange,regularMarketChangePercent,regularMarketPrice,regularMarketTime,preMarketTime,postMarketTime,extendedMarketTime&crumb=6P2MIwNTMsc&formatted=false&region=US&lang=en-US` ; 
/**
{
    "quoteResponse": {
        "result": [
            {
                "language": "en-US",
                "region": "US",
                "quoteType": "EQUITY",
                "typeDisp": "Equity",
                "quoteSourceName": "Nasdaq Real Time Price",
                "triggerable": true,
                "customPriceAlertConfidence": "HIGH",
                "currency": "USD",
                "regularMarketPrice": 53.38,
                "exchangeTimezoneName": "America/New_York",
                "exchangeTimezoneShortName": "EDT",
                "gmtOffSetMilliseconds": -14400000,
                "esgPopulated": false,
                "regularMarketChangePercent": 1.5021884,
                "exchange": "NYQ",
                "market": "us_market",
                "hasPrePostMarketData": true,
                "firstTradeDateMilliseconds": 441642600000,
                "priceHint": 2,
                "preMarketTime": 1728047761,
                "regularMarketChange": 0.7900009,
                "regularMarketTime": 1728049223,
                "regularMarketPreviousClose": 52.59,
                "fullExchangeName": "NYSE",
                "sourceInterval": 15,
                "exchangeDataDelayedBy": 0,
                "tradeable": false,
                "cryptoTradeable": false,
                "marketState": "REGULAR",
                "symbol": "BN"
            }
        ],
        "error": null
    }
}
 */


async function _fetchQuotesYahoo(tickers){
    for(let i=0;i<tickers.length;i++){
        let urlQuote=`https://query1.finance.yahoo.com/v7/finance/quote?&symbols=${tickers[i]}&fields=currency,fromCurrency,toCurrency,exchangeTimezoneName,exchangeTimezoneShortName,gmtOffSetMilliseconds,regularMarketChange,regularMarketChangePercent,regularMarketPrice,regularMarketTime,preMarketTime,postMarketTime,extendedMarketTime&crumb=6P2MIwNTMsc&formatted=false&region=US&lang=en-US`;

        fetch(urlQuote, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
                'authority':'query1.finance.yahoo.com',
                'path':`/v7/finance/quote?&symbols=BN&fields=currency,fromCurrency,toCurrency,exchangeTimezoneName,exchangeTimezoneShortName,gmtOffSetMilliseconds,regularMarketChange,regularMarketChangePercent,regularMarketPrice,regularMarketTime,preMarketTime,postMarketTime,extendedMarketTime&crumb=6P2MIwNTMsc&formatted=false&region=US&lang=en-US`,
                'Cookie': `A3=d=AQABBIj3_WYCEN6dtWzk7ebf64_ep2UhHZMFEgEBAQFJ_2YHZwAAAAAA_eMAAA&S=AQAAAm5wIbjrrqnGwNEyIUhEAjg; A1=d=AQABBIj3_WYCEN6dtWzk7ebf64_ep2UhHZMFEgEBAQFJ_2YHZwAAAAAA_eMAAA&S=AQAAAm5wIbjrrqnGwNEyIUhEAjg; A1S=d=AQABBIj3_WYCEN6dtWzk7ebf64_ep2UhHZMFEgEBAQFJ_2YHZwAAAAAA_eMAAA&S=AQAAAm5wIbjrrqnGwNEyIUhEAjg; cmp=t=1728048953&j=0&u=1---; gpp=DBAA; gpp_sid=-1; axids=gam=y-k_PJroVE2uJgWcxtyfB_b1DSHULA6ulC~A&dv360=eS11X1Vad3ZKRTJ1SEdFTW9LM1lYRWVrYWJYWlM5ZmpHb35B&ydsp=y-GsjlQ2RE2uLe4zmOHIQqZPs4WLYLTnPc~A&tbla=y-TGCWtqdE2uJhqnFjaj3GnRsSMr6xDSnw~A; tbla_id=31e708b2-801c-4518-9fad-c6e7ed3546fb-tuctdf974ba; PRF=t%3DBN%252BAPI`
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        }).then(async function (data){
            console.log(JSON.stringify(data,null,3)) ;
            //console.log(JSON.stringify(data.quoteResponse.result,null,3)) ;
            //console.log(JSON.stringify(data.quoteResponse.result[0].regularMarketPrice,null,3)) ;
            let jsonQuote={
                ticker:data.quoteResponse.result[0].symbol,
                company:data.quoteResponse.result[0].symbol,
                quoteTTM:data.quoteResponse.result[0].regularMarketPrice,
                datetime:'2024-10-05 14:31:21 001'
            } ; 
            await libSQLDB.newUpdateQuoteTTM(jsonQuote) ;        
        }).catch(error => console.error('Error:', error));
    }
}



async function _fetchQuoteYahoo(ticker){
    let urlQuote=`https://query1.finance.yahoo.com/v7/finance/quote?&symbols=${ticker}&fields=currency,fromCurrency,toCurrency,exchangeTimezoneName,exchangeTimezoneShortName,gmtOffSetMilliseconds,regularMarketChange,regularMarketChangePercent,regularMarketPrice,regularMarketTime,preMarketTime,postMarketTime,extendedMarketTime&crumb=6P2MIwNTMsc&formatted=false&region=US&lang=en-US`;

    fetch(urlQuote, {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            'authority':'query1.finance.yahoo.com',
            'path':`/v7/finance/quote?&symbols=BN&fields=currency,fromCurrency,toCurrency,exchangeTimezoneName,exchangeTimezoneShortName,gmtOffSetMilliseconds,regularMarketChange,regularMarketChangePercent,regularMarketPrice,regularMarketTime,preMarketTime,postMarketTime,extendedMarketTime&crumb=6P2MIwNTMsc&formatted=false&region=US&lang=en-US`,
            'Cookie': `A3=d=AQABBIj3_WYCEN6dtWzk7ebf64_ep2UhHZMFEgEBAQFJ_2YHZwAAAAAA_eMAAA&S=AQAAAm5wIbjrrqnGwNEyIUhEAjg; A1=d=AQABBIj3_WYCEN6dtWzk7ebf64_ep2UhHZMFEgEBAQFJ_2YHZwAAAAAA_eMAAA&S=AQAAAm5wIbjrrqnGwNEyIUhEAjg; A1S=d=AQABBIj3_WYCEN6dtWzk7ebf64_ep2UhHZMFEgEBAQFJ_2YHZwAAAAAA_eMAAA&S=AQAAAm5wIbjrrqnGwNEyIUhEAjg; cmp=t=1728048953&j=0&u=1---; gpp=DBAA; gpp_sid=-1; axids=gam=y-k_PJroVE2uJgWcxtyfB_b1DSHULA6ulC~A&dv360=eS11X1Vad3ZKRTJ1SEdFTW9LM1lYRWVrYWJYWlM5ZmpHb35B&ydsp=y-GsjlQ2RE2uLe4zmOHIQqZPs4WLYLTnPc~A&tbla=y-TGCWtqdE2uJhqnFjaj3GnRsSMr6xDSnw~A; tbla_id=31e708b2-801c-4518-9fad-c6e7ed3546fb-tuctdf974ba; PRF=t%3DBN%252BAPI`
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then(async function (data){
        console.log(JSON.stringify(data,null,3)) ;
        //console.log(JSON.stringify(data.quoteResponse.result,null,3)) ;
        //console.log(JSON.stringify(data.quoteResponse.result[0].regularMarketPrice,null,3)) ;
        let jsonQuote={
            ticker:data.quoteResponse.result[0].symbol,
            company:data.quoteResponse.result[0].symbol,
            quoteTTM:data.quoteResponse.result[0].regularMarketPrice,
            datetime:'2024-10-05 14:31:21 001'
        } ; 
        await libSQLDB.newUpdateQuoteTTM(jsonQuote) ;        
    }).catch(error => console.error('Error:', error));
}



exports.fetchQuoteYahoo                     = _fetchQuoteYahoo ;
exports.fetchQuotesYahoo                    = _fetchQuotesYahoo ;
