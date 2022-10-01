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
	listItemText: String
});

const ListItem = mongoose.model('ListItem', listItemSchema);


app.get('/', (req, res) => {
	// Query mongoose db for existing list items, render page when found
	ListItem.find(function(err, listItems) {
		const fullList = [];
		if (err) {
			console.log(err);
			return [];
		} else {
		  listItems.forEach(function(listItem) {
				fullList.push(listItem.listItemText);
			});
		};
		res.render('index', {webListItems: fullList});
	});
});

app.post('/', (req, res) => {
	// Create a mongoose object from the textbox input and reload
	const newListItem = new ListItem	({
		listItemText: xss(req.body.listItem),
	});
	newListItem.save();
	res.redirect('/');
});

app.listen(3000, function() {
	console.log('Server started on localhost port 3000');
});