const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function constructImage(memberName) {

    const img = loadImage('./img.png').then(
        image => {
            const width = image.width;
            const height = image.height;

            const canvas = createCanvas(width, height);
            const context = canvas.getContext('2d');

            context.font = 'bold 80px Candara';
            context.textAlign = 'left';
            context.textBaseline = 'top';

            context.drawImage(image, 0, 0, width, height);

            const text = memberName;
            const textWidth = context.measureText(text).width;
            context.fillStyle = 'tomato';
            context.fillText(text, parseInt((width - textWidth) / 2), 170);

            const buffer = canvas.toBuffer('image/png');
            try {
                fs.writeFileSync('./test.png', buffer);
                console.log("Saved");
                return 0;
            } catch (e) {
                return -1;
            }
        }
    );

}

module.exports = { constructImage };


// const textWidth = context.measureText(text).width
// context.fillRect(width - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120)
// context.fillStyle = '#fff'
// context.fillText(text, 600, 170)

// context.fillStyle = '#fff'
// context.font = 'bold 30pt Menlo'
// context.fillText('flaviocopes.com', 600, 530)

// loadImage('./logo.png').then(image => {
//     context.drawImage(image, 340, 515, 70, 70)
//     const buffer = canvas.toBuffer('image/png')
//     fs.writeFileSync('./test.png', buffer)
// })