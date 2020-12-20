const mongoose = require('mongoose');
require('mongoose-type-url');
const Schema = mongoose.Schema;

let User = require('../User/User.model');
let Section = require('../Section/Section.model');

//Define collection and schema for User
let Attachment = new Schema({
	name: String,
	filepath: String,
    type: String,
	size: Number,
	uploadedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Attachment', Attachment);