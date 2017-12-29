const User = require('../models/user');

module.exports = (router) => {
    router.post('/register', (req, res) => {
        // req.body.email;
        // req.body.username;
        // req.body.password
        if(!req.body.email || !req.body.password || !req.body.username){
            res.json({message: 'All lines are required'});
        } else {
            let user = new User({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: req.body.password

            });
            user.save((err) => {
                if(err){
                    if(err.code === 11000){
                        res.json({message: 'Username or e-mail alreaddy exists'})
                    } else{
                        if(err.errors){
                            if(err.errors.email){
                                res.json({success: false, message: err.errors.email.message});
                            } else{
                                if(err.errors.username){
                                    res.json({success: false, message: err.errors.username.message});
                                }else{
                                    if(err.errors.password){
                                        res.json({success: false, message: err.errors.password.message});
                                    } else {
                                        res.json({success: false, message: err})
                                    }
                                }
                            }
                        }else{
                            res.json({message: 'Could not save user. Error: ', err})
                        }
                    }
                } else{
                    res.json({message: 'Account Registered!'})
                }
            })
        }

    });

    return router
}