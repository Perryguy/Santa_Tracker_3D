
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function loadImageAndConvertToHeightMap(url, maxHeight) {
    const image = await loadImage(url);
    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(
        0,
        0,
        image.width,
        image.height,
    ).data;
    const heightMap = [];

    for (let i = 0; i < imageData.length; i += 4) {
        const heightValue = (imageData[i] / 255) * maxHeight;
        heightMap.push(heightValue);
    }

    return heightMap;
}

(async () => {
    try {
        const heightMap = await loadImageAndConvertToHeightMap('../../../assets/textures/nomalmap.png', 1);
        fs.writeFileSync('heightMapData.json', JSON.stringify(heightMap));
        console.log('Height map data saved to heightMapData.json');
    } catch (error) {
        console.error('Error converting height map:', error);
    }
})();
