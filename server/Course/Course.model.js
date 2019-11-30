const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = require('../User/User.model');

//Define collection and schema for User
let CourseSchema = new Schema({
	name: String,
	dept: String,
	course_number: Number,
	instructor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Course', CourseSchema);