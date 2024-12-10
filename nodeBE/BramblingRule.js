

function _tRule(jsonFact){
    if(jsonFact.priceTTM>10) return true ;
    return false ;
}



let jsonFact = {
    priceTTM:15
} ;

function _bramblingRule(jsonFact,matchFunc){

    let matchResult = eval(matchFunc)(jsonFact) ;
    console.log(matchResult) ;

}

_bramblingRule(jsonFact,'_tRule') ;
//_bramblingRule(jsonFact,cRule) ;