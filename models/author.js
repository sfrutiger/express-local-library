var mongoose = require('mongoose');
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
// To avoid errors in cases where an author does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case
  var fullname = '';
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ', ' + this.first_name
  }
  if (!this.first_name || !this.family_name) {
    fullname = '';
  }
  return fullname;
});

// Virtual for author's lifespan
AuthorSchema.virtual('lifespan').get(function() {
  var lifetime_string = '';
  if (this.date_of_birth) {
    lifetime_string = DateTime.fromJSDate(this.date_of_birth).toLocaleString({timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric'});
  }
  lifetime_string += ' - ';
  if (this.date_of_death) {
    lifetime_string += DateTime.fromJSDate(this.date_of_death).toLocaleString({timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric'});
  }
  return lifetime_string;
});

//virtual for author's birth and death date
AuthorSchema
.virtual('date_of_birth_formatted')
.get(function () {
  const offset = this.date_of_birth ? this.date_of_birth.getTimezoneOffset(): 0;
  return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).plus({minutes: offset}).toLocaleString(DateTime.DATE_MED) : '';
});

AuthorSchema
.virtual('date_of_death_formatted')
.get(function () {
  const offset = this.date_of_death ? this.date_of_death.getTimezoneOffset(): 0;
  return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : '';
});

AuthorSchema
.virtual('date_of_birth_yyyy_mm_dd')
.get(function () {
  const offset = this.date_of_birth ? this.date_of_birth.getTimezoneOffset(): 0;
  return DateTime.fromJSDate(this.date_of_birth).plus({minutes: offset}).toISODate(); //format 'YYYY-MM-DD'
});

AuthorSchema
.virtual('date_of_death_yyyy_mm_dd')
.get(function () {
  const offset = this.date_of_death ? this.date_of_death.getTimezoneOffset(): 0;
  return DateTime.fromJSDate(this.date_of_death).plus({minutes: offset}).toISODate(); //format 'YYYY-MM-DD'
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);
