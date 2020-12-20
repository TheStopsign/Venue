const express = require('express');
const lectureSubmissionRoutes = express.Router();

let LectureSubmission = require('../LectureSubmission/LectureSubmission.model');
let Lecture = require('../Lecture/Lecture.model');
let Section = require('../Section/Section.model');
let Course = require('../Course/Course.model');
let User = require('../User/User.model');
let Attachment = require('../Attachments/Attachment.model')

attachmentRoutes.route('/add').post(function (req, res) {
  let attachment = new Attachment(req.body.attachment);
  lecture_submission.save()
    .then(() => {
      console.log("<SUCCESS> Adding lecture submission:",lecture_submission)
      res.status(200).json(lecture_submission);
    })
    .catch(() => {
      console.log("<ERROR> Adding lecture submission:",lecture_submission)
      res.status(400).send("unable to save poll to database");
    });
});


lectureSubmissionRoutes.route('/').get(function (req, res) {
  LectureSubmission.find(function (err, lectureSubmissions) {
    if (err || lectureSubmissions == null) {
      console.log("<ERROR> Getting all lecture submissions")
      res.json(err);
    } else {
      console.log("<SUCCESS> Getting all lecture submissions")
      res.json(lectureSubmissions);
    }
  });
});

lectureSubmissionRoutes.route('/:id').get(function (req, res) {
  LectureSubmission.findById(req.params.id,function (err, lectureSubmission) {
    if (err || lectureSubmission == null) {
      console.log("<ERROR> Getting lecture submission with ID:",req.params.id)
      res.json(err);
    } else {
      console.log("<SUCCESS> Getting lecture submission with ID:",req.params.id)
      res.json(lectureSubmission);
    }
  });
});

lectureSubmissionRoutes.route('/update').post(function (req, res) {
  let updated = {}
  if(req.body.lectureSubmission && req.body.lectureSubmission._id) {
    updated._id = req.body.lectureSubmission._id
    if(req.body.lectureSubmission.live_progress) {
      updated.live_progress = req.body.lectureSubmission.live_progress
    }
    if(req.body.lectureSubmission.live_percent) {
      updated.live_percent = req.body.lectureSubmission.live_percent
    }
    if(req.body.lectureSubmission.video_progress) {
      updated.video_progress = req.body.lectureSubmission.video_progress
    }
    if(req.body.lectureSubmission.video_percent) {
      updated.video_percent = req.body.lectureSubmission.video_percent
    }
    if(req.body.lectureSubmission.live_submission_time) {
      updated.live_submission_time = new Date()
    }
    if(req.body.lectureSubmission.playback_submission_time) {
      updated.playback_submission_time = new Date()
    }
    if(req.body.lectureSubmission.codes) {
      updated.codes = req.body.lectureSubmission.codes
    }
    if(req.body.lectureSubmission.student_poll_answers) {
      updated.student_poll_answers = req.body.lectureSubmission.student_poll_answers
    }
    Lecture.findById(req.body.lectureSubmission.lecture,function(err,lecture) {
      if(err || !lecture) {
        console.log("<ERROR> Getting lecture with ID:",req.body.lectureSubmission.lecture)
        res.json(err)
      } else {
        LectureSubmission.findById(updated._id,
          function (err, oldSubmission) {
            if (err || oldSubmission == null) {
              console.log("<ERROR> Getting lecture submission with ID:",updated._id)
              res.json(err);
            } else {
              let valid = true
              if(updated.codes || updated.live_progress || updated.live_percent) {
                if(updated.codes && updated.live_progress && updated.live_percent) {
                  if(!( updated.codes.every(code => lecture.checkins.map(check => check.code).includes(code))
                  && updated.live_progress == updated.codes.length
                  && updated.live_percent == updated.live_progress / lecture.checkins.length)) {
                    console.log(!( updated.codes.every(code => lecture.checkins.map(check => check.code).includes(code))
                    && updated.live_progress == updated.codes.length
                    && updated.live_percent == updated.live_progress / lecture.checkins.length))
                    valid = false
                  }
                } else if(!updated.codes) {
                  valid = false
                }
              }
              if(updated.video_percent || updated.video_progress) {
                if(updated.video_percent && updated.video_progress) {
                  if(oldSubmission.video_progress) {
                    if(updated.video_progress - 5 > oldSubmission.video_progress || updated.video_progress > lecture.video_length) {
                      valid = false
                    } else if(Math.abs(updated.video_progress - lecture.video_length) < 1) {
                      updated.video_percent = 1
                    } else {
                      updated.video_percent = updated.video_progress / lecture.video_length
                    }
                  } else if(updated.video_progress != 5) {
                    valid = false
                  }
                } else {
                  valid = false
                }
              }
              if(!valid) {
                console.log("<ERROR> Updating lecture submission by ID:",updated._id)
                res.json({
                  rewindTo: oldSubmission.video_progress
                })
              } else {
                LectureSubmission.findByIdAndUpdate(updated._id,
                  updated,
                  function (err, updatedSubmission) {
                    if (err || updatedSubmission == null) {
                      console.log("<ERROR> Updating lecture submission by ID:",updated._id)
                      res.json(err);
                    } else {
                      console.log("<SUCCESS> Updating lecture submission by ID:",updated._id)
                      res.json(updated);
                    }
                  }
                );
              }
            }
          }
        );
      }
    })
  } else {
    res.status(400).send("Missing a real lectureSubmission in request")
  }
});

lectureSubmissionRoutes.route('/get_or_make').post(function (req, res) {
  let lecture_id = req.body.lecture_id
  let submitter_id = req.body.submitter_id
  LectureSubmission.findOne(
    {
      lecture: lecture_id,
      submitter: submitter_id
    },
    function (err, lectureSubmission) {
      if (err) {
        console.log("<ERROR> Getting lecture submission with lecture ID:",lecture_id,"and submitter ID:",submitter_id)
        res.json(err);
      } else if (null != lectureSubmission) { // get
        console.log("<SUCCESS> Getting lecture submission with lecture ID:",lecture_id,"and submitter ID:",submitter_id)
        res.status(200).json(lectureSubmission)
      } else { // make
        let lecture_submission = new LectureSubmission({
          lecture: lecture_id,
          submitter: submitter_id
        });
        lecture_submission.save().then(() => {
          console.log("<SUCCESS> Making lecture submission:",lecture_submission)
          res.status(200).json(lecture_submission);
        }).catch(() => {
          console.log("<ERROR> Making lecture submission:",lecture_submission)
          res.status(400).send("unable to save lectureSubmission to database");
        });
      }
    }
  );
});

lectureSubmissionRoutes.get('/for_lecture/:lecture_id', (req, res) => {
	let lecture_id = req.params.lecture_id;
  LectureSubmission.find(
    {lecture: lecture_id},
    function(err,lect_submissions) {
      if(err || lect_submissions == null) {
        res.json(err)
      } else if(lect_submissions.length > 0){
        let n = 0
        lect_submissions.forEach(lect_sub => {
          User.findById(lect_sub.submitter, (error, submitter) => {
            n++
            if(error || submitter == null) {
              console.log("<ERROR> Getting lecture submissions for lecture with ID:",lecture_id)
              res.json(error)
            } else {
              lect_sub.submitter = submitter
              if(n == lect_submissions.length) {
                console.log("<SUCCESS> Getting lecture submissions for lecture with ID:",lecture_id)
                res.json(lect_submissions)
              }
            }
          })
        })
      } else {
        console.log("<SUCCESS> Getting lecture submissions for lecture with ID:",lecture_id)
        res.json([])
      }
    }
  )
})

lectureSubmissionRoutes.post('/for_lectures', (req, res) => {
  let lecture_ids = req.body.lecture_ids;
  LectureSubmission.find(
    {lecture: {$in: lecture_ids}},
    function(err,lect_submissions) {
      if(err || lect_submissions == null) {
        res.json(err)
      } else if(lect_submissions.length > 0){
        let submitter_ids = lect_submissions.map(a=>a.submitter)
        User.find({_id: {$in: submitter_ids}}, (error, submitters) => {
          if(error || submitters == null) {
            console.log("<ERROR> Getting lecture submissions for lectures with IDs:",lecture_ids)
            res.json(error)
          } else {
            console.log(submitters)
            let n = 0
            lect_submissions.forEach(lect_sub => {
              n++
              let submitter = submitters.find(a => a._id.equals(lect_sub.submitter))
              if(submitter) {
                lect_sub.submitter = submitter
              }
              if(n == lect_submissions.length) {
                console.log("<SUCCESS> Getting lecture submissions for lectures with IDs:",lecture_ids)
                res.json(lect_submissions)
              }
            })
          }
        })
      } else {
        console.log("<SUCCESS> Getting lecture submissions for lectures with IDs:",lecture_ids)
        res.json([])
      }
    }
  )
})

lectureSubmissionRoutes.get('/for_student/:lecture_id/:student_id', (req, res) => {
  let lecture_id = req.params.lecture_id
  let student_id = req.params.student_id
  LectureSubmission.find(
    {
      lecture: lecture_id,
      submitter: student_id
    },
    function(err,lect_submissions) {
      if(err) {
        console.log("<ERROR> Getting lecture submission with lecture ID:",lecture_id,"and student ID:",student_id)
        res.json(err)
      } else {
        if(lect_submissions == null) 
          console.log("<SUCCESS> No lecture submission was found:",lecture_id,"and student ID:",student_id)
        else
          console.log("<SUCCESS> Getting lecture submission with lecture ID:",lecture_id,"and student ID:",student_id)
        console.log("Found submissions",lect_submissions)
        res.json(lect_submissions)
      }
    }
  )
})

module.exports = lectureSubmissionRoutes;