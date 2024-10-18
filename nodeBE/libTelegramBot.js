const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = `7689011034:AAF2NciffUqea21jNZQqlFmDcx5DuKVhU6E`;
const chatID = '5759171792' ;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  console.log(msg) ;
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log(msg) ;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});



//refer: https://jair-r.medium.com/building-a-simple-event-notifier-via-telegram-with-nodejs-c4c50495b895
//refer: https://medium.com/javarevisited/sending-a-message-to-a-telegram-channel-the-easy-way-eb0a0b32968

//https://api.telegram.org/bot{7689011034:AAF2NciffUqea21jNZQqlFmDcx5DuKVhU6E}/sendMessage?chat_id={5759171792}&text={hello,notification}