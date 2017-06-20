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

window.addEventListener('load', function ()
{
	window.el = {
		form: elId('book_form'),
		input: {
			inn: elId('org_inn'),
			ogrn: elId('org_ogrn'),
			date: elId('book_date'),
			time: elId('book_time')
		}
	};

	el.form.addEventListener('submit', function ()
	{
		return false;
	});

	elId('temp').innerHTML = getWorkTimes().map(t => '<li>' + t + '</li>').join('');
});

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
