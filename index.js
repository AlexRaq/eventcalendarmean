const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const auth = require('./routes/auth')(router);
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err){
        console.log('could not connect db' + err)
    } else{
        console.log('connected to db ' + config.db)
    }
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/dist/'));
app.use('/auth', auth);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'))
});
app.listen(8080, () => {
    console.log('Server is up and runnig on port 8080');
});