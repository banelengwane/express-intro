let express = require('express');

let exphbs = require('express-handlebars');
let bodyParser = require('body-parser');
let Moment = require('moment');


const SettingsBill = require('./settingbill')
//let Moment = moment();
let app = express();

const settingsBill = SettingsBill();
//setting up handlebars
let myhbp = exphbs.create({ defaultLayout: 'main', helpers: 'helpers' });
app.engine('handlebars', myhbp.engine);
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//adding the public folder
app.use(express.static('public/'));

app.get("/", function (req, res) {
	res.render('home',
		{
			settings: settingsBill.getResult(),
			totals: settingsBill.totals()
		});
});

app.post('/settings', function (req, res) {
	let call = req.body.callCost;
	let sms = req.body.smsCost;
	let warning = req.body.warningLevel;
	let critical = req.body.criticalLevel;

	settingsBill.updateCall(call);
	settingsBill.updateSMS(sms);
	settingsBill.updateWarning(warning);
	settingsBill.updateCritical(critical);

	res.redirect('/');
});

app.post('/action', function (req, res) {
	settingsBill.settingEntry(req.body.entryType);
	res.redirect('/');
});

app.get('/actions', function (req, res) {
	res.render('actions', {
		actions: settingsBill.actions(), helpers: {
			'time': function () {
				return Moment(this.timestamp).fromNow();
			}
		}
	});
});

app.get('/actions/:actionType', function (req, res) {
	let actionType = req.params.actionType;
	res.render('actions', {
		actions: settingsBill.actionsFor(actionType), helpers: {
			'time': function () {
				return Moment(this.timestamp).fromNow();
			}
		}
	});
});

let PORT = process.env.PORT || 3009;

app.listen(PORT, function () {
	console.log('App starting on port', PORT)
});
