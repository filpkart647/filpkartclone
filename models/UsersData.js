const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userDataSchema = new Schema({
    businessName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pinCode: {
        type: String,
        required: true
    },
    whatsappNumber: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    gstNumber: {
        type: String
    },
    yearOfEstablishment: {
        type: Number
    },
    rating: {
        type: Number
    },
    sourcesLink: {
        type: String
    },
    sourcesPlatform: {
        type: String
    },
    employeeId: {
        type: String,
        required: true,
      },
      employeeName: {
        type: String,
        required: true
      },
      employeeMobileNumber: {
        type: String,
        required: true
      },
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = UserData;
