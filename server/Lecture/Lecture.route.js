const express = require('express');
const lectureRoutes = express.Router();
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'venue.do.not.reply@gmail.com',
		pass: process.env.EMAIL_PASS
	}
});

const legal_preferences = ["with_sections", "with_sections_and_course", "none"]

let Lecture = require('../Lecture/Lecture.model')
let User = require('../User/User.model')
let Course = require('../Course/Course.model')
let Section = require('../Section/Section.model')

// Lecture Routes

lectureRoutes.route('/add').post(function (req, res) {
	let lecture = new Lecture(req.body.lecture);
	lecture.save()
		.then(() => {
			console.log("<SUCCESS> Adding lecture:", lecture)
			res.status(200).json(lecture);
		})
		.catch(() => {
			console.log("<ERROR> Adding lecture:", lecture)
			res.status(400).send("unable to save lecture to database");
		});
});

lectureRoutes.post('/update/:id', function(req,res) {
	let lecture_id = req.params.id
	let updated_lecture = req.body.updated
	if(lecture_id && updated_lecture) {
		Lecture.findByIdAndUpdate(lecture_id,updated_lecture,function(err,lecture){
			if(err || !lecture) {
				console.log("<ERROR> Updating lecture with ID:", lecture_id)
				res.json(err)
			} else {
				console.log("<SUCCESS> Updating lecture with ID:", lecture_id)
				res.json(lecture)
			}
		})
	} else {
		res.json({})
	}
})

lectureRoutes.get('/delete/:id', function(req,res) {
	Lecture.deleteOne({ _id: req.params.id },function(err) {
		if(err) {
			res.json(err)
		} else {
			res.json('Successfully removed');
		}
	})
})

// Lecture.findByIdAndUpdate(lecture_id,
// 	{
// 		video_ref: public_video_url,
// 	},
// 	function (err, updated_lecture) {
// 		if (err || updated_lecture == null) {
// 			console.log("<ERROR> Updating lecture by ID:",lecture_id,"with:",updated_lecture)
// 			res.status(404).send("lecture not found");
// 		} else {
// 				console.log("<SUCCESS> Adding playback video at URL:",public_video_url)
// 			res.status(200).json(updated_lecture)
// 	}
// })

const AWS = require("aws-sdk");
const s3 = new AWS.S3({
	accessKeyId: process.env.AWSAccessKeyId,
	secretAccessKey: process.env.AWSSecretKey,
	region: 'us-east-2'
});

lectureRoutes.route('/get_signed_recording_url/:filename').get(function(req, res) {
	const fileurls = [];
	const params = {
		Bucket: "venue-recordings",
		Key: req.params.filename,
		Expires: 60*60, // expiry time
		ACL: "bucket-owner-full-control"
	};
	s3.getSignedRecordingUrl("putObject", params, function(err, url) {
		if (err) {
			console.log("<ERROR> Getting signed URL");
			res.json();
		} else {
			fileurls[0] = url;
			console.log("<SUCCESS> Getting signed URL: ", fileurls[0]);
			res.json(fileurls[0]);
		}
	});
});

lectureRoutes.route('/get_signed_file_url/:filename').get(function(req, res) {
	const fileurls = [];
	const params = {
		Bucket: "venue-attachments",
		Key: req.params.filename,
		Expires: 60*60, // expiry time
		ACL: "bucket-owner-full-control"
	};
	s3.getSignedFileUrl("putObject", params, function(err, url) {
		if (err) {
			console.log("<ERROR> Getting file");
			res.json();
		} else {
			fileurls[0] = url;
			console.log("<SUCCESS> Getting file: ", fileurls[0]);
			res.json(fileurls[0]);
		}
	});
});


lectureRoutes.route('/update_to_playback/:lecture_id').post(function (req, res) {
	let lecture_id = req.params.lecture_id
	let lecture = req.body.lecture

	Lecture.findByIdAndUpdate(lecture_id,
		{
			playback_submission_start_time: lecture.playback_submission_start_time,
			playback_submission_end_time: lecture.playback_submission_end_time,
			allow_playback_submissions: true,
			allow_live_submissions: false,
			email_sent: true,
			video_length: lecture.video_length,
			video_type: lecture.video_type,
			video_ref: lecture.video_ref
		},
		function (err, updated_lecture) {
			if (err || updated_lecture == null) {
				console.log("<ERROR> Updating lecture by ID:", lecture_id, "with:", updated_lecture)
				res.status(404).send("lecture not found");
			} else {
				// Section.find({_id: {$in: updated_lecture.sections}}, function (err, sections) {
				// 	if (err || sections == null) {
				// 		console.log("<ERROR> Getting sections for lecture with ID:", updated_lecture._id)
				// 		res.json(err);
				// 	} else {
						// let student_emails = section.students;
						// let num_iterations = 0;
						// student_emails.forEach(student_email => {
						// 	User.find({ email:  student_email }, function (err, student) {
						// 		if (err || student == null) {
						// 			console.log("<ERROR> Getting user with ID:", student_email)
						// 			res.json(err);
						// 		} else {
									
						// 			num_iterations++;//todo fix?
						// 			if (num_iterations === student_emails.length) {
						// 				section_itr++;
						// 				if (section_itr == updated_lecture.sections.length) {
						// 					console.log("<SUCCESS> Adding playback to lecture with ID:", lecture_id)
				res.json(updated_lecture);
				// 						}
				// 					}
				// 				}
				// 			})
				// 		})
				// 	}
				// })
			}
		}
	);
});

// //send email
// let myhtml = ""
// if (process.env.NODE_ENV === "production") {
// 	myhtml = '<p>New Lecture available for playback <a href="https://www.venue-meetings.com/#/lecture_playback/' + updated_lecture._id + '">here</a>!</p>'
// } else {
// 	myhtml = '<p>New Lecture available for playback <a href="http://localhost:8080/#/lecture_playback/' + updated_lecture._id + '">here</a>!</p>'
// }
// var mailOptions = {
// 	from: 'venue.do.not.reply@gmail.com',
// 	to: student.email,
// 	subject: 'Venue - New Lecture Recording Notification',
// 	html: myhtml
// };
// console.log("About to send email with:", mailOptions)
// transporter.sendMail(mailOptions, function (error, info) {
// 	if (error || info == null) {
// 		console.log(error);
// 	} else {
// 		console.log('Email sent to ' + student.email + ': ' + info.response);
// 	}
// });

lectureRoutes.route('/').get(function (req, res) {
	Lecture.find(function (err, lectures) {
		if (err || lectures == null) {
			console.log("<ERROR> Getting all lectures")
			res.json(err);
		} else {
			console.log("<SUCCESS> Getting all lectures")
			res.json(lectures);
		}
	});
});

lectureRoutes.route('/:id').get(function (req, res) {
	Lecture.findById(req.params.id, function (err, lecture) {
		if (err || lecture == null) {
			console.log("<ERROR> Getting lecture with ID:", req.params.id)
			res.json(err);
		} else {
			console.log("<SUCCESS> Getting lecture with ID:", req.params.id)
			res.json(lecture);
		}
	});
});

lectureRoutes.get('/for_user/:user_id/:preference', (req, res) => {
	let preference = req.params.preference

	if (!legal_preferences.includes(preference)) {
		console.log("<ERROR> Invalid preference:", preference)
		res.status(400).send("Illegal preference")
		return
	}

	let all_lectures = []
	let promises = []

	if (req.user.instructor_courses.length) {
		promises.push(new Promise((resolve, reject) => {
			//get courses instructor teaches
			Course.find({ _id: { $in: req.user.instructor_courses } }, (error, instructor_courses) => {
				if (error || instructor_courses == null) {
					console.log("<ERROR> Getting courses with instructor ID:", user._id)
					res.json(error)
				} else {
					//get sections for these courses
					Section.find({ course: { $in: instructor_courses } }, (error, instructor_sections) => {
						if (error || instructor_sections == null) {
							console.log("<ERROR> Getting sections for courses:", instructor_courses)
							res.json(error)
						} else {
							//get lectures in these sections
							Lecture.find({ sections: { $in: instructor_sections } }, (error, instructor_lectures) => {
								if (error || instructor_lectures == null) {
									console.log("<ERROR> Getting lectures for sections:", instructor_sections)
									res.json(error)
								} else {
									console.log("<SUCCESS> Getting lectures for instructor ID: " + req.user._id +
										", with preference: " + preference)
									// attach sections or courses to lectures based on preference
									if (preference === "none")
										resolve(instructor_lectures)
									else {
										let promises2 = []
										instructor_lectures.forEach(instructor_lecture => {
											for (let i = 0; i < instructor_lecture.sections.length; i++) {
												let lecture_section = instructor_lecture.sections[i]
												instructor_sections.forEach(instructor_section => {
													if (lecture_section.equals(instructor_section._id)) {
														promises2.push(new Promise((resolve2, reject2) => {
															instructor_lecture.sections[i] = instructor_section
															if (preference === "with_sections_and_course")
																instructor_lecture.sections[i].course = instructor_courses[0]
															resolve2(instructor_lecture)
														}))
													}
												})
											}
										})
										Promise.all(promises2).then(resolved => {
											resolve(instructor_lectures)
										})
									}
								}
							})
						}
					})
				}
			})
		}))
	}
	if (req.user.ta_sections.length) {
		promises.push(new Promise((resolve, reject) => {
			// User is a ta
			Section.find({ _id: { $in: req.user.ta_sections } }, (error, ta_sections) => {
				Lecture.find({ sections: { $in: ta_sections } }, (error, ta_lectures) => {
					if (error || ta_sections == null) {
						console.log("<ERROR> Getting sections for ta:", req.user._id)
						res.json(error)
					} else {
						console.log("<SUCCESS> Getting lectures for ta ID: " + req.user._id +
							", with preference: " + preference)

						// attach sections or courses to lectures based on preference
						if (preference === "none")
							resolve(ta_lectures)
						else {
							let course_promises = []
							// attach sections to lectures and make asnc call for courses if requested
							ta_lectures.forEach(ta_lecture => {
								// get the actual section object for the section reference
								let lecture_sections = ta_sections.filter(section => ta_lecture.sections.includes(section._id))
								ta_lecture.sections = lecture_sections
								if (preference === "with_sections_and_course") {
									course_promises.push(new Promise((resolve2, reject2) => {
										Course.findById(lecture_sections[0].course, (error, lecture_course) => {
											if (error || lecture_course == null) {
												console.log("<ERROR> Getting course for section:", lecture_section)
												resolve2(null)
											} else {
												resolve2(lecture_course)
											}
										})
									}))
								}
							})
							// if courses were requested attach courses to sections once they have all been fetched
							if (preference === "with_sections_and_course") {
								Promise.all(course_promises).then(resolved => {
									lecture_courses = resolved.filter(lecture_course => lecture_course != null)
									for (let i = 0; i < ta_lectures.length; i++) {
										let ta_lecture = ta_lectures[i]
										for (let j = 0; j < ta_lecture.sections.length; j++) {
											let lecture_section = ta_lecture.sections[j]
											lecture_courses.forEach(lecture_course => {
												if (lecture_course._id.equals(lecture_section.course))
													ta_lectures[i].sections[j].course = lecture_course
											})
										}
									}
									resolve(ta_lectures)
								})
							} else {
								resolve(ta_lectures)
							}
						}
					}
				})
			})
		}))
	}
	if (req.user.student_sections.length) {
		promises.push(new Promise((resolve, reject) => {
			// User is a student
			Section.find({ _id: { $in: req.user.student_sections } }, (error, student_sections) => {
				Lecture.find({ sections: { $in: student_sections } }, (error, student_lectures) => {
					if (error || student_sections == null) {
						console.log("<ERROR> Getting sections for student:", req.user._id)
						res.json(error)
					} else {
						console.log("<SUCCESS> Getting lectures for student ID: " + req.user._id +
							", with preference: " + preference)

						// attach sections or courses to lectures based on preference
						if (preference === "none")
							resolve(student_lectures)
						else {
							let course_promises = []
							// attach sections to lectures and make asnc call for courses if requested
							student_lectures.forEach(student_lecture => {
								// get the actual section object for the section reference
								let lecture_sections = student_sections.filter(section => student_lecture.sections.includes(section._id))
								student_lecture.sections = lecture_sections
								if (preference === "with_sections_and_course") {
									course_promises.push(new Promise((resolve2, reject2) => {
										Course.findById(lecture_sections[0].course, (error, lecture_course) => {
											if (error || lecture_course == null) {
												console.log("<ERROR> Getting course with ID:", lecture_sections[0]._id)
												resolve2(null)
											} else {
												resolve2(lecture_course)
											}
										})
									}))
								}
							})
							// if courses were requested attach courses to sections once they have all been fetched
							if (preference === "with_sections_and_course") {
								Promise.all(course_promises).then(resolved => {
									lecture_courses = resolved.filter(lecture_course => lecture_course != null)
									for (let i = 0; i < student_lectures.length; i++) {
										let student_lecture = student_lectures[i]
										for (let j = 0; j < student_lecture.sections.length; j++) {
											let lecture_section = student_lecture.sections[j]
											lecture_courses.forEach(lecture_course => {
												if (lecture_course._id.equals(lecture_section.course))
													student_lectures[i].sections[j].course = lecture_course
											})
										}
									}
									resolve(student_lectures)
								})
							} else {
								resolve(student_lectures)
							}
						}
					}
				})
			})
		}))
	}
	Promise.all(promises).then(resolved => {
		let ret = []
		if (resolved[0]) {
			ret = ret.concat(resolved[0])
		}
		if (resolved[1]) {
			ret = ret.concat(resolved[1])
		}
		if (resolved[2]) {
			ret = ret.concat(resolved[2])
		}
		res.json(ret.filter(a => a))
	})
})

lectureRoutes.get('/for_course/:course_id', (req, res) => {
	let course_id = req.params.course_id
	// get sections for course
	Section.find({ course: course_id }, (error, course_sections) => {
		if (error || course_sections == null) {
			console.log("<ERROR> Getting sections for course with ID:", course_id)
			res.json(error)
		} else {
			// get lectures for these courses
			Lecture.find({ sections: { $in: course_sections } }, (error, course_lectures) => {
				if (error || course_lectures == null) {
					console.log("<ERROR> Getting lectures for sections:", course_sections)
					res.json(error)
				} else {
					console.log("<SUCCESS> Getting lectures for course with ID:", course_id)
					res.json(course_lectures)
				}
			})
		}
	})
})

lectureRoutes.get('/for_section/:section_id', (req, res) => {
	let section_id = req.params.section_id
	Lecture.find({ sections: section_id }, (error, section_lectures) => {
		if (error || section_lectures == null) {
			console.log("<ERROR> Getting lectures for section with ID:", section_id)
			res.json(error)
		} else {
			console.log("<SUCCESS> Getting lectures for section with ID:", section_id)
			res.json(section_lectures)
		}
	})
})

lectureRoutes.get('/with_sections_and_course/:lecture_id', (req, res) => {
	let lecture_id = req.params.lecture_id;
	// get lecture
	Lecture.findById(lecture_id, function (error, lecture) {
		if (error || lecture == null) {
			console.log("<ERROR> Getting lecture with ID:", lecture_id)
			res.json(error)
		} else {
			// get the sections for the lecture
			Section.find({ '_id': { $in: lecture.sections } }, (error, lecture_sections) => {
				if (error || lecture_sections == null) {
					console.log("<ERROR> Getting secions for lecture with ID:", lecture_id)
					res.json(error)
				} else {
					lecture.sections = lecture_sections
					// get the course for these sections
					Course.findById(lecture_sections[0].course, (error, lecture_course) => {
						if (error || lecture_course == null) {
							console.log("<ERROR> Getting course with ID:", lecture_sections[0].course)
							res.json(error)
						} else {
							lecture.sections.forEach(section => {
								section.course = lecture_course
							})
							console.log("<SUCCESS> Getting lecture with sections and course for lecture ID:", lecture_id)
							res.json(lecture)
						}
					})
				}
			})
		}
	});
})

// lectureRoutes.post('/process_emails', (req, res) => {
// 	let lectures = req.body.lectures
// 	let toEmail = req.body.toEmail
// 	if (lectures == null || toEmail == null) {
// 		console.log("<ERROR> Invalid request with lectures:", lectures, "and toEmail:", toEmail)
// 		res.status(404).send("Bad request to process_emails")
// 	} else {
// 		lectures.forEach(lecture => {
// 			if (!lecture.email_sent) { //email has not been sent yet
// 				Lecture.findByIdAndUpdate(lecture._id,
// 					{
// 						email_sent: true //mark email as sent
// 					},
// 					function (err, lect) {
// 						if (err || lect == null) {
// 							console.log("<ERROR> Updating course by ID:", lecture._id, "with:", { email_sent: true })
// 							res.status(404).send("lecture not found");
// 						} else {
// 							let myhtml = ""
// 							if (process.env.NODE_ENV === "production") {
// 								myhtml = '<p>Click <a href="https://www.venue-meetings.com/#/lecture_info/' + lect._id + '">here</a> to upload your lecture recording</p>'
// 							} else {
// 								myhtml = '<p>Click <a href="http://localhost:8080/#/lecture_info/' + lect._id + '">here</a> to upload your lecture recording</p>'
// 							}
// 							var mailOptions = {
// 								from: 'venue.do.not.reply@gmail.com',
// 								to: toEmail,
// 								subject: 'Venue Lecture Upload Reminder',
// 								html: myhtml
// 							};
// 							console.log("About to send email with:", mailOptions)
// 							transporter.sendMail(mailOptions, function (error, info) {
// 								if (error) {
// 									console.log(error);
// 								} else {
// 									console.log('Email sent to ' + toEmail + ': ' + info.response);
// 								}
// 							});
// 						}
// 					}
// 				);
// 			}
// 		})
// 		console.log("<SUCCESS> Notification emails sent to:", toEmail);
// 		res.json(lectures)
// 	}
// })

lectureRoutes.post('/end_early', (req, res) => {
	let now = new Date()
	Lecture.findByIdAndUpdate(req.body.lecture_id, { end_time: now }, function (err, lecture) {
		if (err || !lecture) {
			console.log("<ERROR> Ending lecture early for lecture with ID: " + req.body.lecture_id)
			res.status(404).send("<ERROR> Ending lecture early for lecture with ID: " + req.body.lecture_id)
		} else {
			lecture.end_time = now
			console.log("<SUCCESS> Ending lecture early for lecture with ID: " + req.body.lecture_id)
			res.json(lecture)
		}
	})
})
module.exports = lectureRoutes
