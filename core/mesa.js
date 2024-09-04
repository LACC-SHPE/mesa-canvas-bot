const QRCode = require('qrcode')
const util = require('../utils/Util')

const generateQRCode = async (url) => {
    const path = `./cache/${util.generateRandomFileName('png')}`


    try {
        await QRCode.toFile(path, url, {
            errorCorrectionLevel: 'H',
            width: 1000,
            scale: 10
        });
        console.log('QR code saved!');
        return path;
    } catch (err) {
        throw new Error('Failed to generate QR code: ' + err.message);
    }
}

module.exports = {
    generateQRCode
}