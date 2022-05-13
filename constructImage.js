const fs = require('fs');
const { registerFont, createCanvas, loadImage } = require('canvas');

async function constructImage(memberName) {

    const img = loadImage('./img.png').then(image => {
        const avatarURL = 'https://cdn.discordapp.com/avatars/457915538396413952/2422a262907f41bc4aca804eaaa5ab05.png?size=256'
        loadImage(avatarURL).then(circleImage => {
            // Banner Image
            const width = image.width;
            const height = image.height;

            const canvas = createCanvas(width, height);
            const context = canvas.getContext('2d');

            // Draw Banner Image
            context.drawImage(image, 0, 0, width, height);

            // Draw the circle of avatar
            context.beginPath();
            const centerX = parseInt(width / 2);
            const centerY = parseInt(height / 2);
            const radius = 95;
            const startAngle = 0;
            const endAngle = Math.PI * 2;
            context.arc(centerX, centerY, radius, startAngle, endAngle);
            context.closePath();

            //Stroke of the circle
            context.strokeStyle = "green";
            context.lineWidth = 10;
            context.stroke();

            // Draw the avatar image into the circle
            const circleImageWidth = circleImage.width;
            const circleImageHeight = circleImage.height;
            console.log(circleImageWidth, circleImageHeight);
            context.drawImage(circleImage, centerX - 95, centerY - 95, circleImageWidth * .75, circleImageHeight * .75);
            const output = canvas.toBuffer();

            // Styling of the text under the avatar circle
            context.font = 'bold 60px "Fira Code"';
            context.textAlign = 'left';
            context.textBaseline = 'top';
            const text = memberName;
            console.log(text);
            const textWidth = context.measureText(text).width;
            context.fillStyle = 'tomato';
            context.fillText(text, parseInt((width - textWidth) / 2), 320);

            context.fillStyle = 'red';
            context.font = 'bold 50px Candara';
            const greetingText = 'Have a great journey!'
            const greetingWidth = context.measureText(greetingText).width;
            context.fillText(greetingText, parseInt((width - greetingWidth) / 2), 380);

            const buffer = canvas.toBuffer('image/png');
            try {
                fs.writeFileSync('./test.png', buffer);
                console.log("Saved");
                return 0;
            } catch (e) {
                return -1;
            }
        }
        )

    });
}

constructImage('Tamim〆')


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