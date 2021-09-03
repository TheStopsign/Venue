const express = require('express');
const authRoutes = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const axios = require('axios')

let User = require('../User/User.model');

const alnums = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

async function generateSID() {
  let venueSID = ""
  for (let i = 1000; i > 0; --i) {
    venueSID += alnums[Math.floor(Math.random() * alnums.length)];
  }
  let user = await User.findOne({connect_sid: venueSID})
  if (!user) {
    return venueSID
  } else {
    return null
  }
}

//Passport setup START
const passport = require('passport')
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(new (require('passport-cas').Strategy)({
  version: 'CAS3.0',
  ssoBaseURL: 'https://cas.auth.rpi.edu/cas',
  serverBaseURL: (process.env.NODE_ENV === "production"?'https://www.venue-meetings.com':'http://localhost:4000')
}, function(profile, done) {
  var login = profile.user.toLowerCase();
  User.findOne({user_id: login}, function (err, user) {
    if (err) {
      return done(err);
    } else if (!user) {
      let creating_user = new User({
        first_name: "New",
        last_name: "User",
        user_id: login,
        email: login + "@rpi.edu"
      })
      creating_user.save()
      .then(() => {
        console.log("<SUCCESS> Creating first-time RPI account")
        return done(null,creating_user)
      })
      .catch(() => {
        console.log("<ERROR> Adding poll:",poll)
        return done(null, false, {message: 'Unknown user'});
      });
    } else {
      user.attributes = profile.attributes;
      return done(null, user);
    }
  });
}));
//Passport setup END

authRoutes.route('/signup').post(function (req, res) {
  let user = new User(req.body.user)
  user.save()
    .then(() => {
      const token = jwt.sign({ user }, process.env.AUTH_KEY)
      res.status(200).json({token, user});
    })
    .catch(() => {
      res.status(400).send("unable to save user to database");
    });
});

authRoutes.route('/login').post(function (req, res) {
  let user = req.body.user
  if(user){
    User.findOne({ user_id: user.user_id }, function(error, current_user) {
      if(error || !current_user){
        console.log("Error unable to find user: " + user)
        res.status(404).json({ error: 'Invalid Login Credentials. Please try again' })
      }
      else {
        bcrypt.compare(user.password, current_user.password, function(err, result) {
          if(result == true){
            const token = jwt.sign({ current_user }, process.env.AUTH_KEY)
            console.log("<SUCCESS> Login for user with User ID:",current_user.user_id)
            res.json({token, current_user})
          } else {
            res.status(404).json({ error: 'Invalid Login Credentials. Please try again' })
          }
        });
      }
    })
  }else{
    res.status(400).json({ error: 'Invalid login. Please try again.' })
  }
});

authRoutes.route('/check_for_temp_user/:user_id/:temp_password').get(function (req, res) {
  let user_id = req.params.user_id
  let temp_password = req.params.temp_password
  console.log("user_id",user_id,"temp_password",temp_password)
  if(user_id && temp_password){
    User.findOne({ user_id: user_id, temp_password: temp_password}, function(error, temp_user) {
      if(error || !temp_user){
        console.log("Error unable to find temp user with user_id", user_id, "and temp password", temp_password)
        res.status(404).json({ error: 'Invalid Login Credentials. Please try again' })
      } else {
        console.log("<Success>: Found temp user")
        res.json(temp_user)
      }
    })
  }else{
    res.status(400).json({ error: 'Invalid login. Please try again.' })
  }
});

authRoutes.route('/set_permanent_pasword').post(function (req, res) {
  let user = req.body.user
  if(user){
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
      if(err || hash == null) {
        console.log("<ERROR> Hashing password for user:",user)
        res.json(err)
      } else {
        User.findByIdAndUpdate(user._id, {
          password: hash,
          temp_password: null
        },
        (error, updated_user) => {
          if(error || updated_user == null) {
            console.log("<ERROR> Setting password for user:",user)
            res.json(err)
          } else {
            console.log("<Success> Setting password for user:",updated_user)
            const token = jwt.sign({ updated_user }, process.env.AUTH_KEY)
            let current_user = updated_user
            res.json({token, current_user})
          }
        })
      }
    });
  }else{
    res.status(400).json({ error: 'Invalid user. Please try again.' })
  }
});

authRoutes.get("/loginCAS", (req, res, next) => {
  passport.authenticate('cas', function (err, user, info) {
    if (err) {
      return next(err);
    } else if (!user) {
      req.session.messages = info.message;
      if(process.env.NODE_ENV === "production") {
        return res.redirect('https://www.venue-meetings.com');
      } else {
        return res.redirect('http://localhost:8080');
      }
    } else {
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        } else {
          req.session.messages = '';
          let venueSID = generateSID()
          Promise.resolve(venueSID).then(resolvedSID => {
            if(resolvedSID != null) {
              User.findOneAndUpdate({user_id: user.user_id},{connect_sid: resolvedSID},function(err,user) {
                if(err || user == null) {
                  return next(err);
                } else {
                  res.header("Set-Cookie","connect_sid="+resolvedSID)
                  if(process.env.NODE_ENV === "production") {
                    return res.redirect('https://www.venue-meetings.com/#/redirectCASLogin');
                  } else {
                    return res.redirect('http://localhost:8080/#/redirectCASLogin');
                  }
                }
              })
            } else {
              return res.redirect('http://localhost:8080');
            }
          })
        }
      });
    }
  })(req, res, next);
});

authRoutes.get("/loginStatus", function(req, res) {
  User.findOne({connect_sid: req.cookies["connect_sid"]}, function (err, current_user) {
    if(err || current_user == null) {
      res.json(null)
    } else {
      const token = jwt.sign({current_user}, process.env.AUTH_KEY)
      res.json({token, current_user})
    }
  });
});

authRoutes.get("/logoutCAS", function(req, res) {
  res.header("Set-Cookie","connect_sid="+";expires=Thu, 01 Jan 1970 00:00:00 GMT")
  res.send()
});

authRoutes.get('/get_webex_src/:auth_code/:web_rec_id',function(req,res) {
  let auth_code = req.params.auth_code
  let web_rec_id = req.params.web_rec_id
  axios.post('https://webexapis.com/v1/access_token?grant_type=authorization_code&client_id='+process.env.WEBEX_CLIENT_ID+'&client_secret='+process.env.WEBEX_CLIENT_SECRET+'&code='+auth_code+'&redirect_uri='+(process.env.NODE_ENV === 'production'?"https://www.venue-meetings.com":"http://localhost:8080")
  ,{},{
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(resp => {
    axios.get('https://rensselaer.webex.com/webappng/api/v1/recordings/'+web_rec_id+'/stream',{
      headers: {
        "Authorization": "Bearer " + resp.data.access_token
      }
    }).then(resp2 => {
      res.json(resp2.data.downloadRecordingInfo.downloadInfo.mp4URL)
    }).catch(err => {
      res.json({})
    })
  }).catch(err => {
    res.json({})
  })
})

module.exports = authRoutes;