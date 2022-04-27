const mongoose = require('mongoose');
const router = require('express').Router();   
const User = mongoose.model('User');
const passport = require('passport');
const utils = require('../lib/utils');

router.get('/protected', passport.authenticate('jwt', { session: true }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
});
let userID;
// captures the values when posted from the register page
router.post("/register", function (req, res) {
    User.register(
      { username: req.body.username },
      req.body.password,
      function (err, user) {
        if (err) {
            return res.status(401).json({ success: false});
        } else {
          passport.authenticate("local")(req, res, function () {
              const tokenObject = utils.issueJWT(user);
              userID = req.user.id;
                
              module.exports ={
                 userID
             };
            res.status(200).json({
              success: true,
              token: tokenObject.token,
              expiresIn: tokenObject.expires,
              userName: req.user.username,
              userID: req.user.id,
            });
          });
        }
      }
    );
  });// end of "register" post request

router.post("/login", (req, res) =>{

    const user = new User({
    username:req.body.username,
    password:req.body.password
    })
  

// this method comes from passport documentation
    req.login(user, (err) => {
    if(err){
        console.log(err);
         return res.status(401).json({ success: false});
    }
            else{
            passport.authenticate("local")(req,res, function(){
                

                userID = req.user.id;
                
                 module.exports ={
                    userID
                };
                
                const tokenObject = utils.issueJWT(user);
                
                res.status(200).json({ 
                success: true, 
                token: tokenObject.token, 
                expiresIn: tokenObject.expires,
                userName : req.user.username,
                userID : req.user.id
                        
            });
        })
    }
})

});


router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. </p>');
});
console.log(userID);
module.exports ={
    userID
};

module.exports = router;
