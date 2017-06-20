function dom(tagName, options, content)
{
	var result = document.createElement(tagName);
	if (options && typeof options === typeof {})
	{
		for (var key in options)
		{
			if (!options.hasOwnProperty(key)) continue;
			result.setAttribute(key, options[key].toString());
		}
	}
	if (content)
	{
		appendContent(result, content);
	}
	return result;
}
function appendContent(el, content)
{
	if (typeof content === typeof '')
		el.innerHTML = content;
	else if (content instanceof HTMLElement)
		el.appendChild(content);
	else if (Array.isArray(content))
		content.forEach(function (c) { appendContent(el, c); });
}
function elId(id) { return document.getElementById(id); }

function padZero(n) { return (+n < 10)? '0' + n : '' + n }

function dateStringify(d)
{
	var day = 'ВС ПН ВТ СР ЧТ ПТ СБ'.split(' ')[d.getDay()];
	return day + ' ' + [padZero(d.getDate()), padZero(d.getMonth() + 1), d.getFullYear()].join('.');
}

function getWorkTimes()
{
	var a = new Array(4 * 8); // every 15 minutes, every of 8 work hours
	for (var i = 0; i < a.length; i++)
	{
		var h = 8 + Math.floor(i / 4);
		if (h > 11) h += 1;
		if (h < 10) h = '0' + h;
		var m = 15 * (i % 4);
		if (m === 0) m = '00';
		a[i] = h + ':' + m;
	}
	return a;
}

function xhr(method, url, data)
{
	var x = new XMLHttpRequest();
	if (method === 'GET' && typeof data === typeof {} && data !== null)
	{
		var params = [];
		for (var key in data)
		{
			if (!data.hasOwnProperty(key)) continue;
			params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
		}
		url += '?' + params.join('&');
		data = null;
	}
	x.open(method, url, true);
	if (method !== 'GET')
	{
		x.setRequestHeader('Content-Type', 'application/json');
		x.send(JSON.stringify(data));
	}
	else
		x.send(null);

	var cbs = { err: [], succ: [] };

	x.onreadystatechange = function ()
	{
		if (x.readyState !== 4) return;
		if (x.status === 0)
			cbs.err.forEach(function (cb) { cb(0); });
		else if (x.status >= 200 && x.status < 300)
			cbs.succ.forEach(function (cb) { cb(JSON.parse(x.responseText)); });
		else
			cbs.err.forEach(function (cb) { cb(JSON.parse(x.responseText)); });
	};

	var r = {
		done: function (cb)
		{
			cbs.succ.push(cb);
			return r;
		},
		fail: function (cb)
		{
			cbs.err.push(cb);
			return r;
		}
	};
	return r;
}
