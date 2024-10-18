const axios = require('axios');
const {EOL} = require('os');

const token = `7689011034:AAF2NciffUqea21jNZQqlFmDcx5DuKVhU6E`;
const chatID = '5759171792' ;

const TELEGRAM_URL = 'https://api.telegram.org/bot' + token + '/sendMessage?chat_id=' + chatID + '&text=';



 async function _notifyTelegram(title, body) {
  axios.get(TELEGRAM_URL + encodeURIComponent(title + EOL + body))
   .then(function (response) {
    // handle success
    console.log(response);
   })
   .catch(function (error) {
    // handle error
    console.log(error);
   })
 }

 _notifyTelegram('Hello World', 'This is my first notification using NodeJS');

 exports.notifyTelegram = _notifyTelegram ;


 //refer https://jair-r.medium.com/building-a-simple-event-notifier-via-telegram-with-nodejs-c4c50495b895