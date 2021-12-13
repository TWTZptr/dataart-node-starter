const { TWILIO } = require('../config');
const twilioClient = require('twilio')(TWILIO.SID, TWILIO.TOKEN);

const sendSMS = async (phoneNumber, text) => {
  return twilioClient.messages.create({
    body: text,
    from: TWILIO.NUMBER,
    to: phoneNumber,
  });
};

module.exports = {
  sendSMS,
};
