const mysql = require('mysql');
const errors = require('http-errors');
const config = require('./config.js');

const noop = () => void 0;
const padZero = n => +n < 10? n + '' : '0' + n;
const dateToMysql = d => {
	return [
		d.getUTCFullYear(),
		padZero(d.getUTCMonth() + 1),
		padZero(d.getUTCDate())
	].join('-');
};
const handleErr = (err, b, r) =>
{
	if (b) console.log(err);
	r.status(500);
	r.send('Internal server error');
};


// promises
const connect = (cfg) => new Promise(function (rs, rj)
{
	const conn = mysql.createConnection({
		host     : cfg.host,
		port     : cfg.port,
		user     : cfg.user,
		password : cfg.password,
		database : cfg.database
	});
	conn.connect(err => err? rj(err) : rs(conn));
});

const query = (conn, q, v) => new Promise((rs, rj) =>
{
	conn.query(q, v, (e, r, f) =>
	{
		if (e) rj(e);
		rs(r, f);
	});
});

module.exports = {
	'/test': {
		'GET': (req, res) =>
		{
			let conn = null;
			return connect(config.db)
				.then(c => {
					conn = c;
					return query(c, 'SELECT 2+2 AS four');
				})
				.then((results, fields) =>
				{
					res.json('2+2 = ' + results[0].four);
				})
				.catch(err => handleErr(err, true, res))
				.then(() => conn.end())
			;
		}
	},
	[config.api.calendar]: {
		'GET': (req, res) =>
		{
			let conn = null;
			return connect(config.db)
				.then(c => {
					conn = c;
					let dateFrom = null, dateTo = null;

					if (!req.query.dateFrom)
						dateFrom = new Date();
					else
						dateFrom = new Date(+req.query.dateFrom);

					if (!req.query.dateTo)
						dateTo = new Date(dateFrom.getTime() + 1000*60*60*24);
					else
						dateTo = new Date(+req.query.dateTo);

					return query(c,
						'SELECT book_date, book_time FROM bookings ' +
						'WHERE book_date >= ? AND book_date < ?',
						[dateToMysql(dateFrom), dateToMysql(dateTo)]
					);
				})
				.then((r, f) =>
				{
					let list = [...r].map(row => ({ date: row.book_date, time: row.book_time }));
					res.json(list);
				})
				.catch(err => handleErr(err, true, res))
				.then(() => conn.end())
			;
		},
		'POST': (req, res) =>
		{
			let conn = null;
			let inn, ogrn, date, time, type, name;
			return connect(config.db)
				.then(c => {
					conn = c;
					inn = req.body.inn;
					ogrn = req.body.ogrn;
					date = new Date(+req.body.date);
					time = req.body.time;
					type = req.body.btype;

					// TODO: check time

					if (inn && ogrn && req.body.date && time && type)
					{
						return query(c,
							'SELECT company_id, name FROM companies WHERE inn = ? AND ogrn = ?',
							[inn, ogrn]
						);
					}
					else
					{
						res.status(422);
						res.json({ error: true, message: 'Not all parameters supplied' });
						return void 0;
					}
				})
				.then((r, f) =>
				{
					if (r)
					{
						if (!r.length)
						{
							res.status(404);
							res.json({ error: true, message: 'Given organization does not exist' });
							return void 0;
						}
						let cid = r[0].company_id;
						name = r[0].name;
						return query(conn,
							'INSERT INTO bookings VALUES (0, ?, ?, ?, ?)',
							[cid, +type, dateToMysql(date), +time]
						);
					}
				})
				.then((r, f) =>
				{
					if (r)
					{
						res.json({ date: date.getTime(), time: +time, name, type: +type });
					}
				})
				.catch(err =>
				{
					if (err.code === 'ER_DUP_ENTRY')
					{
						// duplicate entry in booking table
						res.status(403);
						res.json({ error: true, message: 'This time is already taken!' });
					}
					else
						handleErr(err, true, res)
				})
				.then(() => conn.end())
			;
		}
	},
	[config.api.checkOrg]: {
		'GET': (req, res) =>
		{
			let conn = null;
			let inn = req.query.inn, ogrn = req.query.ogrn;
			if (inn && ogrn)
			{
				return connect(config.db)
					.then(c =>
					{
						conn = c;
						return query(c,
							'SELECT name FROM companies WHERE inn = ? AND ogrn = ?',
							[inn, ogrn]
						);
					})
					.then((r, f) =>
					{
						if (r && r.length)
						{
							res.json({ result: true, name: r[0].name })
						}
						else
						{
							res.json({ result: false });
						}
					})
					.catch(err => handleErr(err, true, res))
					.then(() => conn.end())
				;
			}
		}
	}
};
