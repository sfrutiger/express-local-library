var mongoose = require('mongoose');
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, //reference to the associated book
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
  }
);

// Virtual for bookinstance's URL
BookInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/bookinstance/' + this._id;
});

//virtual for bookinstance's duedate
BookInstanceSchema
.virtual('due_back_formatted')
.get(function () {
  const offset = this.due_back.getTimezoneOffset();
  return DateTime.fromJSDate(this.due_back).plus({minutes: offset}).toLocaleString(DateTime.DATE_MED);
});

BookInstanceSchema
.virtual('due_back_yyyy_mm_dd')
.get(function () {
  const offset = this.due_back.getTimezoneOffset();
  return DateTime.fromJSDate(this.due_back).plus({minutes: offset}).toISODate(); //format 'YYYY-MM-DD'
});


//Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
