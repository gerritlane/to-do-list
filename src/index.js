const express = require('express');
const path = require('path');
const xss = require('xss');
const app = express();
const listItems = [];

app.set('view engine', 'ejs');
app.use(express.urlencoded( {extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
	res.render('index', {webListItems: listItems} );
});

app.post('/', (req, res) => {
	const newListItem = xss(req.body.listItem);
	console.log(newListItem);
	listItems.push(newListItem);
	res.render('index', {webListItems: listItems});
});

app.listen(3000, function() {
	console.log('Server started on localhost port 3000');
});