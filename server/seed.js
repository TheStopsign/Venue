const seeder = require("mongoose-seed");
const Course = require("./Course/Course.model")
const Section = require("./Section/Section.model")
const User = require("./User/User.model")
const Lecture = require("./Lecture/Lecture.model")
const LectureSubmission = require("./LectureSubmission/LectureSubmission.model")
const PlaybackPoll = require("./PlaybackPoll/PlaybackPoll.model")

const bcrypt = require('bcrypt');
const saltRounds = 10;

////////USERS
var u0 = new User()
var u1 = new User()
var u2 = new User()
var u3 = new User()
var u4 = new User()
var u5 = new User()
var u6 = new User()
var u7 = new User()
var u8 = new User()
var u9 = new User()
var u10 = new User()
var u11 = new User()
var u12 = new User()
var u13 = new User()
var u14 = new User()
var u15 = new User()
var u16 = new User()
var u17 = new User()
var u18 = new User()
var u19 = new User()
var u20 = new User()
var u21 = new User()
var u22 = new User()
var u23 = new User()
var u24 = new User()
var u25 = new User()
var u26 = new User()
var u27 = new User()

////////COURSES
var c0 = new Course()
var c1 = new Course()
var c2 = new Course()
var c3 = new Course()
var c4 = new Course()

////////SECTIONS
var s0 = new Section()
var s1 = new Section()
var s2 = new Section()
var s3 = new Section()
var s4 = new Section()

////////LECTURES
var l0 = new Lecture()
var l1 = new Lecture()
var l2 = new Lecture()
var l3 = new Lecture()

////////LECTURE SUBMISSIONS
var ls0 = new LectureSubmission()

////////POLLS{
var p0 = new PlaybackPoll()
var p1 = new PlaybackPoll()
var p2 = new PlaybackPoll()
var p3 = new PlaybackPoll()
var p4 = new PlaybackPoll()

////////USERS
u0 = {
	_id: u0._id,
	first_name: "Ethan",
	last_name: "Whitton",
	user_id: "whitte3",
	email: "venue@rpi.edu",
	password: "nimda",
	is_admin: true,
	instructor_courses: [c0,c2._id,c3._id,c4._id],
	ta_sections: [s1._id,s2._id],
	student_sections: []
}
u1 = {
	_id: u1._id,
	first_name: "John",
	last_name: "Doe",
	user_id: "testinst",
	email: "testinst@rpi.edu",
	password: "password",
	instructor_courses: [c1._id,c4._id],
	ta_sections: [],
	student_sections: []
}
u2 = {
	_id: u2._id,
	first_name: "Student",
	last_name: "a",
	user_id: "student" + "a",
	email: "student"+"a"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s1._id,s2._id,s3._id,s4._id]
}
u3 = {
	_id: u3._id,
	first_name: "Student",
	last_name: "b",
	user_id: "student" + "b",
	email: "student"+"b"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s1._id,s3._id]
}
u4 = {
	_id: u4._id,
	first_name: "Student",
	last_name: "c",
	user_id: "student" + "c",
	email: "student"+"c"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s2._id,s3._id]
}
u5 = {
	_id: u5._id,
	first_name: "Student",
	last_name: "d",
	user_id: "student" + "d",
	email: "student"+"d"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s3._id]
}
u6 = {
	_id: u6._id,
	first_name: "Student",
	last_name: "e",
	user_id: "student" + "e",
	email: "student"+"e"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s3._id]
}
u7 = {
	_id: u7._id,
	first_name: "Student",
	last_name: "f",
	user_id: "student" + "f",
	email: "student"+"f"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s3._id]
}
u8 = {
	_id: u8._id,
	first_name: "Student",
	last_name: "g",
	user_id: "student" + "g",
	email: "student"+"g"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s3._id]
}
u9 = {
	_id: u9._id,
	first_name: "Student",
	last_name: "h",
	user_id: "student" + "h",
	email: "student"+"h"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s3._id]
}
u10 = {
	_id: u10._id,
	first_name: "Student",
	last_name: "i",
	user_id: "student" + "i",
	email: "student"+"i"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s3._id]
}
u11 = {
	_id: u11._id,
	first_name: "Student",
	last_name: "j",
	user_id: "student" + "j",
	email: "student"+"j"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s3._id]
}
u12 = {
	_id: u12._id,
	first_name: "Student",
	last_name: "k",
	user_id: "student" + "k",
	email: "student"+"k"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s3._id]
}
u13 = {
	_id: u13._id,
	first_name: "Student",
	last_name: "l",
	user_id: "student" + "l",
	email: "student"+"l"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s3._id]
}
u14 = {
	_id: u14._id,
	first_name: "Student",
	last_name: "m",
	user_id: "student" + "m",
	email: "student"+"m"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s4._id]
}
u15 = {
	_id: u15._id,
	first_name: "Student",
	last_name: "n",
	user_id: "student" + "n",
	email: "student"+"n"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s4._id]
}
u16 = {
	_id: u16._id,
	first_name: "Student",
	last_name: "o",
	user_id: "student" + "o",
	email: "student"+"o"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s4._id]
}
u17 = {
	_id: u17._id,
	first_name: "Student",
	last_name: "p",
	user_id: "student" + "p",
	email: "student"+"p"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s4._id]
}
u18 = {
	_id: u18._id,
	first_name: "Student",
	last_name: "q",
	user_id: "student" + "q",
	email: "student"+"q"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s4._id]
}
u19 = {
	_id: u19._id,
	first_name: "Student",
	last_name: "r",
	user_id: "student" + "r",
	email: "student"+"r"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s4._id]
}
u20 = {
	_id: u20._id,
	first_name: "Student",
	last_name: "s",
	user_id: "student" + "s",
	email: "student"+"s"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s4._id]
}
u21 = {
	_id: u21._id,
	first_name: "Student",
	last_name: "t",
	user_id: "student" + "t",
	email: "student"+"t"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s4._id]
}
u22 = {
	_id: u22._id,
	first_name: "Student",
	last_name: "u",
	user_id: "student" + "u",
	email: "student"+"u"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s4._id]
}
u23 = {
	_id: u23._id,
	first_name: "Student",
	last_name: "v",
	user_id: "student" + "v",
	email: "student"+"v"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s4._id]
}
u24 = {
	_id: u24._id,
	first_name: "Student",
	last_name: "w",
	user_id: "student" + "w",
	email: "student"+"w"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s4._id]
}
u25 = {
	_id: u25._id,
	first_name: "Student",
	last_name: "x",
	user_id: "student" + "x",
	email: "student"+"x"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [],
	student_sections: [s0._id,s4._id]
}
u26 = {
	_id: u26._id,
	first_name: "Student",
	last_name: "y",
	user_id: "student" + "y",
	email: "student"+"y"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [s0._id,s3._id],
	student_sections: []
}
u27 = {
	_id: u27._id,
	first_name: "Student",
	last_name: "Z",
	user_id: "student" + "z",
	email: "student"+"z"+"@rpi.edu",
	password: "password",
	instructor_courses: [],
	ta_sections: [s0._id,s4._id],
	student_sections: []
}

////////COURSES
c0 = {
	_id: c0._id,
	name: "RCOS",
	prefix: "CSCI",
	suffix: 2961,
	instructors: [
		u0.email
	]
}
c1 = {
	_id: c1._id,
	name: "Data Structures",
	prefix: "CSCI",
	suffix: 1200,
	snooze: 15,
	meetingURL: "default_link",
	instructors: [
		u1.email
	]
}
c2 = {
	_id: c2._id,
	name: "Multiletiable Calculus",
	prefix: "MATH",
	suffix: 2010,
	instructors: [
		u0.email
	]
}
c3 = {
	_id: c3._id,
	name: "Physics I",
	prefix: "PHYS",
	suffix: 1100,
	instructors: [
		u0._id
	]
}
c4 = {
	_id: c4._id,
	name: "Testing Course",
	prefix: "TEST",
	suffix: 1000,
	instructors: [
		u0.email,
		u1.email
	]
}

////////SECTIONS
s0 = {
	_id: s0._id,
	course: c0._id,
	name: "1",
	students: [
		u2.email,
		u3.email,
		u4.email,
		u5.email,
		u6.email,
		u7.email,
		u8.email,
		u9.email,
		u10.email,
		u11.email,
		u12.email,
		u13.email,
		u14.email,
		u15.email,
		u16.email,
		u17.email,
		u18.email,
		u19.email,
		u20.email,
		u21.email,
		u22.email,
		u23.email,
		u24.email,
		u25.email
	],
	teaching_assistants: [
		u26.email,
		u27.email
	]
}
s1 = {
	_id: s1._id,
	course: c1._id,
	name: "1",
	students: [
		u2.email,
		u3.email
	],
	teaching_assistants: [
		u0.email
	]
}
s2 = {
	_id: s2._id,
	course: c1._id,
	name: "2",
	students: [
		u2.email,
		u4.email
	],
	teaching_assistants: [
		u0.email
	]
}
s3 = {
	_id: s3._id,
	course: c4._id,
	name: "1",
	students: [
		u2.email, //a
		u3.email, //b
		u4.email,
		u5.email,
		u6.email,
		u7.email,
		u8.email,
		u9.email,
		u10.email,
		u11.email,
		u12.email,
		u13.email //l
	],
	teaching_assistants: [
		u26.email //y
	]
}
s4 = {
	_id: s4._id,
	course: c4._id,
	name: "2",
	students: [
		u2.email,	//a
		u14.email,//m
		u15.email,
		u16.email,
		u17.email,
		u18.email,
		u19.email,
		u20.email,
		u21.email,
		u22.email,
		u23.email,
		u24.email,
		u25.email //x
	],
	teaching_assistants: [
		u27.email //z
	]
}

////////LECTURES
l0 = {
	_id: l0._id,
	title: "Live Lecture",
	sections: [s1._id],
	allow_live_submissions: true,
	allow_playback_submissions: false,
	start_time: Date.now(),
	end_time: Date.now() + (2*60*60*1000),
	checkins: [{
		start_time: Date.now() + (60*1000),
		end_time: Date.now() + (2*60*1000),
		code: "abcdefghijklmnopqrstuvwxyz",
	},{
		start_time: Date.now() + (3*60*1000),
		end_time: Date.now() + (4*60*1000),
		code: "zyxwvutsrqponmlkjihgfedcba",
	}],
	num_playback_polls: 0
}
l1 = {
	_id: l1._id,
	title: "Playback Lecture",
	sections: [s1._id,s2._id],
	allow_live_submissions: false,
	allow_playback_submissions: true,
	checkins: [{
		start_time: Date.now() - (4*60*1000),
		end_time: Date.now() - (3*60*1000),
		code: "abcdefghijklmnopqrstuvwxyz",
	},{
		start_time: Date.now() - (2*60*1000),
		end_time: Date.now() - (60*1000),
		code: "zyxwvutsrqponmlkjihgfedcba",
	}],
	playback_submission_start_time: Date.now(),
	playback_submission_end_time: Date.now() + (3*60*1000),
	video_ref: "/videos/sample/sample.mp4",
	num_playback_polls: 2
}
l2 = {
	_id: l2._id,
	title: "Upcoming Playback Lecture",
	sections: [s1._id],
	allow_live_submissions: false,
	allow_playback_submissions: true,
	playback_submission_start_time: Date.now() + (2*60*1000),
	playback_submission_end_time: Date.now() + (4*60*1000),
	video_ref: "/videos/sample/sample.mp4",
	num_playback_polls: 2
}
l3 = {
	_id: l3._id,
	title: "How to use Venue",
	sections: [s0._id],
	allow_live_submissions: true,
	allow_playback_submissions: false,
	start_time: Date.now(),
	end_time: Date.now() + (2*60*60*1000),
	checkins: [{
		start_time: Date.now() + (60*1000),
		end_time: Date.now() + (3*60*1000),
		code: "abcdefghijklmnopqrstuvwxyz",
	}],
	num_playback_polls: 2
}

////////LECTURE SUBMISSIONS
ls0 = {
	_id: ls0._id,
	lecture: l1._id,
	submitter: u2._id,
	codes: ["abcdefghijklmnopqrstuvwxyz"],
	live_progress: 1,
	live_percent: 0.5,
	live_submission_time: Date.now() - (3.5*60*1000)
}

////////POLLS
p0 = {
	_id: p0._id,
	lecture: l1._id,
	question: "Where is my super suit?",
	possible_answers: [
		"I, uh, put it away.",
		"Why do you need to know?"
	],
	correct_answers: [
		"Why do you need to know?"
	],
	timestamp: 5
}
p1 = {
	_id: p1._id,
	lecture: l1._id,
	question: "Speed of light?",
	possible_answers: [
		"Fast",
		"2Fast"
	],
	correct_answers: [
		"2Fast"
	],
	timestamp: 15
}
p2 = {
	_id: p2._id,
	lecture: l2._id,
	question: "What's 9 + 10?",
	possible_answers: [
		"19",
		"21"
	],
	correct_answers: [
		"21"
	],
	timestamp: 10
}
p3 = {
	_id: p3._id,
	lecture: l2._id,
	question: "Are you smart m8?",
	possible_answers: [
		"Yeah",
		"kinda",
		"nah",
	],
	correct_answers: [
		"nah"
	],
	timestamp: 15
}
p4 = {
	_id: p4._id,
	lecture: l3._id,
	question: "What is this planet?",
	possible_answers: [
		"Mercury",
		"Venus",
		"Earth",
		"Mars",
		"Jupiter",
		"Saturn",
		"Uranus",
		"Neptune"
	],
	correct_answers: [
		"Earth"
	],
	timestamp: 5
}

seeder.connect(process.env.DB_URI || 'mongodb://localhost:27017/Venue', function () {
	seeder.loadModels([
		"./Course/Course.model",
		"./User/User.model",
		"./Section/Section.model",
		"./Lecture/Lecture.model",
		"./LectureSubmission/LectureSubmission.model",
		"./PlaybackPoll/PlaybackPoll.model"
	]);
	seeder.clearModels(['Course', 'User', 'Section', 'Lecture', 'LectureSubmission', 'PlaybackPoll'], function () {

		let u = []
		let c = []
		let s = []
		let l = []
		let ls = []
		let p = []


		u.push(u0)
		u.push(u1)
		u.push(u2)
		u.push(u3)
		u.push(u4)
		u.push(u5)
		u.push(u6)
		u.push(u7)
		u.push(u8)
		u.push(u9)
		u.push(u10)
		u.push(u11)
		u.push(u12)
		u.push(u13)
		u.push(u14)
		u.push(u15)
		u.push(u16)
		u.push(u17)
		u.push(u18)
		u.push(u19)
		u.push(u20)
		u.push(u21)
		u.push(u22)
		u.push(u23)
		u.push(u24)
		u.push(u25)
		u.push(u26)
		u.push(u27)

		c.push(c0)
		c.push(c1)
		c.push(c2)
		c.push(c3)
		c.push(c4)

		s.push(s0)
		s.push(s1)
		s.push(s2)
		s.push(s3)
		s.push(s4)

		l.push(l0)
		l.push(l1)
		l.push(l2)
		l.push(l3)

		ls.push(ls0)

		p.push(p0)
		p.push(p1)
		p.push(p2)
		p.push(p3)
		p.push(p4)

		let promises = []
		u.forEach(user => {
			promises.push(new Promise((resolve,reject) => {
				bcrypt.hash(user.password,saltRounds,(err,hash) => {
					resolve(hash)
				})
			}))
		})

		Promise.all(promises)
			.then((fulfilled) => {
				for(i=0;i<u.length;i++){
					u[i].password = fulfilled[i]
				}

				let data = [{
					"model": "User",
					"documents": u
				}, {
					"model": "Course",
					"documents": c
				}, {
					"model": "Section",
					"documents": s
				}, {
					"model": "Lecture",
					"documents": l
				}, {
					"model": "LectureSubmission",
					"documents": ls
				}, {
					"model": "PlaybackPoll",
					"documents": p
				}]

				seeder.populateModels(data, function (err, done) {
					if (err) {
						return console.log("seed err", err)
					}
					if (done) {
						return console.log("seed finished", done)
					}
					seeder.disconnect()
				})
			})
			.catch(err => {
				console.log("ERROR IN RESOLVING HASHED PASSWORDS",err)
			})
	});
});