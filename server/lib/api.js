const e = require('http-errors');

const makeApiHelper = (app, urlRegex, fns, method) =>
{
	if (typeof fns[method] === typeof eval)
	{
		app[method.toLowerCase()](urlRegex, (req, res, next) =>
		{
			try
			{
				let result = fns[method](req, res);
				// if (result)
				// 	res.json(result);
			}
			catch (err)
			{
				if (err instanceof e.HttpError)
					next(err);
				else
					next(e(500, 'Internal Server Error'));
			}
		});
	}
};
const makeApi = (app, root, obj) =>
{
	for (let key in obj)
	{
		if (!obj.hasOwnProperty(key)) continue;
		let fns = obj[key];
		makeApiHelper(app, root + key, fns, 'GET');
		makeApiHelper(app, root + key, fns, 'POST');
		makeApiHelper(app, root + key, fns, 'PUT');
		makeApiHelper(app, root + key, fns, 'DELETE');
		makeApiHelper(app, root + key, fns, 'ALL');
	}
};

module.exports = makeApi;
