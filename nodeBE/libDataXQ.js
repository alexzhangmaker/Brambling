const fetch = require('node-fetch');
const cron = require('node-cron');
const libSQLDB = require('./libSQLite.js') ;

/*
const urlHKX=   `https://stock.xueqiu.com/v5/stock/chart/minute.json?symbol=00388&period=1d` ;
const url =     'https://stock.xueqiu.com/v5/stock/quote.json?symbol=SH600100&extend=detail';
const urlHKXRT= `https://stock.xueqiu.com/v5/stock/quote.json?symbol=00388&extend=detail` ;
const urlUS =   `https://stock.xueqiu.com/v5/stock/quote.json?symbol=BAM&extend=detail` ;
*/

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
                'Cookie': `xq_a_token=dbc1dc6d13bd101dd06f18c5b7f2fb2eb276fb5a; xqat=dbc1dc6d13bd101dd06f18c5b7f2fb2eb276fb5a; xq_r_token=8009cc86908134cef1e05f27b0fbea84bea0abb7; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOi0xLCJpc3MiOiJ1YyIsImV4cCI6MTczMDUwODgwMCwiY3RtIjoxNzI3OTU3NjMzNzY2LCJjaWQiOiJkOWQwbjRBWnVwIn0.TjWeQJuF-ihv_LxbEnI6ZXxsf0IqaqxJvCj5L4LkTWJZXkN8TODCAXUC4wkOHUqleIMzQm2aHgCjLZbGWRHPmVemj7ZNEM2Rb3srYH3YSjkA6_qijsH99jbsXTLi9lueZkrV2hzcnjnWn3VgZHtvARwTTnBPC3yAJaEvQ3PUgBeGmZMNMpUhVY1FS1KcuTZxybkhJ_F69UaBInRQHiCZicwylrymAkGyLjeUyj2_orMxQ-aF5ealsp2bnqYyV1GFrEMwoYGJmXt3EuV9gcnk00-8uOVCVCnISPwAsoLKhGO3fp6-vcLkkuyo0w3wbn68nlFx0XXKOvOXRkCoS1Mi6A; cookiesu=901727957680344; u=901727957680344; device_id=96cf82c68da69cd363fd4d330dfc1893; Hm_lvt_1db88642e346389874251b5a1eded6e3=1727957682; HMACCOUNT=34CDCAA13D29A615; s=be12ge9rl1; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1727997169; ssxmod_itna=QqmxgDnWq+GHeGdD7+e5YK0=e62A=xGq+Bmhqi=H7DlhpSDWKGkD6DWP0Wt9YeTGQhifoEbcfBGQ=InRihHEehneDk8gQYK5D84i7DKqibnDivQDjgimqDxx0oD5xGoDPxDeDABKDCZTTKD7xXBfdXUm2jXbqNDmfKDYTKDmLbDnE0V4eXUYGiCAxGgSTI0DY=DQMWO+eNDjfbrNPGyAxGW8rt8EPGuBjj0+7NVDWIk17DvW9hGYA=m07DQeohoK0f5niOQjbmXhAxeniwK0GdvkUODG8C5zDqxD; ssxmod_itna2=QqmxgDnWq+GHeGdD7+e5YK0=e62A=xGq+Bmhqi=eD62bG=Qx05Kr83037Yg0RuDn4ho8lrDG=g8YCGRWZDKewhCq0jMTufK5YbYhxMjtDlmCTo7P2juTPNAjBEvwNTH0fQIaZ=gOenui029xApns7AnW3OyCr2Ik7Oyi5/HpaUHiuEKpSWHOxoYh6hKKGtwr/=i3ujAYFri=IKkETpwKYOG613MOc2KFv2rETSx7/G8iNPaAvIu5H8mK=yWtLCF3RALi76jtH1vyhxz0eOf=MiGYee7yYAeK3UWLxpbaYnpuNIDnEGhi0whAmyD28Uq8lb6IqatAyGTO/ct/5dD07Q0KcBQsDF3fCOWziuD1eoSBWYrw+j33b=YO4DQms7pYr=+0DD7=DY9eeD==`  // You may need a session cookie if required
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
                quoteTTM:data.data.quote.last_close,
                datetime:'2024-10-05 14:31:21 001'
            } ; 
            await libSQLDB.newUpdateQuoteTTM(jsonQuote) ;

        }).catch(error => console.error('Error:', error));
    }
}


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
                'Cookie': `xq_a_token=dbc1dc6d13bd101dd06f18c5b7f2fb2eb276fb5a; xqat=dbc1dc6d13bd101dd06f18c5b7f2fb2eb276fb5a; xq_r_token=8009cc86908134cef1e05f27b0fbea84bea0abb7; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOi0xLCJpc3MiOiJ1YyIsImV4cCI6MTczMDUwODgwMCwiY3RtIjoxNzI3OTU3NjMzNzY2LCJjaWQiOiJkOWQwbjRBWnVwIn0.TjWeQJuF-ihv_LxbEnI6ZXxsf0IqaqxJvCj5L4LkTWJZXkN8TODCAXUC4wkOHUqleIMzQm2aHgCjLZbGWRHPmVemj7ZNEM2Rb3srYH3YSjkA6_qijsH99jbsXTLi9lueZkrV2hzcnjnWn3VgZHtvARwTTnBPC3yAJaEvQ3PUgBeGmZMNMpUhVY1FS1KcuTZxybkhJ_F69UaBInRQHiCZicwylrymAkGyLjeUyj2_orMxQ-aF5ealsp2bnqYyV1GFrEMwoYGJmXt3EuV9gcnk00-8uOVCVCnISPwAsoLKhGO3fp6-vcLkkuyo0w3wbn68nlFx0XXKOvOXRkCoS1Mi6A; cookiesu=901727957680344; u=901727957680344; device_id=96cf82c68da69cd363fd4d330dfc1893; Hm_lvt_1db88642e346389874251b5a1eded6e3=1727957682; HMACCOUNT=34CDCAA13D29A615; s=be12ge9rl1; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1727997169; ssxmod_itna=QqmxgDnWq+GHeGdD7+e5YK0=e62A=xGq+Bmhqi=H7DlhpSDWKGkD6DWP0Wt9YeTGQhifoEbcfBGQ=InRihHEehneDk8gQYK5D84i7DKqibnDivQDjgimqDxx0oD5xGoDPxDeDABKDCZTTKD7xXBfdXUm2jXbqNDmfKDYTKDmLbDnE0V4eXUYGiCAxGgSTI0DY=DQMWO+eNDjfbrNPGyAxGW8rt8EPGuBjj0+7NVDWIk17DvW9hGYA=m07DQeohoK0f5niOQjbmXhAxeniwK0GdvkUODG8C5zDqxD; ssxmod_itna2=QqmxgDnWq+GHeGdD7+e5YK0=e62A=xGq+Bmhqi=eD62bG=Qx05Kr83037Yg0RuDn4ho8lrDG=g8YCGRWZDKewhCq0jMTufK5YbYhxMjtDlmCTo7P2juTPNAjBEvwNTH0fQIaZ=gOenui029xApns7AnW3OyCr2Ik7Oyi5/HpaUHiuEKpSWHOxoYh6hKKGtwr/=i3ujAYFri=IKkETpwKYOG613MOc2KFv2rETSx7/G8iNPaAvIu5H8mK=yWtLCF3RALi76jtH1vyhxz0eOf=MiGYee7yYAeK3UWLxpbaYnpuNIDnEGhi0whAmyD28Uq8lb6IqatAyGTO/ct/5dD07Q0KcBQsDF3fCOWziuD1eoSBWYrw+j33b=YO4DQms7pYr=+0DD7=DY9eeD==`  // You may need a session cookie if required
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
                quoteTTM:data.data.quote.last_close,
                datetime:'2024-10-05 14:31:21 001'
            } ; 
            await libSQLDB.newUpdateQuoteTTM(jsonQuote) ;

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

