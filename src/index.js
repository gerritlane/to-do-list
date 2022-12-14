const express = require('express');
const path = require('path');
const xss = require('xss');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded( {extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const listItemSchema = new mongoose.Schema({
	listItemText: {
		type:	String,
		required:	[true, 'Please enter a value']
	},
	category: {
		type: String,
	}
});

const ListItem = mongoose.model('ListItem', listItemSchema);


app.get('/', (req, res) => {
	// Query mongoose db for existing list items, render page when found
	ListItem.find({category: 'default'}, function(err, listItems) {
		const fullList = [];
		if (err) {
			console.log(err);
			return [];
		} else {
		  listItems.forEach(function(listItem) {
				fullList.push(listItem);
			});
		};
		res.render('index', {webListItems: fullList, categoryPage: '/'});
	});
});

app.get('/lists/:customListName', (req, res) => {
	// Query mongoose db for existing list items, render page when found
	categoryQuery = xss(req.params.customListName);
	ListItem.find({category: categoryQuery}, function(err, listItems) {
		const fullList = [];
		if (err) {
			console.log(err);
			return [];
		} else {
		  listItems.forEach(function(listItem) {
				fullList.push(listItem);
			});
		};
		res.render('index', {webListItems: fullList, categoryPage: `/lists/${categoryQuery}`});
	});
});

app.post('/', (req, res) => {
	// Create a mongoose object from the textbox input and reload
	console.log('Default Post Route');
	const newListItem = new ListItem	({
		listItemText: xss(req.body.listItem),
		category: 'default'
	});
	newListItem.save();
	res.redirect('/');
});

app.post('/lists/:customListName', (req, res) => {
	// Create a mongoose object from the textbox input and reload
	console.log('Default Post Route');
	const newListItem = new ListItem	({
		listItemText: xss(req.body.listItem),
		category: xss(req.params.customListName)
	});
	newListItem.save();
	res.redirect(`/lists/${req.params.customListName}`);
});

app.post('/delete', (req, res) => {
	const idForDelete = xss(req.body.listItemId);
	console.log(idForDelete);
	ListItem.findByIdAndDelete(idForDelete, function(err){
		if (err) {
			console.log(err);
			return [];
		} else {
		  	console.log(`Deleted entry ${idForDelete}`);
			}});
	res.redirect('/');
});

app.listen(3000, function() {
	console.log('Server started on localhost port 3000');
});