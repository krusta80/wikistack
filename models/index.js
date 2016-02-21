var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var Schema = mongoose.Schema;

var pageSchema = new Schema({
  title:  {type: String, required: true},
  urlTitle: {type: String, required: true},
  content: {type: String, required: true},
  date: { type: Date, default: Date.now },
  status: {type: String, enum: ['open','closed']},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tags : Array
});

pageSchema.virtual('route').get(function() {
	return '/wiki/' + this.urlTitle;
});

pageSchema.pre('validate', function(next){
	console.log(this.tags);
	this.tags = this.tags[0].split(",");

	thisstatus = "open";
	if(this.openStatus !== "on") this.status = "closed";
	
	var title = this.title.replace(" ","_").replace(/\W/gi,"").toLowerCase();
	if((title === "") || (title === 'add')) {
		title = Math.random().toString(36).substring(2,7);
	}
	this.urlTitle = title;
	next();
});

var userSchema = new Schema({
  name:  {type: String, required: true},
  email: {type: String, required: true, unique: true}
}); 

userSchema.statics.findOrCreate = function(authorName, authorEmail) {
	var self = this;
	return self.findOne({email: authorEmail}).exec()
		.then(function(user) {
			if (user) return user;
			else return self.create({
				email: authorEmail,
				name: authorName
			});
		});
}

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

module.exports = {
  Page: Page,
  User: User
};



// Page.find({}).exec()
// .then(function success (page) {...})
// .then(null, errFn);