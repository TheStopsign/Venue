const mongoose = require('mongoose');
require('mongoose-type-url');

const Schema = mongoose.Schema;

let User = require('../User/User.model');
let Section = require('../Section/Section.model')

//Define collection and schema for User
let Course = new Schema({
	name: String,
	prefix: String,
	suffix: Number,
	default_link: String,	//Added this
	snooze: Number,
	meetingURL: String,
	course_times: [{		//Added this
		day: String,
		start_time: String,
		end_time: String
	}],
	instructors: [{
		type: String,
		ref: 'User'
	}],
	sections: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Section'
	}],
	important_links: [{
		type: mongoose.SchemaTypes.Url
	}]
});

module.exports = mongoose.model('Course', Course);