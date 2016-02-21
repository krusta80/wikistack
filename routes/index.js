var express = require('express');
var models = require('../models');
var Page = models.Page;
var User = models.User;

module.exports = function () {
	var router = express.Router();
	// could use one line instead: var router = require('express').Router();
	
	router.get('/', function (req, res) {
	  Page.find().exec()
	  	.then(function(pages) {
	  		res.render('index', {pages: pages});
//console.log(pages);

	  	})
	});

	router.get('/add', function (req, res) {
	  res.render('addpage', { title: 'WikiStack - Add Page'});
	});

	router.get('/search', function (req, res) {
		Page.find({tags: req.query.tag}).exec()
	  	.then(function(pages) {
	  		res.render('index', {pages: pages, tag: req.query.tag});
	  			  //console.log(page);

	  	})
	});

	router.get('/:urlTitle', function (req, res) {
	  Page.findOne({ urlTitle : req.params.urlTitle}).exec()
	  	.then(function(page) {
	  		res.render('wikipage', page);
	  			  //console.log(page);

	  	})
	});

	router.post('/', function (req, res) {
	  
	  User.findOrCreate(req.body.author, req.body.email)
	  	.then(function(user) {
	  		
	  		var page = new Page({
		  	title: req.body.title,
		  	content: req.body.content,
		  	status: req.body.openStatus,
		  	tags: req.body.tags,
		  	author: user._id
		  });
		  
		  //page.validate();
		  console.log(page.save());
		  page.save()
		  	.then(function(savedPage) {
		  		res.redirect(savedPage.route);
		  	})
		  	.then(null, function(error) {
		  		console.log(error);
		  	});
		  
	  	})
	});
	
	

	// router.get('/users/:name', function (req, res) {
	//   var tweets = tweetBank.find({name : req.params.name});
	//   res.render( 'index', { name: req.params.name, title: 'Twitter.js - Posts by ' + req.params.name, tweets: tweets, showForm: true } );
	// });

	// router.get('/tweets/:tweetID', function (req, res) {
	//   var tweets = tweetBank.find({tweetID : req.params.tweetID});
	//   res.render( 'index', { title: 'Twitter.js', tweets: tweets } );
	// });

	// router.post('/tweets', function(req, res) {
	//   var name = req.body.name;
	//   var text = req.body.text;
	//   var tweetID = tweetBank.add(name, text);
	//   io.sockets.emit('new_tweet', { id: tweetID, name: name, text: text });
	//   res.redirect('/');
	// });

	return router;
}

