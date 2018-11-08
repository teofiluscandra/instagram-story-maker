require('dotenv').load();

//telegram library
import Telegraf from 'telegraf'
import Extra from 'telegraf/extra'
import Markup from 'telegraf/markup'
import {storyMaker} from './storymaker'

// http server
import http from 'http'
import path from 'path'
import fs from 'fs'

var config = {
    root: 'edited',
    index: 'index.html',
    port: process.env.PORT || 3000
};

// make nodejs http server
const requestHandler = (request, response) => {
    var file = path.normalize(config.root + request.url);
    file = (file == config.root + '/') ? file + config.index : file;

    function showError(error) {
        console.log(error);
        response.writeHead(500);
        response.end('Internal Server Error');
    }

    fs.exists(file, function (exists) {
        if (exists) {
            fs.stat(file, function (error, stat) {
                var readStream;

                if (error) {
                    return showError(error);
                }

                if (stat.isDirectory()) {
                    response.writeHead(403);
                    response.end('Forbidden');
                }
                else {
                    readStream = fs.createReadStream(file);
                    readStream.on('error', showError);
                    response.writeHead(200);
                    readStream.pipe(response);
                }
            });
        }
        else {
            response.writeHead(404);
            response.end('Not found');
        }
    });
}

const server = http.createServer(requestHandler)

server.listen(config.port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${config.port}`)
})


//button inline when start bot
const keyboard = Markup.inlineKeyboard([
  Markup.callbackButton('❤Click Here to Make Story', 'make')
])

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.telegram.sendCopy(ctx.from.id, ctx.message, Extra.markup(keyboard)))
bot.help((ctx) => ctx.reply('Ketik /make , ketik kalimat dan gunakan'))
bot.action('make', (ctx) => {
    ctx.reply('Apa kalimat untuk instagram?')
    bot.on('message', (ctx) => {
        storyMaker(ctx.message.text).then((result)=>{ 
            return ctx.replyWithPhoto({
                url: `${process.env.BASE_URL}/edited/photo-${result.data.timestamp}.jpg`,
                caption : "Cool! Hahahaha",
                reply_to_message_id: ctx.message.message_id
            })
        })
        .catch((err) => {
            return ctx.reply('Oops! Something when wrong.')
        })
    })
})

// Handle sticker or photo update
bot.on(['sticker', 'photo'], (ctx) => {
    return ctx.reply('Cool! Hahahaha')
})

bot.startPolling()

