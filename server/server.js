const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const jwt = require('jsonwebtoken');
const serveStatic = require('serve-static');
const LOCAL_PORT = 4000;

const passport = require('passport')
const session = require('express-session')
var cookieParser = require('cookie-parser');

// For Concurrency
const throng = require('throng')
var WORKERS = process.env.WEB_CONCURRENCY || 1;

throng({
  workers: WORKERS,
  lifetime: Infinity // respawn dead workers
}, start);

function start() {

  function jwtVerify(req,res,next) {
    const bearerHeader = req.headers['authorization']
    const userHeader = req.headers['user']
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      req.token = bearerToken
      if(userHeader) {
        req.user = JSON.parse(userHeader)
      }
      jwt.verify(req.token, process.env.AUTH_KEY, err => {
        if(err)
          res.sendStatus(401).send("Unauthorized access")
        else
          next()
      })
    } else {
      res.sendStatus(401)
    }
  }

  // get environment variabless when not in production
  if (process.env.NODE_ENV !== 'production')
    require('dotenv').config({ path: path.resolve(__dirname, '../variables.env') })

  // ensure auth key is available in environment
  if(!process.env.AUTH_KEY){
    console.log("No auth key")
    process.exit(1);
  }

  const authRouter = require('./Auth/Auth.route')
  const userRouter = require('./User/User.route')
  const courseRouter = require('./Course/Course.route')
  const sectionRouter = require('./Section/Section.route')
  const lectureRouter = require('./Lecture/Lecture.route')
  const lectureSubmissionRouter = require('./LectureSubmission/LectureSubmission.route')
  const pollRouter = require('./PlaybackPoll/PlaybackPoll.route')

  // Connect to the database before starting the application server.
  mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    // Initialize the app.
    var server = app.listen(process.env.PORT || LOCAL_PORT, function () {
      var port = server.address().port;
      console.log("App is now running on port", port);
    });
  });

  app.use(cors({
      origin:['https://www.venue-meetings.com','http://localhost:8080'],
      methods:['GET','POST','DELETE','PUT'],
      credentials: true
  }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Serve front end build on static server
  var distDir = __dirname + "/../dist/";
  app.use(express.static(distDir));

  app.use(cookieParser());
  app.use(session({
    secret: 'stackoverflow_didnt_even_help',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: true
  }))

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/auth', authRouter);
  app.use('/users', jwtVerify, userRouter);
  app.use('/courses', jwtVerify, courseRouter);
  app.use('/sections', jwtVerify, sectionRouter);
  app.use('/lectures', jwtVerify, lectureRouter);
  app.use('/polls', jwtVerify, pollRouter);
  app.use('/lecturesubmissions', jwtVerify, lectureSubmissionRouter);

}