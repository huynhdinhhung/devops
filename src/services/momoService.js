const axios = require('axios');
const crypto = require('crypto');

exports.createPayment = async (orderInfo, amount, requestId, orderId) => {
    const {
        MOMO_PARTNER_CODE,
        MOMO_ACCESS_KEY,
        MOMO_SECRET_KEY
    } = process.env;

    const partnerCode = MOMO_PARTNER_CODE;
    const accessKey = MOMO_ACCESS_KEY;
    const secretKey = MOMO_SECRET_KEY;
    const redirectUrl = `http://localhost:${process.env.PORT}/payment/callback`;
    const ipnUrl = `http://localhost:${process.env.PORT}/payment/ipn`;
    const requestType = "captureWallet";
    const extraData = ""; // optional

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    
    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = {
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang: 'vi'
    };

    try {
        const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody);
        return response.data;
    } catch (error) {
        console.error('Momo Payment Error:', error.response ? error.response.data : error.message);
        throw error;
    }
};
