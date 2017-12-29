const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email) => {
    if(!email){
        return false;
    } else {
        if(email.length < 5){
            return false
        } else{
            return true
        }
    }
};

let validEmailChecker = (email) => {
    if(!email){
        return false;
    } else{
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
};

let usernameLengthChecker = (username) => {
    if(!username){
        return false;
    } else{
        if(username.length < 3 || username.length > 20){
            return false
        } else{
            return true
        }
    }
};

let validUsernameChecker = (username) => {
    if(!username){
        return false;
    } else{
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};

let passwordLengthChecker = (password) => {
    if(!password){
        return false;
    } else{
        if(password.length < 8){
            return false
        } else{
            return true
        }
    }
};


const emailValidators = [
    {
        validator: emailLengthChecker,
        message: 'E-mail must be at least 5 character'
    },
    {
        validator: validEmailChecker,
        message: 'Must be a valid e-mail'
    }
];

const usernameValidators = [
    {
        validator: usernameLengthChecker,
        message: 'Username must be at least 3 character but no more 20'
    },
    {
        validator: validUsernameChecker,
        message: 'Username must not have any special characters'
    }
];

const passwordValidators = [
    {
        validator: passwordLengthChecker,
        message: 'Passwordd must be at least 8 character'
    }
];

const userSchema = new Schema({
    email: {type: String, required: true, unique: true, lowercase: true, validate: emailValidators},
    username: {type: String, required: true, unique: true, lowercase: true, validate: usernameValidators},
    password: {type: String, required: true, validate: passwordValidators}
});

userSchema.pre('save', function(next) {
    if(!this.isModified('password'))
    return next();
    bcrypt.hash(this.password, null, null, (err, hash) => {
        if(err) return next(err);
        this.password = hash;
        next()
    })
});

userSchema.methods.comparePassword = (password) => {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
