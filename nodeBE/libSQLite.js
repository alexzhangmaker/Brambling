
const SQLDBFileQuote = './Database/globalQuotesDB.db' ;
const SQLDBFilePortfolio = './Database/portfolioDB.db' ;

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');
const duckdb = require('duckdb');


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
        console.log(jsonTransaction) ;
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
        console.log(jsonTransaction) ;

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

async function _exportHolding2JSON(uriFile){
    try {
        let jsonHoldings = await _fetchAllHoldings() ;

        fs.writeFileSync(uriFile, JSON.stringify(jsonHoldings, null, 3), 'utf8');
        console.log(`Data successfully saved to ${uriFile}`);
    } catch (error) {
        console.log('An error has occurred ', error);
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


async function _updateQuotesUsingHolding(){
    let cDate = new Date() ;
    cDatetime = genSerialID(formatTimeStamp(cDate)) ;

    let jsonHoldings = await _fetchAllHoldings() ;
    for(let i=0;i<jsonHoldings.length;i++){
        let jsonTicker = {
            ticker:jsonHoldings[i].ticker,
            company:jsonHoldings[i].company,
            currency:jsonHoldings[i].currency,
            exchange:jsonHoldings[i].exchange,
            quoteTTM:0,
            datetime:cDatetime
        } ;
        await _newUpdateQuoteTTM(jsonTicker) ;
    }
}



async function _updateDIVNASDAQ(jsonDIVNASDAQ){
    let cDate = new Date() ;
    jsonDIVNASDAQ.timestamp = cDate.getTime() ;
    
    sqlite3.verbose();
    try {
        console.log(jsonDIVNASDAQ) ;
        const dbConnection = await createDbConnection(SQLDBFileQuote);

        let cSelectStmt = `SELECT * FROM divTblNASDQ where ticker = ?` ;
        let jsonDIVDB = await dbConnection.get(cSelectStmt, [jsonDIVNASDAQ.ticker]);
        if(jsonDIVDB == undefined){
            let cInsertStmt = `INSERT INTO divTblNASDQ (ticker,dividends,exchange,date,timestamp) VALUES ( ?,?,?,?,?)` ;
            await dbConnection.run(cInsertStmt,[jsonDIVNASDAQ.ticker,JSON.stringify(jsonDIVNASDAQ.dividends),jsonDIVNASDAQ.exchange,jsonDIVNASDAQ.date,jsonDIVNASDAQ.timestamp]) ;
            return ;
        }else{
            if(jsonDIVDB.date == jsonDIVNASDAQ.date)return ;
            let cUpdateStmt = `UPDATE divTblNASDQ SET dividends=?,exchange=?,date=?,timestamp=? where ticker = ? ` ;
            await dbConnection.run(cUpdateStmt,[JSON.stringify(jsonDIVNASDAQ.dividends),jsonDIVNASDAQ.exchange,jsonDIVNASDAQ.date,jsonDIVNASDAQ.timestamp,jsonDIVNASDAQ.ticker]) ;
            return ;
        }
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function _buildTriggersForHolding(){
    const noFetchTickers=['MKL.SMART','BRK.SMART','BN.PR.B','FTS.PR.G','JPM.PRD','SPG.PRJ','US-T25','US-T29'];

    let jsonHoldings = await _fetchAllHoldings() ;
    let tickerAlready=[] ;
    for(let i=0;i<jsonHoldings.length;i++){
        if(noFetchTickers.includes(jsonHoldings[i].ticker))continue ;
        if(tickerAlready.includes(jsonHoldings[i].ticker))continue ;

        tickerAlready.push(jsonHoldings[i].ticker);
        let jsonTrigger={
            ticker:jsonHoldings[i].ticker,
            lowerThan:0/*jsonHoldings[i].costPerShare*0.9*/,
            exchange:jsonHoldings[i].exchange
        } ;
        /*
        let jsonTicker = {
            ticker:jsonHoldings[i].ticker,
            company:jsonHoldings[i].company,
            currency:jsonHoldings[i].currency,
            exchange:jsonHoldings[i].exchange,
            quoteTTM:0,
            datetime:cDatetime
        } ;
        */
        //await _newUpdateQuoteTTM(jsonTicker) ;
        
        await _newTrigger(jsonTrigger) ;
    }
}

async function doWork(){
    //await _commitTransaction(jsonTransaction) ;
    //await _newQuoteTicker(jsonTicker) ;
    //await _fetchAllTickers() ;
   //await _batchClearancePortfolio() ;
    //await _newTrigger(jsonTrigger) ;
    //console.log(await _fetchAllTriggers()) ;
    //await _resumeAllTriggers() ;
    //await _updateQuotesUsingHolding() ;
    //await _buildTriggersForHolding() ;
    

    //await _exportHolding2JSON('./exportJSON/holdings.json') ;
    //testDuckDB() ;
}

/*
"holdingID": 94,
      "ticker": "01093",
      "company": "石药集团",
      "holding": 2000,
      "costPerShare": 5.1,
      "currency": "HKD",
      "exchange": "HK",
      "accountID": "PAZQ"
*/
/*
function testDuckDB(){
    const db = new duckdb.Database(':memory:');
    let sqlLoadJSON = `CREATE TABLE holdings AS SELECT * FROM './exportJSON/holdings.json';'` ;
    db.all(
        sqlLoadJSON,(err, res) => {
          if (err) {
            console.log("Error", err);
          }else{
            console.table(res);
            db.all('SELECT * AS fortytwo', function(err, res) {
                if (err) {
                  console.warn(err);
                  return;
                }
                console.log(res[0].fortytwo)
              });
          }
        }
    );
    //
    
}
*/
//doWork() ;



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

exports.updateDIVNASDAQ                 = _updateDIVNASDAQ ;






