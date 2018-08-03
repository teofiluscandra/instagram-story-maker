import download from 'image-downloader'
import jimp from 'jimp'
import database from './database/sentence.json';
import fs from 'fs';

export function storyMaker(answer){
    return new Promise((resolve, reject) => {
    // TODO: Log the answer in a database
    //sentence = answer
    console.log(`Wait until process done`)
    let font = jimp.FONT_SANS_64_WHITE  

    //download random natural photo
    const options = {
      url : 'https://picsum.photos/540/960/?random',
      dest : 'download/photo.jpg'
    }

    download.image(options)
      .then((file, image) => {
        jimp.read(file.filename)
          .then((photo) => {
            jimp.loadFont(font).then((font) => {
              photo.brightness(-0.5)
                    .blur(1)
                    .print(font, 20, 20, answer,1)
                    .write('edited/photo-edited.jpg')
            }) 
            database.sentences.push({"username": "", "answer": answer});            
            fs.writeFile("database/sentence.json", JSON.stringify(database), function(){
              resolve("success")
            })           
          })
          .catch((err) => {
            reject(err)
          })
      })
      .catch((err) => {
        reject(err)
      })
    });
}