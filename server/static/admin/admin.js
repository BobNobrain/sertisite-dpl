window.addEventListener('load', function ()
{
	window.el = {
		tbody: elId('booking_tbody'),
		dateFrom: elId('date_from'),
		dateTo: elId('date_to')
	};
	el.dateFrom.valueAsDate = new Date();
	el.dateTo.valueAsDate = new Date(new Date().getTime() + 1000*60*60*24);

	el.dateFrom.addEventListener('change', function ()
	{
		var from = el.dateFrom.valueAsNumber;
		var to = el.dateTo.valueAsNumber;
		if (to <= from)
		{
			el.dateTo.valueAsNumber = from + 1000*60*60*24;
		}
		loadData();
	});
	el.dateTo.addEventListener('change', function ()
	{
		var from = el.dateFrom.valueAsNumber;
		var to = el.dateTo.valueAsNumber;
		if (to <= from)
		{
			el.dateFrom.valueAsNumber = to - 1000*60*60*24;
		}
		loadData();
	});

	tryRenderTable();
});

function loadData()
{
	var from, to;
	if (window.el)
	{
		from = el.dateFrom.valueAsDate;
		to = el.dateTo.valueAsDate;
	}
	else
	{
		from = new Date();
		to = new Date(from.getTime() + 1000*60*60*24);
	}

	xhr('GET', '/api/admin/ls', { dateFrom: from.getTime(), dateTo: to.getTime() })
		.done(function (result)
		{
			window.data = result;
			tryRenderTable();
		})
		.fail(function(code)
		{
			if (code === 0)
				alert('Невозможно соединиться с сервером');
			else
				alert('Ошибка! ' + code.message);
		})
	;
}
loadData();
window.times = getWorkTimes();

function Row(data)
{
	this.inn = data.inn;
	this.ogrn = data.ogrn;
	this.name = data.name;
	this.typeId = data.type_id;
	this.type = data.type;
	this.time = data.time;
	this.date = new Date(data.date);
}
Row.prototype.render = function ()
{
	return dom(
		'tr',{},
		[
			dom('td', {}, dateStringify(this.date)),
			dom('td', {}, window.times[this.time - 1]),
			dom('td', {}, this.inn),
			dom('td', {}, this.ogrn),
			dom('td', {}, this.name),
			dom('td', {}, this.type)
		]
	)
};

function tryRenderTable()
{
	if (!window.el) return;
	if (!window.data) return;

	window.el.tbody.innerHTML = '';
	var row;

	for (var i = 0; i < window.data.length; i++)
	{
		row = new Row(window.data[i]);
		window.el.tbody.appendChild(row.render());
	}
}
