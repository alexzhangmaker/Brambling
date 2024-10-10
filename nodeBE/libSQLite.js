
//const researchNoteDB = require('better-sqlite3')('./public/SQLiteDB/researchNoteDB.db', { verbose: console.log });
const SQLDBFile = './Database/globalQuotesDB.db' ;
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

        const dbConnection = await createDbConnection(SQLDBFile);

        let cSelectStmt = `SELECT * FROM globalQuotes where ticker = ?` ;
        const jsonQuoteDB = await dbConnection.get(cSelectStmt, [jsonQuote.ticker]);
        if(jsonQuoteDB != undefined){
            
            let cUpdateStmt = `UPDATE globalQuotes set quoteTTM=?, datetime=? where ticker = ?` ;
            await dbConnection.run(cUpdateStmt, [jsonQuote.quoteTTM,jsonQuote.datetime,jsonQuote.ticker]) ;
            return jsonQuote ;
        }

        let cStmt = `INSERT INTO globalQuotes (ticker,company,quoteTTM,datetime) VALUES ( ?,?,?,?)` ;
        await dbConnection.run(cStmt, [
            jsonQuote.ticker,
            jsonQuote.company,
            jsonQuote.quoteTTM,
            jsonQuote.datetime
        ]);
        return jsonQuote;
    } catch (error) {
        console.error(error);
        throw error;
    }
}



async function doWork(){
    
    let jsonQuote={
        ticker:'hk00001',
        company:'demo',
        quoteTTM:121.02,
        datetime:'2024-10-05 14:31:21 001'
    } ;
    await _newUpdateQuoteTTM(jsonQuote) ;
    
}

//doWork() ;

/*
async function _fetchSRCMemoIDs(){
    sqlite3.verbose();
    try {  
        const dbConnection = await createDbConnection(noteDBFile);
        let cStmt = `SELECT srcID FROM srcCardTbl where status!="archive" order by reviewDateTime` ;
        srcIDs = await dbConnection.all(cStmt, []);
        console.log(srcIDs);
        return srcIDs ;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
  
    
async function _fetchSRCMemo(srcID){
    sqlite3.verbose();
    try {  
        const dbConnection = await createDbConnection(noteDBFile);
        let cStmt = `SELECT * FROM srcCardTbl where srcID = ?` ;
        const jsonMemoDB = await dbConnection.get(cStmt, [srcID]);
        if(jsonMemoDB != undefined){
            
            console.log(jsonMemoDB);
            return jsonMemoDB ;
        }
        return undefined ;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
  


async function _updateSRCMemo(jsonSRCMemo){
    sqlite3.verbose();
    try {  
        const dbConnection = await createDbConnection(noteDBFile);
    
        let cStmt = `SELECT srcID FROM srcCardTbl where srcID = ?` ;
        let jsonDBNotePre = await dbConnection.get(cStmt, [jsonSRCMemo.srcID]);
        if(jsonDBNotePre == undefined){
            console.log(`srcMemo: ${jsonSRCMemo.srcID} not found `) ;
        }else{
            let cUpdateStmt = `UPDATE srcCardTbl set srcCue=?, srcContent=?, reviewDate=?, reviewDateTime=?, SM2Interval=?, SM2Repetition=?, SM2EFactor=?,contentSrc=?, renderID=? where srcID = ?` ;
            await dbConnection.run(cUpdateStmt, [
                jsonSRCMemo.srcCue,
                jsonSRCMemo.srcContent,
                jsonSRCMemo.reviewDate,
                jsonSRCMemo.reviewDateTime,
                jsonSRCMemo.SM2Interval,
                jsonSRCMemo.SM2Repetition,
                jsonSRCMemo.SM2EFactor,
                jsonSRCMemo.contentSrc,
                jsonSRCMemo.renderID,
                jsonSRCMemo.srcID
            ]);
        }
    }catch (error) {
        console.error(error);
        throw error;
    }
}

async function _updateSRCSM2(jsonSRCMemo){
    sqlite3.verbose();
    try {  
        const dbConnection = await createDbConnection(noteDBFile);
    
        let cStmt = `SELECT srcID FROM srcCardTbl where srcID = ?` ;
        let jsonDBNotePre = await dbConnection.get(cStmt, [jsonSRCMemo.srcID]);
        if(jsonDBNotePre == undefined){
            console.log(`srcMemo: ${jsonSRCMemo.srcID} not found `) ;
        }else{

            let cUpdateStmt = `UPDATE srcCardTbl set reviewDate=?, reviewDateTime=?, SM2Interval=?, SM2Repetition=?, SM2EFactor=? where srcID = ?` ;
            await dbConnection.run(cUpdateStmt, [
                jsonSRCMemo.reviewDate,
                jsonSRCMemo.reviewDateTime,
                jsonSRCMemo.SM2Interval,
                jsonSRCMemo.SM2Repetition,
                jsonSRCMemo.SM2EFactor,
                jsonSRCMemo.srcID
            ]);
        }
    }catch (error) {
        console.error(error);
        throw error;
    }
}

async function _archieveSRCMemo(srcID){
    sqlite3.verbose();
    try {  
        const dbConnection = await createDbConnection(noteDBFile);
        let cStmt = `UPDATE srcCardTbl set status="archive" where srcID = ?` ;
        await dbConnection.run(cStmt, [srcID]);
    
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function _newSRCGroup(jsonSRCDeck){

    sqlite3.verbose();
    try {
        jsonSRCDeck.srcDeckID = signpostTools.generateDynamicID() ;
        const dbConnection = await createDbConnection(noteDBFile);
        let cStmt = `INSERT INTO srcDeckTbl (
            srcDeckID,
            srcDeckTitle,
            srcCardIDs,
            srcDeckClass,
            createOn,
            reviewDate,
            reviewDateTime,
            status,
            SM2Interval,
            SM2Repetition,
            SM2EFactor) VALUES ( ?,?,?,?,?,?,?,?,?,?,?)` ;

        await dbConnection.run(cStmt, [
            jsonSRCDeck.srcDeckID,
            jsonSRCDeck.srcDeckTitle,
            JSON.stringify(jsonSRCDeck.srcCardIDs),
            jsonSRCDeck.srcDeckClass,
            jsonSRCDeck.createOn,
            jsonSRCDeck.reviewDate,
            jsonSRCDeck.reviewDateTime,
            jsonSRCDeck.status,
            jsonSRCDeck.SM2Interval,
            jsonSRCDeck.SM2Repetition,
            jsonSRCDeck.SM2EFactor]);
        return jsonSRCDeck.srcDeckID ;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function _fetchSRCGroupIDs(){
    sqlite3.verbose();
    try {  
        const dbConnection = await createDbConnection(noteDBFile);
        let cStmt = `SELECT srcDeckID FROM srcDeckTbl where status!="archive" ORDER by srcDeckTitle` ;
        let srcDeckIDs = await dbConnection.all(cStmt, []);
        let deckIDs = [] ;
        for(let i=0;i<srcDeckIDs.length;i++)deckIDs.push(srcDeckIDs[i].srcDeckID) ;
        console.log(deckIDs);
        return deckIDs ;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
  
    
async function _fetchSRCGroup(srcDeckID){
    console.log(`_fetchSRCGroup: ${srcDeckID}`) ;
    sqlite3.verbose();
    try {  
        const dbConnection = await createDbConnection(noteDBFile);
        let cStmt = `SELECT * FROM srcDeckTbl where srcDeckID = ?` ;
        console.log(`SELECT * FROM srcDeckTbl where srcDeckID = ${srcDeckID}`) ;
        let jsonSRCDeck = await dbConnection.get(cStmt, [srcDeckID]);
        if(jsonSRCDeck != undefined){
            jsonSRCDeck.srcCardIDs = JSON.parse(jsonSRCDeck.srcCardIDs) ;
            console.log(jsonSRCDeck);
            return jsonSRCDeck ;
        }
        console.log(`_fetchSRCGroup ${srcDeckID} not found`) ;
        return undefined ;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
  

async function _updateSRCGroup(jsonSRCDeck){
    sqlite3.verbose();
    try {  
        const dbConnection = await createDbConnection(noteDBFile);
    
        let cStmt = `SELECT srcDeckID FROM srcDeckTbl where srcDeckID = ?` ;
        let jsonDBNotePre = await dbConnection.get(cStmt, [jsonSRCDeck.srcDeckID]);
        if(jsonDBNotePre == undefined){
            console.log(`_updateSRCGroup: ${jsonSRCDeck.srcDeckID} not found `) ;
        }else{
            let cUpdateStmt = `UPDATE srcDeckTbl set 
                    srcDeckTitle=?, 
                    srcCardIDs=? where srcDeckID = ?` ;

            await dbConnection.run(cUpdateStmt, [jsonSRCDeck.srcDeckTitle,
                JSON.stringify(jsonSRCDeck.srcCardIDs),
                jsonSRCDeck.srcDeckID
            ]);
        }
    }catch (error) {
        console.error(error);
        throw error;
    }
}


async function _updateSRCDeckSM2(jsonSRCDeck){
    sqlite3.verbose();
    try {  
        const dbConnection = await createDbConnection(noteDBFile);
    
        let cStmt = `SELECT srcDeckID FROM srcDeckTbl where srcDeckID = ?` ;
        let jsonDBNotePre = await dbConnection.get(cStmt, [jsonSRCDeck.srcDeckID]);
        if(jsonDBNotePre == undefined){
            console.log(`_updateSRCDeckSM2: ${jsonSRCDeck.srcDeckID} not found `) ;
        }else{
            let cUpdateStmt = `UPDATE srcDeckTbl set 
                                reviewDate=?, 
                                reviewDateTime=?,
                                SM2Interval=?,
                                SM2Repetition=?,
                                SM2EFactor=? where srcDeckID = ?` ;

            await dbConnection.run(cUpdateStmt, [
                jsonSRCDeck.reviewDate,
                jsonSRCDeck.reviewDateTime,
                jsonSRCDeck.SM2Interval,
                jsonSRCDeck.SM2Repetition,
                jsonSRCDeck.SM2EFactor,
                jsonSRCDeck.srcDeckID
            ]);
        }
    }catch (error) {
        console.error(error);
        throw error;
    }
}


async function _addSRC2SRCGroup(srcID,srcDeckID){
    sqlite3.verbose();
    try {  
        const dbConnection = await createDbConnection(noteDBFile);
    
        let cStmt = `SELECT srcCardIDs FROM srcDeckTbl where srcDeckID = ?` ;
        let jsonCardIDs = await dbConnection.get(cStmt, [srcDeckID]);
        if(jsonCardIDs == undefined){
            console.log(`_updateSRCGroup: ${srcDeckID} not found `) ;
        }else{
            let cardIDs = JSON.parse(jsonCardIDs.srcCardIDs) ;
            cardIDs = JSON.parse(cardIDs) ;
            cardIDs.push(srcID);
            let cUpdateStmt = `UPDATE srcDeckTbl set srcCardIDs=? where srcDeckID = ?` ;
            await dbConnection.run(cUpdateStmt, [JSON.stringify(JSON.stringify(cardIDs)),srcDeckID]);
        }
    }catch (error) {
        console.error(error);
        throw error;
    }
}

async function _archieveSRCGroup(srcDeckID){
    sqlite3.verbose();
    try {  
        const dbConnection = await createDbConnection(noteDBFile);
        let cStmt = `UPDATE srcDeckTbl set status="archive" where srcDeckID = ?` ;
        await dbConnection.run(cStmt, [srcDeckID]);
    
    } catch (error) {
        console.error(error);
        throw error;
    }
}



async function _batchBuildDailyDecks(){
    sqlite3.verbose();
    try {

        let cDate = new Date() ;
        let groupDateID = `vocab_Daily_${cDate.getFullYear()}_${cDate.getMonth()+1}_${cDate.getDate()}` ;
        const dbConnection = await createDbConnection(noteDBFile);

        const todayStart = new Date(new Date().setHours(0, 0, 0, 0)) ;
        const todayEnd = new Date(new Date().setHours(23, 59, 59, 999)) ;
        let sSelectStmtMemoID = `select srcID from srcCardTbl where reviewDateTime <= ? AND reviewDateTime >= ? AND renderID="renderThaiVocabulary"` ;
        let jsonSrcMemoIDs = await dbConnection.all(sSelectStmtMemoID, [todayEnd.getTime(),todayStart.getTime()]);

        let cSelectStmt = `SELECT * FROM srcDeckTbl where srcDeckID = ?` ;
        let jsonSRCGroupDB = await dbConnection.get(cSelectStmt, [groupDateID]);
        if(jsonSRCGroupDB != undefined){
            let jsonSrcIDs = JSON.parse(JSON.parse(jsonSRCGroupDB.srcCardIDs)) ;
            for(let i=0;i<jsonSrcMemoIDs.length;i++){
                if(jsonSrcIDs.includes(jsonSrcMemoIDs[i].srcID)==false)jsonSrcIDs.push(jsonSrcMemoIDs[i].srcID) ;
            }

            jsonSRCGroupDB.srcCardIDs = JSON.stringify(JSON.stringify(jsonSrcIDs)) ;
            let cUpdateStmt = `UPDATE srcDeckTbl set srcCardIDs=? where srcDeckID = ?` ;
            await dbConnection.run(cUpdateStmt, [
                jsonSRCGroupDB.srcCardIDs,
                jsonSRCGroupDB.srcDeckID,
            ]);
            //return jsonSRCGroupDB.srcGroupID ;
        }else{
            let srcIDs = [] ;
            for(let i=0;i<jsonSrcMemoIDs.length;i++){
                srcIDs.push(jsonSrcMemoIDs[i].srcID) ;
            }
            let jsonSRCDeck={
                srcDeckID:groupDateID,
                srcDeckTitle:`vocab_Daily-${cDate.getFullYear()}.${cDate.getMonth()+1}.${cDate.getDate()}`,
                srcCardIDs:JSON.stringify(JSON.stringify(srcIDs)),
                srcDeckClass:'SYSTEM.vocab',
                createOn:cDate.toLocaleTimeString(),
                reviewDate:cDate.toLocaleTimeString(),
                reviewDateTime:cDate.getTime(),
                status:'ready',
                SM2Interval:0,
                SM2Repetition:0,
                SM2EFactor:2.6
            } ;


            let cStmt = `INSERT INTO srcDeckTbl (
                srcDeckID,
                srcDeckTitle,
                srcCardIDs,
                srcDeckClass,
                createOn,
                reviewDate,
                reviewDateTime,
                status,
                SM2Interval,
                SM2Repetition,
                SM2EFactor) VALUES ( ?,?,?,?,?,?,?,?,?,?,?)` ;
    
            await dbConnection.run(cStmt, [
                jsonSRCDeck.srcDeckID,
                jsonSRCDeck.srcDeckTitle,
                jsonSRCDeck.srcCardIDs,
                jsonSRCDeck.srcDeckClass,
                jsonSRCDeck.createOn,
                jsonSRCDeck.reviewDate,
                jsonSRCDeck.reviewDateTime,
                jsonSRCDeck.status,
                jsonSRCDeck.SM2Interval,
                jsonSRCDeck.SM2Repetition,
                jsonSRCDeck.SM2EFactor]);
            //return jsonSRCDeck.srcGroupID ;
        }


        groupDateID = `dict_Daily_${cDate.getFullYear()}_${cDate.getMonth()+1}_${cDate.getDate()}` ;
        sSelectStmtMemoID = `select srcID from srcCardTbl where reviewDateTime <= ? AND reviewDateTime >= ? AND renderID="renderThaiDict"` ;
        jsonSrcMemoIDs=[] ;
        jsonSrcMemoIDs = await dbConnection.all(sSelectStmtMemoID, [todayEnd.getTime(),todayStart.getTime()]);

        cSelectStmt = `SELECT * FROM srcDeckTbl where srcDeckID = ?` ;
        jsonSRCGroupDB = await dbConnection.get(cSelectStmt, [groupDateID]);
        if(jsonSRCGroupDB != undefined){
            let jsonSrcIDs = JSON.parse(JSON.parse(jsonSRCGroupDB.srcCardIDs)) ;
            for(let i=0;i<jsonSrcMemoIDs.length;i++){
                if(jsonSrcIDs.includes(jsonSrcMemoIDs[i].srcID)==false)jsonSrcIDs.push(jsonSrcMemoIDs[i].srcID) ;
            }
            jsonSRCGroupDB.srcCardIDs = JSON.stringify(JSON.stringify(jsonSrcIDs)) ;

            let cUpdateStmt = `UPDATE srcDeckTbl set srcCardIDs=? where srcDeckID = ?` ;
            await dbConnection.run(cUpdateStmt, [
                jsonSRCGroupDB.srcCardIDs,
                jsonSRCGroupDB.srcDeckID,
            ]);
            //return jsonSRCGroupDB.srcGroupID ;
        }else{

            let srcIDs = [] ;
            for(let i=0;i<jsonSrcMemoIDs.length;i++){
                srcIDs.push(jsonSrcMemoIDs[i].srcID) ;
            }
            let jsonSRCDeck={
                srcDeckID:groupDateID,
                srcDeckTitle:`dict Daily-${cDate.getFullYear()}.${cDate.getMonth()+1}.${cDate.getDate()}`,
                srcCardIDs:JSON.stringify(JSON.stringify(srcIDs)),
                srcDeckClass:'SYSTEM.dict',
                createOn:cDate.toLocaleTimeString(),
                reviewDate:cDate.toLocaleTimeString(),
                reviewDateTime:cDate.getTime(),
                status:'ready',
                SM2Interval:0,
                SM2Repetition:0,
                SM2EFactor:2.6
            } ;

            let cStmt = `INSERT INTO srcDeckTbl (
                srcDeckID,
                srcDeckTitle,
                srcCardIDs,
                srcDeckClass,
                createOn,
                reviewDate,
                reviewDateTime,
                status,
                SM2Interval,
                SM2Repetition,
                SM2EFactor) VALUES ( ?,?,?,?,?,?,?,?,?,?,?)` ;
    
            await dbConnection.run(cStmt, [
                jsonSRCDeck.srcDeckID,
                jsonSRCDeck.srcDeckTitle,
                jsonSRCDeck.srcCardIDs,
                jsonSRCDeck.srcDeckClass,
                jsonSRCDeck.createOn,
                jsonSRCDeck.reviewDate,
                jsonSRCDeck.reviewDateTime,
                jsonSRCDeck.status,
                jsonSRCDeck.SM2Interval,
                jsonSRCDeck.SM2Repetition,
                jsonSRCDeck.SM2EFactor]);
            //return jsonSRCDeck.srcGroupID ;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function _batchRebuildDailyDecks(){
    sqlite3.verbose();
    try {
        let cDate = new Date() ;
        let groupDateID = `Daily_${cDate.getFullYear()}_${cDate.getMonth()+1}_${cDate.getDate()}` ;
        const dbConnection = await createDbConnection(noteDBFile);

        const todayStart = new Date(new Date().setHours(0, 0, 0, 0)) ;
        const todayEnd = new Date(new Date().setHours(23, 59, 59, 999)) ;
        let sSelectStmtMemoID = `select srcID from srcCardTbl where reviewDateTime <= ? AND reviewDateTime >= ?` ;
        let jsonSrcMemoIDs = await dbConnection.all(sSelectStmtMemoID, [todayEnd.getTime(),todayStart.getTime()]);
        console.log(jsonSrcMemoIDs) ;


        let cSelectStmt = `SELECT * FROM srcDeckTbl where srcDeckID = ?` ;
        let jsonSRCGroupDB = await dbConnection.get(cSelectStmt, [groupDateID]);
        if(jsonSRCGroupDB != undefined){
            let deleteStmt = `DELETE FROM srcDeckTbl where srcDeckID = ?`
            await dbConnection.run(deleteStmt, [jsonSRCGroupDB.srcDeckID]);
        }
        

        let srcIDs = [] ;
        for(let i=0;i<jsonSrcMemoIDs.length;i++){
            srcIDs.push(jsonSrcMemoIDs[i].srcID) ;
        }
        let jsonSRCDeck={
            srcDeckID:groupDateID,
            srcDeckTitle:`daily review-${cDate.getFullYear()}.${cDate.getMonth()+1}.${cDate.getDate()}`,
            srcCardIDs:JSON.stringify(JSON.stringify(srcIDs)),
            srcDeckClass:'SYSTEM',
            createOn:cDate.toLocaleDateString(),
            reviewDate:'2024-10-10',
            reviewDateTime:3123213,
            status:'ready',
            SM2Interval:0,
            SM2Repetition:0,
            SM2EFactor:2.6
        } ;


        let cStmt = `INSERT INTO srcDeckTbl (
            srcDeckID,
            srcDeckTitle,
            srcCardIDs,
            srcDeckClass,
            createOn,
            reviewDate,
            reviewDateTime,
            status,
            SM2Interval,
            SM2Repetition,
            SM2EFactor) VALUES ( ?,?,?,?,?,?,?,?,?,?,?)` ;

        await dbConnection.run(cStmt, [
            jsonSRCDeck.srcDeckID,
            jsonSRCDeck.srcDeckTitle,
            jsonSRCDeck.srcCardIDs,
            jsonSRCDeck.srcDeckClass,
            jsonSRCDeck.createOn,
            jsonSRCDeck.reviewDate,
            jsonSRCDeck.reviewDateTime,
            jsonSRCDeck.status,
            jsonSRCDeck.SM2Interval,
            jsonSRCDeck.SM2Repetition,
            jsonSRCDeck.SM2EFactor]);
        return jsonSRCDeck.srcGroupID ;
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function _filterDecks4Today(){
    sqlite3.verbose();
    try { 
        const dbConnection = await createDbConnection(noteDBFile);
        const todayStart = new Date(new Date().setHours(0, 0, 0, 0)) ;
        const todayEnd = new Date(new Date().setHours(23, 59, 59, 999)) ;
        //let filterStmtDecks = `select srcDeckID from srcDeckTbl where reviewDateTime <= ? AND reviewDateTime >= ?` ;
        let filterStmtDecks = `select srcDeckID from srcDeckTbl where reviewDateTime <= ? AND status!="archive"` ;

        console.log(`select srcDeckID from srcDeckTbl where reviewDateTime <= ${todayEnd.getTime()} AND reviewDateTime >= ${todayStart.getTime()} ORDER by srcDeckTitle`);
        //let deckIDs = await dbConnection.all(filterStmtDecks, [todayEnd.getTime(),todayStart.getTime()]);
        let deckIDs = await dbConnection.all(filterStmtDecks, [todayEnd.getTime()]);
        console.log(deckIDs) ;
        let cDeckIDs = [] ;
        for(let i=0;i<deckIDs.length;i++){
            cDeckIDs.push(deckIDs[i].srcDeckID) ;
        }
        console.log(cDeckIDs) ;
        return cDeckIDs ;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function _newSRCRender(jsonSRCRender){

    sqlite3.verbose();
    try {
        jsonSRCRender.renderID = signpostTools.generateDynamicID() ;
        jsonSRCRender.status = 'ready' ;
        const dbConnection = await createDbConnection(noteDBFile);
        let cStmt = `INSERT INTO srcRenderTbl (
            renderID,
            cueScript,
            cueStyle,
            contentScript,
            contentStyle,
            version,
            status) VALUES ( ?,?,?,?,?,?,?)` ;

        await dbConnection.run(cStmt, [
            jsonSRCRender.renderID,
            jsonSRCRender.cueScript,
            jsonSRCRender.cueStyle,
            jsonSRCRender.contentScript,
            jsonSRCRender.contentStyle,
            jsonSRCRender.version,
            jsonSRCRender.status]);
        return jsonSRCRender.renderID ;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function _fetchSRCRednerIDs(){
    sqlite3.verbose();
    try {  
        const dbConnection = await createDbConnection(noteDBFile);
        let cStmt = `SELECT renderID FROM srcRenderTbl where status!="archive"` ;
        let srcRenderIDs = await dbConnection.all(cStmt, []);
        console.log(srcRenderIDs);
        return srcRenderIDs ;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function _fetchSRCRender(renderID){
    console.log(`_fetchSRCRender: ${renderID}`) ;
    sqlite3.verbose();
    try {  
        const dbConnection = await createDbConnection(noteDBFile);
        let cStmt = `SELECT * FROM srcRenderTbl where renderID = ?` ;
        let jsonSRCRender = await dbConnection.get(cStmt, [renderID]);
        if(jsonSRCRender != undefined){
            console.log(jsonSRCRender);
            return jsonSRCRender ;
        }
        console.log(`_fetchSRCRender ${renderID} not found`) ;
        return undefined ;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
  

async function _updateSRCRender(jsonSRCRender){
    sqlite3.verbose();
    try {  
        const dbConnection = await createDbConnection(noteDBFile);
    
        let cStmt = `SELECT renderID FROM srcRenderTbl where renderID = ?` ;
        let jsonDBNotePre = await dbConnection.get(cStmt, [jsonSRCRender.renderID]);
        if(jsonDBNotePre == undefined){
            console.log(`_updateSRCRender: ${jsonSRCRender.renderID} not found `) ;
        }else{
            let cUpdateStmt = `UPDATE srcRenderTbl set 
                    cueScript = ?,
                    cueStyle = ?,
                    contentScript = ?,
                    contentStyle = ?,
                    version=? where renderID = ?` ;

            await dbConnection.run(cUpdateStmt, [
                jsonSRCRender.cueScript,
                jsonSRCRender.cueStyle,
                jsonSRCRender.contentScript,
                jsonSRCRender.contentStyle,
                jsonSRCRender.version,
                jsonSRCDeck.renderID
            ]);
        }
    }catch (error) {
        console.error(error);
        throw error;
    }
}


async function _archieveSRCRender(renderID){
    sqlite3.verbose();
    try {  
        const dbConnection = await createDbConnection(noteDBFile);
        let cStmt = `UPDATE srcRenderTbl set status="archive" where renderID = ?` ;
        await dbConnection.run(cStmt, [renderID]);
    
    } catch (error) {
        console.error(error);
        throw error;
    }
}






exports.newSRCCard                  = _newSRCMemo ;
exports.fetchSRCCardIDs             = _fetchSRCMemoIDs ;
exports.fetchSRCCard                = _fetchSRCMemo ;
exports.updateSRCCard               = _updateSRCMemo ;
exports.updateSRCSM2                = _updateSRCSM2 ;
exports.archieveSRCCard             = _archieveSRCMemo ;


exports.newSRCDeck                  = _newSRCGroup ;
exports.fetchSRCDeckIDs             = _fetchSRCGroupIDs ;
exports.fetchSRCDeck                = _fetchSRCGroup ;
exports.updateSRCDeck               = _updateSRCGroup ;
exports.updateSRCDeckSM2            = _updateSRCDeckSM2 ;
exports.addSRC2SRCGroup             = _addSRC2SRCGroup ;
exports.archieveSRCDeck             = _archieveSRCGroup ;
//exports.createOrUpdateDeck4Today   = _createOrUpdateGroup4Today ;
exports.batchBuildDailyDecks        = _batchBuildDailyDecks ;
exports.batchRebuildDailyDecks      = _batchRebuildDailyDecks ;
exports.filterDecks4Today           = _filterDecks4Today ;





exports.newSRCRender                = _newSRCRender ;
exports.fetchSRCRednerIDs           = _fetchSRCRednerIDs ;
exports.fetchSRCRender              = _fetchSRCRender ;
exports.updateSRCRender             = _updateSRCRender ;
exports.archieveSRCRender           = _archieveSRCRender ;

*/

exports.newUpdateQuoteTTM                  = _newUpdateQuoteTTM ;

