const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload')

const mongoose = require('mongoose');
const config = require('./DB.js');
const PORT = 4000;

const userRouter = require('./User/User.route')
const courseRouter = require('./Course/Course.route')
const sectionRouter = require('./Section/Section.route')
const eventRouter = require('./Event/Event.route')
const submissionRouter = require('./Submission/Submission.route')
const lectureRouter = require('./Lecture/Lecture.route')

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => { console.log('Database is connected') },
  err => { console.log('Can not connect to the database' + err) }
);

// app.use(fileupload())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/users', userRouter);
app.use('/courses', courseRouter);
app.use('/sections', sectionRouter);
app.use('/events', eventRouter);
app.use('/submissions', submissionRouter);
app.use('/lectures', lectureRouter);

app.listen(PORT, function () {
  console.log('Server is running on Port:', PORT);
});