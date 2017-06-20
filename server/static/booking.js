window.addEventListener('load', function ()
{
	window.el = {
		form: elId('book_form'),
		input: {
			inn: elId('org_inn'),
			ogrn: elId('org_ogrn'),
			date: elId('book_date'),
			times: elId('times_pan')
		}
	};

	el.form.addEventListener('submit', function ()
	{
		return false;
	});

	var d = new Date();
	var c = getCalendar(d, [[],[],[],[],[]]);
	el.input.times.innerHTML = '';
	appendContent(el.input.times, c.render());
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

function BookingDay(date, booked)
{
	this.date = date;
	this.times = getWorkTimes();
	for (var i = 0; i < this.times.length; i++)
	{
		this.times[i] = { id: i+1, time: this.times[i], booked: false };
		if (booked.indexOf(i+1) !== -1)
			this.times[i].booked = true;
	}
}
BookingDay.prototype.render = function ()
{
	var timeEls = [];
	for (var i = 0; i < this.times.length; i++)
	{
		timeEls[i] = dom(
			'li',
			{
				'class': this.times[i].booked? 'booked': 'free'
			},
			dom(
				'a',
				{
					onclick: 'onTimeClicked(this)',
					'data-id': this.times[i].id
				},
				this.times[i].time
			)
		);
	}
	var dateString = dateStringify(this.date);
	var we = this.isWeekend()? '' : ' weekend';

	return dom(
		'div',
		{
			'class': 'booking-day'
		},
		[
			dom('div', { 'class': 'head' + we }, dateString),
			dom('div', { 'class': 'body' + we }, dom(
				'ul', {},
				timeEls
			))
		]
	);
};
BookingDay.prototype.isWeekend = function () { return this.date.getDay() % 6 === 0 };

function getCalendar(d, bookeds)
{
	var result = {};
	var day = 1000 * 60 * 60 * 24;
	result['-2'] = new BookingDay(new Date(d.getTime() - 2*day), bookeds[0]);
	result['-1'] = new BookingDay(new Date(d.getTime() -   day), bookeds[1]);
	result['0']  = new BookingDay(new Date(d.getTime()        ), bookeds[2]);
	result['1']  = new BookingDay(new Date(d.getTime() +   day), bookeds[3]);
	result['2']  = new BookingDay(new Date(d.getTime() + 2*day), bookeds[4]);
	result.render = function ()
	{
		return [
			this['-2'].render(),
			this['-1'].render(),
			this['0'] .render(),
			this['1'] .render(),
			this['2'] .render()
		];
	};
	return result;
}
