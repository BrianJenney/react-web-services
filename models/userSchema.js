const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    password: {
        type: String,
        trim: true,
        required: 'Password is Required',
        validate: [
            function (input) {
                return input.length >= 6;
            },
            'Password should be longer.',
        ],
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid e-mail address'],
    },
    phoneNumber: {
        type: String,
        trim: true,
        // match: [/\d/g.length === 10, "Please enter a valid phone number"]
    },
    userPic: {
        type: String,
        trim: true,
    },
    firstName: {
        type: String,
        trim: true,
        unique: true,
    },
    lastName: {
        type: String,
        trim: true,
        unique: true,
    },
    userType: {
        type: String,
    },
    userCreated: {
        type: Date,
        default: Date.now,
    },
    buyerWizardCompleted: {
        type: Boolean,
        default: false,
    },
    sellerWizardCompleted: {
        type: Boolean,
        default: false,
    },
    authorizeToRepresent: {
        type: Boolean,
        default: false,
    },
    contractAgreement: {
        type: String,
    },
    ownerType: {
        type: String,
        default: 'owner',
        enum: ['poa', 'trustee', 'conservator', 'n/a', 'owner'],
    },
    ownershipName: {
        type: String,
    },
    previousSellingMethod: {
        type: String,
        default: 'n/a',
        enum: ['n/a', 'realtor', 'attorney', 'independent', 'other'],
    },
    isRelativeAgent: {
        type: Boolean,
        default: false,
    },
    idealTimeframe: {
        type: String,
        default: 'asap',
        enum: ['asap', '3mos', '6mos'],
    },
});

UserSchema.virtual.hasSoldHome = function () {
    return this.previousSellingMethod !== 'n/a';
};

UserSchema.virtual.isOwner = function () {
    return this.ownerType === 'owner';
};

// hash the password
UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
