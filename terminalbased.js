import readline from 'readline'
import {storyMaker} from './storymaker'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Apa kalimat untuk instagram? ', (answer) => {
    storyMaker(answer).then(()=>{
        return console.log('Hahaa, cool! Check in folder edited')
    })
    .catch((err) => {
        return console.log('Oops! Something when wrong.')
    })
    rl.close()
});