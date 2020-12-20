const mongoose = require('mongoose');
require('mongoose-type-url');
const Schema = mongoose.Schema;

let Course = require('../Course/Course.model');
let Attachment = require('../Attachments/Attachment.model');

//Define collection and schema for User
let Section = new Schema({
	course: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Course'
	},
	name: {type:String,default:''},
	teaching_assistants: [{
		type: String,
		ref: 'User'
	}],
	students: [{
		type: String,
		ref: 'User'
	}],
	is_public: {
		type: Boolean,
		default: false
	},
	links: [{
		type: mongoose.SchemaTypes.Url
	}],/*
	files: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Attachment'
	}]*/
});

module.exports = mongoose.model('Section', Section);
