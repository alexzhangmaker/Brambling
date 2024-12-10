const fetch = require('node-fetch');
const cron = require('node-cron');
const libSQLDB = require('./libSQLite.js') ;

/*
const urlHKX=   `https://stock.xueqiu.com/v5/stock/chart/minute.json?symbol=00388&period=1d` ;
const url =     'https://stock.xueqiu.com/v5/stock/quote.json?symbol=SH600100&extend=detail';
const urlHKXRT= `https://stock.xueqiu.com/v5/stock/quote.json?symbol=00388&extend=detail` ;
const urlUS =   `https://stock.xueqiu.com/v5/stock/quote.json?symbol=BAM&extend=detail` ;
*/

let cookieTTM={
    date:'2024-12-05',
    cookie:`xq_a_token=220b0abef0fac476d076c9f7a3938b7edac35f48; xqat=220b0abef0fac476d076c9f7a3938b7edac35f48; xq_r_token=a57f65f14670a8897031b7c4f10ea42a50894850; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOi0xLCJpc3MiOiJ1YyIsImV4cCI6MTczNTY5Mjg4OSwiY3RtIjoxNzMzNzQ4NDYyNjU4LCJjaWQiOiJkOWQwbjRBWnVwIn0.ZcAHmKs_S_URUXcppA3GXGU1uSxNPyq8b399veuPReeMfviGg5UuIvXXRXu8CSC-fr32FnRvjM6jIx5Tf9fGYhRk1CTF2UXe-vwp1DAOfiQoaCJbMPZfDuT89lHQAkNzt5jcLEJgCBfGzIWkANrxWKY81PejItOzizlu4_9e9dH2wfw818vNVUBdT58ta236diRqxzf5L8iTSkArvTpg6hoevHodxCHG6oL_b7zBi4nu-CNYAWHzTlvVy8GpUQnuCN4TajhN5WO8EuJIeXYrIVFXRgdwY9CnlaP2PdngWjh0pClABrJegZFaWE3mp5jNBxqyEYTFQF54lWtNfnzhDA; cookiesu=751733748493011; u=751733748493011; device_id=fa9a659827e96884a39ac4ab6e75ed2c; Hm_lvt_1db88642e346389874251b5a1eded6e3=1733748495; HMACCOUNT=B11092AB2E0DBBFD; is_overseas=1; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1733748511; ssxmod_itna=QqUx9DBDRAitKDKD=DXWDHGHPPeqOAi4xAKPmtwtdND/SYED3q0=GFDf4733koPYFGAGeebm8aCG5obGnf2DPoTn4xeq6KYEa0aD84i7DKqibnDivQDjrxxPDxx0oD5xGoDPxDeDAD5DCV6IQD0+zu1yzsoq8h6IzDYa=DiIQDYypDAuhxtAzsEGhBiqDuZvQwxi8D7FfRQEzD7cpmI3DXrqDEn4198dDvggOw1rsD3AQgb2DN2QPx14PYc2D1Giqt=GxaD4eEGDBdM=eYiD31W23zZQDiEU54D=; ssxmod_itna2=QqUx9DBDRAitKDKD=DXWDHGHPPeqOAi4xAKPmtwtdG97MGiDBwWfq7PBhl7FG2GYq08Deq+D`
};

async function _fetchQuotesXQ(tickers){
    for(let i=0;i<tickers.length;i++){
        let urlQuote=`https://stock.xueqiu.com/v5/stock/quote.json?symbol=${tickers[i]}&extend=detail` ;
        fetch(urlQuote, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
                'Referer': 'https://xueqiu.com/',
                'Origin': 'https://xueqiu.com/',
                'Cookie': cookieTTM.cookie  // You may need a session cookie if required
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        }).then(async function (data){
            console.log(JSON.stringify(data,null,3)) ;
            let jsonQuote={
                ticker:data.data.quote.symbol,
                company:data.data.quote.name,
                quoteTTM:data.data.quote.current,
                datetime:'2024-10-05 14:31:21 001'
            } ; 
            //await libSQLDB.newUpdateQuoteTTM(jsonQuote) ;
            //await libSQLDB.newUpdateQuoteTTM(jsonQuote) ;
            let urlUpdateQuote = 'http://127.0.0.1:10088/updateQuote.V1/' ;
            try {
                const response = await fetch(urlUpdateQuote, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',       
                },
                body: JSON.stringify(jsonQuote), 
                });
            } catch (error) {
                console.error('Error:', error.message);
            }

        }).catch(error => console.error('Error:', error));
    }
}

//https://stock.xueqiu.com/v5/stock/quote.json?symbol=00388&extend=detail
async function _fetchQuoteXQ(ticker){
    {
        let urlQuote=`https://stock.xueqiu.com/v5/stock/quote.json?symbol=${ticker}&extend=detail` ;
        fetch(urlQuote, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
                'Referer': 'https://xueqiu.com/',
                'Origin': 'https://xueqiu.com/',
                'Cookie': cookieTTM.cookie//`cookiesu=601728857549963; u=601728857549963; device_id=96cf82c68da69cd363fd4d330dfc1893; Hm_lvt_1db88642e346389874251b5a1eded6e3=1728857552; HMACCOUNT=90EF1010BD0DEC42; s=bh1ikv3fou; xq_a_token=f84a0b79c9e449cb1003cb36412faa34001a6697; xqat=f84a0b79c9e449cb1003cb36412faa34001a6697; xq_r_token=b24e38a4224932f5c7abd28126e8fc377b42755b; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOi0xLCJpc3MiOiJ1YyIsImV4cCI6MTczMTgwNDgwNiwiY3RtIjoxNzI5MzA5MzM2NTA0LCJjaWQiOiJkOWQwbjRBWnVwIn0.ap_m7pk8HNFLR7WtXVlcF100k4PSmN1kjrPLDKpXiHN3bRx-g27TEQ1OibP0cEd4OPNTlWHu9Ap-5_My2C6OXz55TWD51jCzOvQN9vw6aZB1vHBGDif4jbeKntuTatX2n0oKaUfB4gcL4srwZDp6T9yeqhtjkVHKooGq-8GWvYgqG3LE3mAQ-jDlkS0F4bPBrdHOWyKEarNdGIebvKo8rhbxSNPfnj_a8F4kxwq5N1s_wU2etTj_aWnZpwE_vfLUNot6KGp9xJPuzsYcDEj2Os8zbB1BdQ6iU2-rHqJgbfzZgXJR9NmoMSc2Axh-D-nZ-0Jd5JZovX_9gEd04hgk8A; is_overseas=1; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1729309368; ssxmod_itna=YqAx0QDteCqqcDRxBcDB+2tIG77wYGOQeO+YyBSDBwMO4AQDyD8xA3GEIAoKQfil00w5LeKfqhqLe=AcqKoFP+qhaeD7ufsfDneG0DQKGmmxGt7D7kb+oD44GTDt4DTD34DYDi2=DBSvKQD04z2aHz1xwOspKzDYcQDiKQDYHpDAThVPYz1=Dh9YqDuc5Qhxi8D79E0eozD7ap+z3DXoqDEj+CnbdDv2OOhO2z/xYQyt2YTZuN3QrrCia4rCiY7r0eQQ457pGyaAWqQAe5fA4uT7DDiht54D; ssxmod_itna2=YqAx0QDteCqqcDRxBcDB+2tIG77wYGOQeO+YyBD8TcDGNaG2zxFqiQqx`  // You may need a session cookie if required
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        }).then(async function (data){
            console.log(JSON.stringify(data,null,3)) ;
            let jsonQuote={
                ticker:data.data.quote.symbol,
                company:data.data.quote.name,
                quoteTTM:data.data.quote.current,
                datetime:'2024-10-05 14:31:21 001'
            } ; 
            //await libSQLDB.newUpdateQuoteTTM(jsonQuote) ;
            let urlUpdateQuote = 'http://127.0.0.1:10088/updateQuote.V1/' ;
            try {
                const response = await fetch(urlUpdateQuote, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',       
                },
                body: JSON.stringify(jsonQuote), 
                });
            } catch (error) {
                console.error('Error:', error.message);
            }

        }).catch(error => console.error('Error:', error));
    }
}


function doWork(){

    let globalTickers=[
        'SH600100',
        '00388',
        'BAM'
    ] ;

    _fetchQuotesXQ(globalTickers) ;

}

//doWork() ;

exports.fetchQuoteXQ                    = _fetchQuoteXQ ;
exports.fetchQuotesXQ                   = _fetchQuotesXQ ;

