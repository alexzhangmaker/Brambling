

const cron = require('node-cron');
const libDataXQ = require('./libDataXQ.js') ;
const libDataYahoo = require('./libDataYahoo.js') ;
const libGMail = require('./libNodeMail.js') ;

let jsonPortfolio=[
    {
        account:'IB1279',
        cash:[
            {
                cash:7000,
                currency:'USD'
            },
            {
                cash:-2000,
                currency:'HKD'
            }
        ],
        receivable:[],
        currency:"USD",
        holdings:[
            {
                exchange:'US',
                ticker:'BN',
                company:'Brookfield',
                quoteTTM:22.0,
                holding:2000,
                costPerShare:21.0,
                currency:'USD'
            },{
                exchange:'US',
                ticker:'APO',
                company:'Apollo',
                quoteTTM:25.0,
                holding:1000,
                costPerShare:31.0,
                currency:'USD'
            }
        ]
    },{
        account:'IB0575',
        cash:[
            {
                cash:7000,
                currency:'USD'
            },
            {
                cash:-2000,
                currency:'HKD'
            }
        ],
        receivable:[],
        currency:"USD",
        holdings:[
            {
                exchange:'HK',
                ticker:'00700',
                company:'腾讯',
                quoteTTM:22.0,
                holding:2000,
                costPerShare:21.0,
                currency:'HKD'
            },{
                exchange:'CN',
                ticker:'SH600900',
                company:'长江电力',
                quoteTTM:25.0,
                holding:1000,
                costPerShare:31.0,
                currency:'CNY'
            },{
                exchange:'CN',
                ticker:'SH513010',
                company:'港股科技ETF',
                quoteTTM:25.0,
                holding:1000,
                costPerShare:31.0,
                currency:'CNY'
            },{
                exchange:'HK',
                ticker:'02601',
                company:'中国太保',
                quoteTTM:22.0,
                holding:2000,
                costPerShare:21.0,
                currency:'HKD'
            },
        ]
    }
];

let globalTickersCN=[
    'SH600900',
    'SZ000001',
    '00388',
    '00010',
    '01972',
] ; 

let globalTickersNCN=[
    'BN',
    'NG.L',
    'HICL.L',
    'C38U.SI'
] ; 


function updatePortfolio(jsonPortfolio){
    for(let i=0;i<jsonPortfolio.length;i++){
        let accountHoldings = jsonPortfolio[i].holdings;
        for(let j=0;j<accountHoldings.length;j++){
            if(accountHoldings[j].exchange == 'US'){
                libDataYahoo.fetchQuoteYahoo(accountHoldings[j].ticker) ;
                continue ;
            }
            if(accountHoldings[j].exchange == 'CN'){
                libDataXQ.fetchQuoteXQ(accountHoldings[j].ticker) ;
                continue ;
            }
            if(accountHoldings[j].exchange == 'HK'){
                libDataXQ.fetchQuoteXQ(accountHoldings[j].ticker) ;
                continue ;
            }
        }
    }
}
//libDataXQ.fetchQuotesXQ(globalTickers) ;
//libDataXQ.fetchQuotesXQ(globalTickersCN) ;
//libDataYahoo.fetchQuotesYahoo(globalTickersNCN) ;

//updatePortfolio(jsonPortfolio) ;


let globalCount = 0 ;
let mailOptions = {
    from: 'alexszhang@gmail.com',
    to: 'alexszhang@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

libGMail.sendGoogleMail(mailOptions) ;

cron.schedule('*/10 * * * *', () => {
    console.log('running a task every 5 minute');
    //libDataXQ.fetchQuotesXQ(globalTickersCN) ;
    //libDataYahoo.fetchQuotesYahoo(globalTickersNCN) ;
    mailOptions.text = `#${globalCount} That was easy!`
    libGMail.sendGoogleMail(mailOptions) ;
    globalCount = globalCount + 1 ;

});