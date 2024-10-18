
const SQLDBFileQuote = './Database/globalQuotesDB.db' ;
const SQLDBFilePortfolio = './Database/portfolioDB.db' ;

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');


function createDbConnection(filename) {
  return open({
      filename,
      driver: sqlite3.Database
  });
}


function formatTimeStamp(d){
    //var d = new Date();
    d = new Date(d.getTime() - 3000000);
    let cMonth = '' ;//d.getMonth()+1 ;
    if(d.getMonth()+1 <=9){
        cMonth = `0${d.getMonth()+1}` ;
    }else{
        cMonth = `${d.getMonth()+1}` ;
    }

    let cDay = '' ;
    if(d.getDate()<=9){
        cDay = `0${d.getDate()}`
    }else{
        cDay = `${d.getDate()}` ;
    }

    //d.getHours()
    let cHour = '' ;
    if(d.getHours()<=9){
        cHour = `0${d.getHours()}`
    }else{
        cHour = `${d.getHours()}` ;
    }
    //getMinutes()
    let cMinute = '' ;
    if(d.getMinutes()<=9){
        cMinute = `0${d.getMinutes()}`
    }else{
        cMinute = `${d.getMinutes()}` ;
    }
    //getSeconds
    let cSecond = '' ;
    if(d.getSeconds()<=9){
        cSecond = `0${d.getSeconds()}`
    }else{
        cSecond = `${d.getSeconds()}` ;
    }
    
    var date_format_str = `${d.getFullYear()}-${cMonth}-${cDay} ${cHour}:${cMinute}:${cSecond}`;
    console.log(date_format_str);
    return date_format_str ;
}


function genSerialID(timeStamp){
    return `${timeStamp}.${Math.floor(Math.random() * 9999)}`
}


async function _newUpdateQuoteTTM(jsonQuote){

    sqlite3.verbose();
    try {
        let cDate = new Date() ;
        jsonQuote.datetime = genSerialID(formatTimeStamp(cDate)) ;

        const dbConnection = await createDbConnection(SQLDBFileQuote);

        let cSelectStmt = `SELECT * FROM globalQuotes where ticker = ?` ;
        const jsonQuoteDB = await dbConnection.get(cSelectStmt, [jsonQuote.ticker]);
        if(jsonQuoteDB != undefined){
            
            let cUpdateStmt = `UPDATE globalQuotes set company=?,quoteTTM=?, datetime=? where ticker = ?` ;
            await dbConnection.run(cUpdateStmt, [jsonQuote.company,jsonQuote.quoteTTM,jsonQuote.datetime,jsonQuote.ticker]) ;
            return jsonQuote ;
        }

        let cStmt = `INSERT INTO globalQuotes (ticker,company,quoteTTM,datetime,currency,exchange) VALUES ( ?,?,?,?,?,?)` ;
        await dbConnection.run(cStmt, [
            jsonQuote.ticker,
            jsonQuote.company,
            jsonQuote.quoteTTM,
            jsonQuote.datetime,
            jsonQuote.currency,
            jsonQuote.exchange
        ]);
        return jsonQuote;
    } catch (error) {
        console.error(error);
        throw error;
    }
}



async function _newQuoteTicker(jsonTicker){
    sqlite3.verbose();
    try {
        let cDate = new Date() ;
        cDatetime = genSerialID(formatTimeStamp(cDate)) ;

        const dbConnection = await createDbConnection(SQLDBFileQuote);

        let cSelectStmt = `SELECT * FROM globalQuotes where ticker = ?` ;
        const jsonQuoteDB = await dbConnection.get(cSelectStmt, [jsonTicker.ticker]);
        if(jsonQuoteDB != undefined)return ;

        let cStmt = `INSERT INTO globalQuotes (ticker,company,quoteTTM,datetime,currency,exchange) VALUES ( ?,?,?,?,?,?)` ;
        await dbConnection.run(cStmt, [
            jsonTicker.ticker,
            jsonTicker.company,
            0,
            cDatetime,
            jsonTicker.currency,
            jsonTicker.exchange
        ]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function _fetchAllTickers(){
    sqlite3.verbose();
    try {

        const dbConnection = await createDbConnection(SQLDBFileQuote);

        let cSelectStmt = `SELECT * FROM globalQuotes` ;
        const jsonTickers = await dbConnection.all(cSelectStmt, []);
        console.log(jsonTickers)
        return jsonTickers;

    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function _fetchQuoteTTM(ticker){
    sqlite3.verbose();
    try {
        const dbConnection = await createDbConnection(SQLDBFileQuote);
        let cSelectStmt = `SELECT * FROM globalQuotes where ticker = ?` ;
        const jsonQuoteDB = await dbConnection.get(cSelectStmt, [ticker]);
        if(jsonQuoteDB != undefined)return jsonQuoteDB ;
        return {
            ticker:ticker,
            company:'TDB',
            quoteTTM:0,
            datetime:0
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}




async function _newTrigger(jsonTrigger){
    sqlite3.verbose();
    try {
        const dbConnection = await createDbConnection(SQLDBFileQuote);

        let cStmt = `INSERT INTO globalTriggers (ticker,lowerThan,exchange) VALUES ( ?,?,?)` ;
        await dbConnection.run(cStmt, [
            jsonTrigger.ticker,
            jsonTrigger.lowerThan,
            jsonTrigger.exchange
        ]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function _fetchAllTriggers(){
    sqlite3.verbose();
    try {
        const dbConnection = await createDbConnection(SQLDBFileQuote);

        let cSelectStmt = `SELECT * FROM globalTriggers where status = "ready"` ;
        let jsonTriggers = await dbConnection.all(cSelectStmt, []);
        return jsonTriggers;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function _resumeAllTriggers(){
    sqlite3.verbose();
    try {
        const dbConnection = await createDbConnection(SQLDBFileQuote);
        let cUpdateStmt = `UPDATE globalTriggers SET actionResult="pending" WHERE status="ready"`;
        await dbConnection.run(cUpdateStmt, []);
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function _updateTrigger(jsonTrigger){
    sqlite3.verbose();
    try {
        const dbConnection = await createDbConnection(SQLDBFileQuote);

        let cSelectStmt = `SELECT * FROM globalTriggers where status = "ready" AND triggerID = ?` ;
        let jsonTriggerDB = await dbConnection.get(cSelectStmt, [jsonTrigger.triggerID]);
        if(jsonTriggerDB == undefined) return ;

        let cUpdateStmt = `UPDATE globalTriggers SET lowerThan=?,status=?,action=?,actionResult=? WHERE triggerID=?`;
        await dbConnection.run(cUpdateStmt, [
            jsonTrigger.lowerThan,
            jsonTrigger.status,
            jsonTrigger.action,
            jsonTrigger.actionResult,
            jsonTrigger.triggerID
        ]) ;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function _newTransaction(jsonTransaction){
    sqlite3.verbose();
    try {
        let cDate = new Date() ;
        jsonTransaction.transactionID = genSerialID(formatTimeStamp(cDate)) ;
        jsonTransaction.cDateTime = cDate.getTime() ;

        const dbConnection = await createDbConnection(SQLDBFilePortfolio);

        let cStmt = `INSERT INTO transactionTbl (transactionID,accountID,ticker,operation,price,amount,cDateTime,currency,exchange,company) VALUES ( ?,?,?,?,?,?,?,?,?,?)` ;
        await dbConnection.run(cStmt, [
            jsonTransaction.transactionID,
            jsonTransaction.accountID,
            jsonTransaction.ticker,
            jsonTransaction.operation,
            jsonTransaction.price,
            jsonTransaction.amount,
            jsonTransaction.cDateTime,
            jsonTransaction.currency,
            jsonTransaction.exchange,
            jsonTransaction.company

        ]);
    } catch (error) {
        console.error(error);
        throw error;
    }
}



async function _newUpdateHolding(jsonTransaction){

    sqlite3.verbose();
    try {
        const dbConnection = await createDbConnection(SQLDBFilePortfolio);

        let cSelectStmt = `SELECT * FROM holdingsTbl where ticker = ? AND accountID = ?` ;
        let jsonHolding = await dbConnection.get(cSelectStmt, [jsonTransaction.ticker,jsonTransaction.accountID]);
        if(jsonHolding != undefined){

            if(jsonTransaction.operation == 'buy'){
                let costTotal = jsonHolding.holding*jsonHolding.costPerShare + jsonTransaction.price*jsonTransaction.amount ;
                jsonHolding.holding = jsonHolding.holding + jsonTransaction.amount ;
                jsonHolding.costPerShare = costTotal/jsonHolding.holding ;
            }else{
                jsonHolding.holding = jsonHolding.holding - jsonTransaction.amount ;
            }
            
            let cUpdateStmt = `UPDATE holdingsTbl set holding=?, costPerShare=? where holdingID = ? ` ;
            await dbConnection.run(cUpdateStmt, [jsonHolding.holding,jsonHolding.costPerShare,jsonHolding.holdingID]) ;
            return jsonHolding ;
        }

        if(jsonTransaction.operation == 'buy'){
            let cStmt = `INSERT INTO holdingsTbl (ticker,company,holding,costPerShare,currency,exchange,accountID) 
                            VALUES ( ?,?,?,?,?,?,?)` ;
            await dbConnection.run(cStmt, [
                jsonTransaction.ticker,
                jsonTransaction.company,
                jsonTransaction.amount,
                jsonTransaction.price,
                jsonTransaction.currency,
                jsonTransaction.exchange,
                jsonTransaction.accountID
            ]);
            return {};
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}




async function _fetchAllHoldings(){
    sqlite3.verbose();
    try {
        const dbConnection = await createDbConnection(SQLDBFilePortfolio);

        let cSelectStmt = `SELECT * FROM holdingsTbl` ;
        let jsonHoldings = await dbConnection.all(cSelectStmt, []);
        return jsonHoldings;
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}



async function _newUpdateAccountBS(jsonAccountBS){

    sqlite3.verbose();
    try {
        const dbConnection = await createDbConnection(SQLDBFilePortfolio);

        let cSelectStmt = `SELECT * FROM accountBalanceSheet where accountID = ?` ;
        let jsonAccountBSDB = await dbConnection.get(cSelectStmt, [jsonAccountBS.accountID]);
        if(jsonAccountBSDB != undefined){
            
            let cUpdateStmt = `UPDATE accountBalanceSheet set 
                                cashUSD=?,cashCNY=?,cashHKD=?,cashGBP=?, 
                                valueTTMUSD=?,valueTTMCNY=?,valueTTMHKD=?,valueTTMGBP=?
                                where accountID = ? ` ;
            await dbConnection.run(cUpdateStmt, [
                jsonAccountBS.cashUSD,jsonAccountBS.cashCNY,jsonAccountBS.cashHKD,jsonAccountBS.cashGBP,
                jsonAccountBS.valueTTMUSD,jsonAccountBS.valueTTMCNY,jsonAccountBS.valueTTMHKD,jsonAccountBS.valueTTMGBP,
                jsonAccountBS.accountID
            ]) ;
            return;
        }

            let cStmt = `INSERT INTO accountBalanceSheet (accountID,
                            cashUSD,cashCNY,cashHKD,cashGBP,valueTTMUSD,valueTTMCNY,valueTTMHKD,valueTTMGBP) 
                            VALUES ( ?,?,?,?,?,?,?,?,?)` ;
            await dbConnection.run(cStmt, [
                jsonAccountBS.accountID,
                jsonAccountBS.cashUSD,jsonAccountBS.cashCNY,jsonAccountBS.cashHKD,jsonAccountBS.cashGBP,
                jsonAccountBS.valueTTMUSD,jsonAccountBS.valueTTMCNY,jsonAccountBS.valueTTMHKD,jsonAccountBS.valueTTMGBP
            ]);
            return;
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function _commitTransaction(jsonTransaction){
    await _newTransaction(jsonTransaction) ;
    await _newUpdateHolding(jsonTransaction) ;
}


async function _batchClearancePortfolio(){
    sqlite3.verbose();
    try {
        const dbConnection = await createDbConnection(SQLDBFilePortfolio);

        let cSelectAccountStmt = `SELECT * FROM accountBalanceSheet` ;
        let jsonAccounts = await dbConnection.all(cSelectAccountStmt, []);
        for(let i=0;i<jsonAccounts.length;i++){
            jsonAccounts[i].valueTTMCNY = 0 ;
            jsonAccounts[i].valueTTMUSD = 0 ;
            jsonAccounts[i].valueTTMHKD = 0 ;
            jsonAccounts[i].valueTTMGBP = 0 ;

            let cSelectHoldingStmt = `SELECT * FROM holdingsTbl where accountID=?` ;
            let jsonHoldings = await dbConnection.all(cSelectHoldingStmt, [jsonAccounts[i].accountID]);
            for(let j=0;j<jsonHoldings.length;j++){
                let cAttribute = `valueTTM${jsonHoldings[j].currency}` ;
                let jsonQuoteTTM = await _fetchQuoteTTM(jsonHoldings[j].ticker) ;
                jsonAccounts[i][cAttribute] = jsonAccounts[i][cAttribute] + jsonHoldings[j].holding*jsonQuoteTTM.quoteTTM ;
            }

            let cUpdateStmt = `UPDATE accountBalanceSheet set 
                                valueTTMUSD=?,valueTTMCNY=?,valueTTMHKD=?,valueTTMGBP=?
                                where accountID = ? ` ;
            await dbConnection.run(cUpdateStmt, [
                jsonAccounts[i].valueTTMUSD,jsonAccounts[i].valueTTMCNY,jsonAccounts[i].valueTTMHKD,jsonAccounts[i].valueTTMGBP,
                jsonAccounts[i].accountID
            ]) ;
        }
        console.log(jsonAccounts) ;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function doWork(){
    
    let jsonTransaction={
        transactionID:'d',
        accountID:'GJZQ',
        ticker:'00014',
        company:'希慎兴业',
        operation:'buy',
        price:12.80,
        amount:1000,
        cDateTime:10,
        currency:'HKD',
        exchange:'HK'
    } ;
    //await _commitTransaction(jsonTransaction) ;

    let jsonTicker={
        ticker:jsonTransaction.ticker,
        company:jsonTransaction.company,
        currency:jsonTransaction.currency,
        exchange:jsonTransaction.exchange
    } ;

    //await _newQuoteTicker(jsonTicker) ;
    //await _fetchAllTickers() ;
    

    
    
   //await _batchClearancePortfolio() ;
   
    let jsonTrigger={
        ticker:'01038',
        lowerThan:45.00,
        exchange:'HK'
    } ;
    //await _newTrigger(jsonTrigger) ;

    //console.log(await _fetchAllTriggers()) ;

    await _resumeAllTriggers() ;

}



async function initData(){
    let accountData=[
        /*['IB7075','CNH','CNH',11.23,10,'USD','US'],
        ['IB7075','PAX','PAX',11.34,100,'USD','US'],
        ['IB7075','BAM','BAM',39.66,200,'USD','US'],
        ['IB7075','APO','APO',99.88,100,'USD','US'],
        ['IB7075','MKL','MKL',1490.63,10,'USD','US'],
        ['IB7075','BN','BN',31.01,1000,'USD','US'],
        ['IB3979','PFF','PFF',33.30,1,'USD','US'],
        ['IB3979','EWA','EWA',26.49,10,'USD','US'],
        ['IB3979','EWU','EWU',36.65,10,'USD','US'],
        //['IB3979','C38U','APO',99.88,100,'USD','US'],
        //['IB3979','MKL','MKL',1490.63,10,'USD','US'],
        ['IB3979','O','Realty Income',57.94,200,'USD','US'],
        //['IB3979','US-T','BN',31.01,1000,'USD','US'],
        ['IB3979','SCHD','SCHD',26.09,600,'USD','US'],

        ['IB1279','BEPC','BEPC',29.88,10,'USD','US'],
        ['IB1279','BCE','BCE',33.12,10,'USD','US'],
        ['IB1279','NGG','NGG',66.02,5,'USD','US'],
        ['IB1279','ENB','ENB',56.58,10,'USD','US'],
        ['IB1279','BIPC','BIPC',41.07,10,'USD','US'],
        ['IB1279','FTS','FTS',43.24,10,'USD','US'],
        ['IB1279','00014','希慎兴业',11.23,1000,'HKD','HK'],
        ['IB1279','01972','太古地产',12.71,1000,'HKD','HK'],
        ['IB1279','00010','恒隆集团',11.49,10000,'HKD','HK'],
        ['IB1279','00778','置富产业信托',4.67,30000,'HKD','HK'],
        ['IB1279','00823','领展房地产信托',39.17,5000,'HKD','HK'],

        ['IB6325','SEQI.L','SEQI',0.8510,100,'GBP','LSE'],
        ['IB6325','3IN.L','3IN',3.450,100,'GBP','LSE'],
        ['IB6325','CTY.L','CTY',3.9747,100,'GBP','LSE'],
        ['IB6325','GCP.L','GCP',0.8820,1000,'GBP','LSE'],
        ['IB6325','UKW.L','UKW',1.4536,4000,'GBP','LSE'],
        ['IB6325','TRIG.L','TRIG',1.104,6000,'GBP','LSE'],
        ['IB6325','HICL.L','HICL',1.3976,5000,'GBP','LSE'],
        ['IB6325','INPP.L','INPP',1.3361,6000,'GBP','LSE']
        */
        /*
        ['GJZQ','00006','电能实业',49.917,500,'HKD','HK'],
        ['GJZQ','00010','恒隆集团',10.127,4000,'HKD','HK'],
        ['GJZQ','00014','希慎兴业',13.221,1000,'HKD','HK'],
        ['GJZQ','00135','昆仑能源',7.753,2000,'HKD','HK'],
        ['GJZQ','00177','江苏宁沪高速',7.665,2000,'HKD','HK'],
        ['GJZQ','00371','北控水务集团',2.314,8000,'HKD','HK'],
        ['GJZQ','00384','中国燃气',6.832,2000,'HKD','HK'],
        ['GJZQ','00683','嘉里建设',16.567,1000,'HKD','HK'],
        ['GJZQ','00728','中国电信',4.773,4000,'HKD','HK'],
        ['GJZQ','00836','华润电力',19.812,2000,'HKD','HK'],
        ['GJZQ','00941','中国移动',71.569,500,'HKD','HK'],
        ['GJZQ','00966','中国太平',16.57,52400,'HKD','HK'],
        ['GJZQ','01038','长江基建集团',50.479,500,'HKD','HK'],
        ['GJZQ','01193','华润燃气',30.977,200,'HKD','HK'],
        ['GJZQ','02688','新奥能源',52.129,100,'HKD','HK'],
        ['GJZQ','09633','农夫山泉',30.396,400,'HKD','HK']
        */
        /*
        ['PAZQ','02318','中国平安',38.73,5000,'HKD','HK'],
        ['HTZQ','SH600009','上海机场',42.261,300,'CNY','CN'],
        ['HTZQ','SH600887','伊利股份',22.96,300,'CNY','CN'],
        ['HTZQ','SH600007','中国国贸',23.51,100,'CNY','CN'],
        ['GJZQ','00966','中国太平',15.878,46600,'HKD','HK'],
        ['GJZQ','02318','中国平安',40.481,10000,'HKD','HK'],
        ['ZSZQ','00966','中国太平',13.626,25000,'HKD','HK'],
        ['ZSZQ','02318','中国平安',42.122,4000,'HKD','HK']
        */
    ] ;

    for(let i=0;i<accountData.length;i++){
        let jsonTransaction={
            transactionID:'d',
            accountID:accountData[i][0],
            ticker:accountData[i][1],
            company:accountData[i][2],
            operation:'buy',
            price:accountData[i][3],
            amount:accountData[i][4],
            cDateTime:10,
            currency:accountData[i][5],
            exchange:accountData[i][6]
        } ; 
        console.log(jsonTransaction) ;
        await _commitTransaction(jsonTransaction) ;
        let jsonTicker={
            ticker:jsonTransaction.ticker,
            company:jsonTransaction.company,
            currency:jsonTransaction.currency,
            exchange:jsonTransaction.exchange
        } ;
    
        await _newQuoteTicker(jsonTicker) ;
    }
}

//initData() ;
doWork() ;



exports.newUpdateQuoteTTM                = _newUpdateQuoteTTM ;
exports.newQuoteTicker                   = _newQuoteTicker ;
exports.fetchQuoteTTM                    = _fetchQuoteTTM ;
exports.fetchAllTickers                  = _fetchAllTickers ;

exports.newTrigger                       = _newTrigger ;
exports.fetchAllTriggers                 = _fetchAllTriggers ;
exports.updateTrigger                    = _updateTrigger ;

exports.fetchAllHoldings                 = _fetchAllHoldings ;
exports.newTransaction                   = _newTransaction ;
exports.newUpdateHolding                 = _newUpdateHolding ;
exports.newUpdateAccountBS               = _newUpdateAccountBS ;
exports.commitTransaction                = _commitTransaction ;
exports.batchClearancePortfolio          = _batchClearancePortfolio ;







