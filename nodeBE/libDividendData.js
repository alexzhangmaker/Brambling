const puppeteer = require('puppeteer'); // v 1.1.0
const { URL } = require('url');


//Realty Income
//https://otp.tools.investis.com/clients/us/realty_income_corporation/dvc/default.aspx?culture=en-US
//https://www.nasdaq.com/market-activity/etf/schd/dividend-history
//https://api.nasdaq.com/api/quote/SCHD/dividends?assetclass=etf
//https://www.nasdaq.com/market-activity/stocks/bam/dividend-history
//https://api.nasdaq.com/api/quote/BN/dividends?assetclass=stocks

async function _fetchDividendNASDQ(ticker){
    const ETFs=['SCHD','PFF','EWA','EWU','TLT','SHV'] ;
    let urlDividend = '' ;
    if(ETFs.includes(ticker)){
        urlDividend = `https://api.nasdaq.com/api/quote/${ticker}/dividends?assetclass=etf` ;
    }else{
        urlDividend=`https://api.nasdaq.com/api/quote/${ticker}/dividends?assetclass=stocks`;
    }
    console.log(urlDividend) ;

    fetch(urlDividend, {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            'authority':'api.nasdaq.com',
            'path':`/api/quote/${ticker}/dividends?assetclass=stocks`,
            'Cookie': `ak_bmsc=68FA4E89033213AADDDFD1A35D39DE29~000000000000000000000000000000~YAAQN3jnMeqz85GTAQAALtklnhr95Kax7FtDbdoruabZQWXbgiOdEWcDt+qKHgHt0aVNttm1AmDVttEasBti2amhKQ1RlbEGTQsy5JnBc1Y+AMaeO0cVxAVCUvoPOR1U7PoeDSvJQK/SzxSXhWcdN2+3v7foL9UsE2y7iFyZfF7EolnZxmrPqWs7no6h1+xc0/l2o85puh+vFUnlJYHMiH3SL3MnErc7w/NQIYsam+Tm6Q16ABob9iSldnuVwcy0a6bFyIF5CPtUqNkthnwDY6Bp3NJDrlLinBobw61WlSgvY68KP1iCRpTHLzzI4dBm21v6mO1b1XLDygKl/7Jdm97ISBDShqM3Fa3vkql2dncyweQYhhO7/y1uJPzGaoR9sWNXhyXNHQ7LVYck6Oq92hyXH9cGgljjkRaW79PG/83AXWv9; Domain=.nasdaq.com; Path=/; Expires=Sat, 07 Dec 2024 00:45:00 GMT; Max-Age=7200`
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then(async function (jsonDIVHistory){
        console.log(JSON.stringify(jsonDIVHistory,null,3)) ;

        let jsonDIVNASDAQ={
            ticker:ticker,
            dividends:jsonDIVHistory.data.dividends.rows,
            exchange:'NASDAQ',
            date:jsonDIVHistory.data.exDividendDate,
            timestamp:(new Date()).getTime()
            /*annualizedDividend:jsonDIVHistory.data.annualizedDividend*/
        } ;
        console.log(jsonDIVNASDAQ.timestamp) ;
        
        let urlUpdateDIVNASDQ = 'http://127.0.0.1:10088/updateDIV.V1/' ;
        try {
            const response = await fetch(urlUpdateDIVNASDQ, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',       
              },
              body: JSON.stringify(jsonDIVNASDAQ), 
            });
        } catch (error) {
            console.error('Error:', error.message);
        }
    }).catch(error => console.error('Error:', error));
}



//https://finance.yahoo.com/quote/1038.HK/history/?filter=div
//_fetchDividendNASDQ('O') ;
//ok for fetch from NASDA


//https://www.morningstar.com/stocks/xhkg/01038/dividends
//https://api-global.morningstar.com/sal-service/v1/stock/dividends/v4/0P00009S5G/data?languageId=en&locale=en&clientId=MDC&component=sal-dividends&version=4.30.0
//http://www.aastocks.com/en/stocks/analysis/dividend.aspx?symbol=01038&filter=D

async function _fetchDividendMorningStar(ticker){
    let urlToFetch = `https://www.morningstar.com/stocks/xhkg/${ticker}/dividends` ;
    console.log(urlToFetch) ;
    const browser = await puppeteer.launch({headless:"new"});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36');
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    //await page.goto(urlToFetch, {waitUntil: 'networkidle2'});
    await page.goto(urlToFetch, {waitUntil:'networkidle2'}); /*'domcontentloaded'*//*'load'*/ /*'domcontentloaded'*//*'networkidle0'*/
    await page.waitForFunction(() => {
        // Replace with logic specific to your page
        return document.querySelector('.dividends-recent-table') !== null;
    }, { timeout: 10000 }); // Wait up to 10 seconds
    let jsonContent = await page.evaluate(_parseDividendMorningStar);
    await browser.close();

    let jsonDIVMorningStar={
        ticker:ticker,
        dividends:[],
        exchange:'HK',
        date:jsonContent.table[0][0],
        timestamp:(new Date()).getTime()
    } ;

    for(let i=0;i<jsonContent.table.length;i++){
        let jsonDIV={
            DeclarationDate:jsonContent.table[i][0],
            RecordDate:jsonContent.table[i][1],
            PayableDate:jsonContent.table[i][2],
            DividendType:jsonContent.table[i][3],
            Amount:jsonContent.table[i][4]
        } ;
        jsonDIVMorningStar.dividends.push(jsonDIV) ;
    }

    console.log(jsonDIVMorningStar) ;
    let urlUpdateDIVNASDQ = 'http://127.0.0.1:10088/updateDIV.V1/' ;
    try {
        const response = await fetch(urlUpdateDIVNASDQ, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',       
            },
            body: JSON.stringify(jsonDIVMorningStar), 
        });
    } catch (error) {
        console.error('Error:', error.message);
    }

}

async function _parseDividendMorningStar(){

    console.log('_parseDividendMorningStar');
    let jsonDiv={
        ticker:'01038' ,
        table:[]
    }
    
    let tagTable = document.querySelector('.dividends-recent-table') ;
    let tagRows = tagTable.querySelectorAll('tr.content') ;//content
    for(let i=0;i<tagRows.length;i++){
        let rowData=[] ;
        if(tagRows[i]!=null){
            let tagTDs = tagRows[i].querySelectorAll('td') ;
            tagTDs.forEach(tagTD=>{
                rowData.push(tagTD.innerText.replace(/(\r\n|\n|\r)/gm, "").trimStart().trimEnd()) ;//.innerText.replace(/(\r\n|\n|\r)/gm, "")
            }) ;
            jsonDiv.table.push(rowData) ;
        }
    }
    
    return jsonDiv ;
}





async function DoWork(){
    //_fetchDividendNASDQ('BAM') ;

    //await _fetchDividendMorningStar('00014') ;
}

//DoWork() ;


exports.fetchDividendNASDQ                = _fetchDividendNASDQ ;
exports.fetchDividendMorningStar          = _fetchDividendMorningStar ;

