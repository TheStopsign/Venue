const express = require('express');
const courseRoutes = express.Router();

let Course = require('./Course.model');
let Section = require('../Section/Section.model');
let User = require('../User/User.model');

courseRoutes.route('/add').post(function (req, res) {
  let course = new Course(req.body.course);
  course.save()
    .then(() => {
      console.log("<SUCCESS> Adding course:", course);
      res.status(200).json(course);
    })
    .catch(() => {
      console.log("<ERROR> Adding course:", course);
      res.status(400).send("unable to save course to database");
    });
});

courseRoutes.route('/').get(function (req, res) {
  Course.find(function (err, courses) {
    if (err || courses == null) {
      console.log("<ERROR> Getting all courses");
      res.json(err);
    } else {
      console.log("<Success> Getting all courses");
      res.json(courses);
    }
  });
});

courseRoutes.route('')

courseRoutes.route('/edit/:id').get(function (req, res) {
  let id = req.params.id;
  Course.findById(id, function (err, course) {
    if (err || course == null) {
      console.log("<ERROR> Getting course with ID:", id);
      res.json(err);
    } else {
      console.log("<SUCCESS> Getting course with ID:", id);
      res.json(course);
    }
  });
});

courseRoutes.route('/update/:id').post(function (req, res) {
  let id = req.params.id;
  let updated_course = req.body.updated_course;
  Course.findByIdAndUpdate(id,
    {
      name: updated_course.name,
      dept: updated_course.dept,
      course_number: updated_course.course_number,
      instructor: updated_course.instructor
    },
    function (err, course) {
      if (err || course == null) {
        console.log("<ERROR> Updating course by ID:", id, "with:", updated_course);
        res.status(404).send("course not found");
      } else {
        console.log("<SUCCESS> Updating course by ID:", id, "with:", updated_course);
        res.json(course);
      }
    }
  );
});

courseRoutes.route('/delete/:id').delete(function (req, res) {//copied how old code did it which is to search through the all users and remove from there. Not sure if most efficient
  Course.findById({ _id: req.params.id }, function (err, course) {
    if (err) {
      console.log("<ERROR> Finding course with ID:", req.params.id);
      res.json(err);
    } else {
      course.sections.forEach(section_id => {
        Section.findByIdAndRemove(section_id, function (err) {
          if (err) {
            console.log("<ERROR> Deleting section with ID:", section_id);
            res.json(err);
          } else {
            User.updateMany({}, { $pull: { ta_sections: section_id } }, function (err) {
              if (err) {
                console.log("<ERROR> Removing section from ta users with ID:", section_id);
                res.json(err);
              } else {
                User.updateMany({}, { $pull: { student_sections: section_id } }, function (err) {
                  if (err) {
                    console.log("<ERROR> Removing section from student users with ID:", section_id);
                    res.json(err);
                  } else {
                    console.log("<SUCCESS> Deleting section with ID:", section_id);
                  }
                });
              }
            });
          }
        });
      });
    }
    Course.findByIdAndRemove({ _id: req.params.id }, function (err) {
      if (err) {
        console.log("<ERROR> Deleting course with ID:", req.params.id);
        res.json(err);
      } else {
        User.updateMany({}, { $pull: { instructor_courses: req.params.id } }, function (err) {
          if (err) {
            console.log("<ERROR> Removing course from users with ID:", req.params.id);
            res.json(err);
          } else {
            console.log("<SUCCESS> Deleting course with ID:", req.params.id);
            res.json('Successfully removed');
          }
        });
      }
    });
  });
});


//Todo: change the id being passed to just be the instructor id
//and search for the instructor or remove this function entirely and use
//the userapis get user function
courseRoutes.route('/getInstructor/:id').get(function (req, res) {
  let id = req.params.id;
  Course.findById(id, function (err, course) {
    if (err || course == null) {
      console.log("<ERROR> Getting course with ID:", id);
      res.json(err);
    } else {
      let instructor_email = course.instructor;
      User.find({ email: { instructor_email } }, function (error, instructor) {
        if (error || instructor == null) {
          console.log("<ERROR> Getting user with Email:", instructor_email);
          res.json(error);
        } else {
          console.log("<SUCCESS> Getting instructor for course with ID:", id);
          res.json(instructor);
        }
      });
    }
  });
});

courseRoutes.route('/get_instructor_courses').get(function (req, res) {
  Course.find({ _id: { $in: req.user.instructor_courses } }, function (err, instructor_courses) {
    if (err || instructor_courses == null) {
      console.log("<ERROR> Getting instructor courses by user with ID:", req.user._id);
      res.json(err);
    } else {
      console.log("<SUCCESS> Getting instructor courses by user with ID:", req.user._id);
      res.json(instructor_courses);
    }
  });
});

courseRoutes.post('/add_instructors/:id', (req, res) => {
  let instructor_emails = req.body.instructors;
  let course_id = req.params.id;
  Course.findById(course_id, function (err, course) {
    User.find({ email: { $in: instructor_emails } }, function (err, instructors) {
      let instructor_ids = instructors.map(a => a._id);
      Promise.all([
        User.updateMany({ _id: { $in: instructor_ids } }, { $push: { instructor_courses: [course_id] } }),
        Course.findByIdAndUpdate(course_id, { $push: { instructors: { $each: instructor_emails } } })
      ]).then(resolved => {
        res.json();
      });
    });
  });
});

courseRoutes.route('/toggleOpenEnrollment/:id').post(function (req, res) {
  let id = req.params.id;
  Course.findByIdAndUpdate(id,
    {is_public: true}, {$set: {is_public: false}},
      function (err, course) {
        if (err || course == null) {
          console.log("<ERROR> Changing course (ID:",id, ") status to private")
          res.status(404).send("course not found");
        } else {
          console.log("<SUCCESS> Changing course (ID:",id, ") status to private")
          res.json(course);
        }
      }
    );
    Course.findByIdAndUpdate(id,
      {is_public: false}, {$set: {is_public: true}},
        function (err, course) {
          if (err || course == null) {
            console.log("<ERROR> Changing course (ID:",id, ") status to open enrollment")
            res.status(404).send("course not found");
          } else {
            console.log("<SUCCESS> Changing course (ID:",id, ") status to open enrollment")
            res.json(course);
          }
        }
      );
});

module.exports = courseRoutes;