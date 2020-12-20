const mongoose = require('mongoose');
require('mongoose-type-url');
const Schema = mongoose.Schema;

let Section = require('../Section/Section.model');
let Attachment = require('../Attachments/Attachment.model');

//Define collection and schema for Lecture
let Lecture = new Schema({
	title: String,
	sections: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Section'
	}],
	allow_live_submissions: { type: Boolean, default: false },
	allow_playback_submissions: { type: Boolean, default: false },
	start_time: Date,
	end_time: Date,
	checkins: [{
		start_time: Date,
		end_time: Date,
		code: String,
		manually_activated: Boolean,
		activation: String
	}],
	playback_submission_start_time: Date,
	playback_submission_end_time: Date,
	submission_window_status: {
		is_pending: { type: Boolean, default: false },
		is_open: { type: Boolean, default: false },
		is_closed: { type: Boolean, default: false }
	},
	video_ref: { type: String, default: "" },
	video_length: Number,
	video_type: { type: String, default: "" },
	num_playback_polls: Number,
	email_sent: {type: Boolean, default: false},
	meeting_link: mongoose.SchemaTypes.Url,
	class_links: {
		type: [{
			type: mongoose.SchemaTypes.Url
		}],
		default: []
	},
	files: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Attachment'
	}]
});

module.exports = mongoose.model('Lecture', Lecture);