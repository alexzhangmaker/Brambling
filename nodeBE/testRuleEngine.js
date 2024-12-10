const { Engine } = require('json-rules-engine') ;

/**
 * Setup a new engine
 */
let engine = new Engine() ;

// define a rule for detecting the player has exceeded foul limits.  Foul out any player who:
// (has committed 5 fouls AND game is 40 minutes) OR (has committed 6 fouls AND game is 48 minutes)
let rule_1={
    conditions: {
        any: [
            {
                all: [
                    {
                        fact: 'gameDuration',
                        operator: 'equal',
                        value: 40
                    }, {
                        fact: 'personalFoulCount',
                        operator: 'greaterThanInclusive',
                        value: 5
                    }
                ]
            }, {
                all: [
                    {
                        fact: 'gameDuration',
                        operator: 'equal',
                        value: 48
                    }, {
                        fact: 'personalFoulCount',
                        operator: 'greaterThanInclusive',
                        value: 6
                    }
                ]
            }
        ]
    },
    event: {  // define the event to fire when the conditions evaluate truthy
        type: 'alerting',
        params: {
            message: 'price change  a lot!'
        }
    }
} ;

//if price < prevBuy*0.9 OR price > prevBuy*1.1 then alert price change

let facts_2 = {
    priceTTM: 10.0,
    prevBuy: 12
} ;

let rule_2={
    conditions: {
        any: [
            {
                all: [
                    {
                        fact: 'priceTTM',
                        operator: 'equal',
                        value: 40
                    }
                ]
            }, {
                all: [
                    {
                        fact: 'gameDuration',
                        operator: 'equal',
                        value: 48
                    }, {
                        fact: 'personalFoulCount',
                        operator: 'greaterThanInclusive',
                        value: 6
                    }
                ]
            }
        ]
    },
    event: {  // define the event to fire when the conditions evaluate truthy
        type: 'fouledOut',
        params: {
            message: 'Player has fouled out!'
        }
    }
} ;


engine.addRule(rule_1) ;

/**
 * Define facts the engine will use to evaluate the conditions above.
 * Facts may also be loaded asynchronously at runtime; see the advanced example below
 */
let facts = {
  personalFoulCount: 6,
  gameDuration: 40
}

// Run the engine to evaluate
engine.run(facts).then(({ events }) => {
    events.map(event => console.log(event.params.message))
}) ;

/*
 * Output:
 *
 * Player has fouled out!
 */