var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var hillSchema = new Schema({
	name: String,
	// name: {type: String, required: true}, // this version requires this field to exist
	// name: {type: String, unique: true}, // this version requires this field to be unique in the db
	locale: String,
	tags: [String],
	path: {
		type: { type: String, default: "LineString" },
		coordinates: {}
	},
	distance: Number,
	steepness: Number,
	notes: String,
	dateAdded : { type: Date, default: Date.now }
});

// export 'Animal' model so we can interact with it in other files
module.exports = mongoose.model('Hill',hillSchema);