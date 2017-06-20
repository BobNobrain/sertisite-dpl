window.addEventListener('load', function ()
{
	window.el = {
		form: elId('book_form'),
		input: {
			inn: elId('org_inn'),
			ogrn: elId('org_ogrn'),
			date: elId('book_date'),
			times: elId('times_pan'),
			type: elId('book_type')
		},
		submit: elId('submit_book'),
		prevDate: elId('prev_btn'),
		nextDate: elId('next_btn')
	};
	window.selectedTime = null;
	window.currentDate = null;

	el.form.addEventListener('submit', function (ev)
	{
		ev.preventDefault();
		ev.defaultPrevented = true;
		if (checkForm())
			sendRequest();
		return false;
	});

	el.input.date.addEventListener('change', function ()
	{
		var nval = new Date(el.input.date.valueAsDate.getTime() - 1000*60*60*24);
		if (isDateInPast(nval))
		{
			el.input.date.valueAsDate = new Date();
		}
		updateDay();
	});

	el.input.date.valueAsDate = new Date();
	el.input.date.setAttribute('min', new Date().toISOString().split('T')[0]);
	updateDay();

	el.input.inn.addEventListener('change', checkInn);
	el.input.ogrn.addEventListener('change', checkOgrn);

	el.prevDate.addEventListener('click', function ()
	{
		var nval = new Date(el.input.date.valueAsDate.getTime() - 1000*60*60*24);
		if (isDateInPast(nval)) return true;
		el.input.date.valueAsDate = nval;
		updateDay();
	});
	el.nextDate.addEventListener('click', function ()
	{
		var nval = new Date(el.input.date.valueAsDate.getTime() + 1000*60*60*24);
		// if (isDateInPast(nval)) return true;
		el.input.date.valueAsDate = nval;
		updateDay();
	});

	tryUpdateTypes();
});

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
				'class': this.times[i].booked? 'booked': 'free',
				onclick: 'window.onTimeClicked(this)',
				'data-id': this.times[i].id
			},
			this.times[i].time
		);
	}
	var dateString = dateStringify(this.date);
	var we = this.isWeekend()? ' weekend' : '';
	if (this.isWeekend())
		dateString += '(выходной)';

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
BookingDay.prototype.getTimeById = function (id)
{
	for (var i = 0; i < this.times.length; i++)
		if (this.times[i].id === id)
			return this.times[i];
	return null;
};

function onTimeClicked(li)
{
	if (window.currentDate === null) return;
	var id = +li.getAttribute('data-id');
	if (window.currentDate.getTimeById(id).booked) return;
	if (window.currentDate.isWeekend()) return;
	if (window.selectedTime !== null)
	{
		window.selectedTime.li.classList.remove('selected');
	}
	window.selectedTime = { id: id, li: li, date: window.currentDate.date };
	li.classList.add('selected');
}

function updateDay()
{
	var d = el.input.date.valueAsDate;
	xhr('GET', '/api/cal', {
		dateFrom: d.getTime()
	})
		.done(function (result)
		{
			var booked = [];
			for (var i = 0; i < result.length; i++)
			{
				var r = result[i];
				var rd = new Date(r.date);
				if (rd.getMonth() === d.getMonth() &&
					rd.getDate() === d.getDate() &&
					d.getFullYear() === rd.getFullYear())
				{
					booked.push(r.time);
				}
			}
			var bd = new BookingDay(d, booked);
			el.input.times.innerHTML = '';
			appendContent(el.input.times, bd.render());
			window.currentDate = bd;
		})
		.fail(function (code)
		{
			if (code === 0)
				alert('Нет соединения с сервером!');
			else
				alert('Ошибка: ' + code.message);
		})
	;
}

function checkForm()
{
	if (!window.currentDate) return false;
	if (!window.selectedTime)
	{
		alert('Укажите время записи!');
		return false;
	}
	if (isTimeInPast(window.selectedTime.date, window.selectedTime.id))
		return false;

	return !el.input.inn.validity.customError && !el.input.ogrn.validity.customError;
}

function checkInn()
{
	var inn = el.input.inn.value;
	if (inn.length < 10 || inn.length > 12)
		el.input.inn.setCustomValidity('Неверное значение ИНН');
	else
		el.input.inn.setCustomValidity('');
}
function checkOgrn()
{
	var ogrn = el.input.ogrn.value;
	if (ogrn.length !== 13)
		el.input.ogrn.setCustomValidity('Неверное значение ОГРН');
	else
		el.input.ogrn.setCustomValidity('');
}

function sendRequest()
{
	var inn = el.input.inn.value;
	var ogrn = el.input.ogrn.value;
	var time = +window.selectedTime.id;
	var date = el.input.date.valueAsDate.getTime();
	var type = +el.input.type.value;
	var payload = {
		inn: inn,
		ogrn: ogrn,
		time: time,
		date: date,
		btype: type
	};

	xhr('POST', '/api/cal', payload)
		.done(function (result)
		{
			alert('Успешная запись компании ' + result.name + '!');
			window.selectedTime = null;
			updateDay();
		})
		.fail(function (code)
		{
			if (code === 0)
				alert('Нет соединения с сервером!');
			else
				alert('Ошибка: ' + code.message);
		})
	;
}

function tryUpdateTypes()
{
	if (!window.el) return;
	if (!window.typesList) return;

	window.el.input.type.innerHTML = '';
	for (var i = 0; i < window.typesList.length; i++)
	{
		window.el.input.type.appendChild(dom(
			'option',
			{ value: window.typesList[i].type_id },
			typesList[i].type
		));
	}
}

xhr('GET', '/api/types', {})
	.done(function (result)
	{
		window.typesList = result;
		tryUpdateTypes();
	})
	.fail(function (code)
	{
		if (code === 0)
			alert('Нет соединения с сервером!');
		else
			alert('Ошибка: ' + code.message);
	})
;

function isDateInPast(date)
{
	return isTimeInPast(date, 0);
}

function isTimeInPast(date, timeId)
{
	// TODO
	var n = new Date();
	if (date.getTime() < n.getTime())
	{
		// today or past?
		if (date.getDate() === n.getDate() &&
			date.getMonth() === n.getMonth() &&
			date.getFullYear() === n.getFullYear())
		{
			// today
			var hour = 60*60*1000;
			var time = (timeId - 1 + 8) * hour;
			if (time > 12 * hour) // мужчина, вы не видите, у нас обед!
				time += hour;

			time += date.getTime();
			if (time <= n.getTime())
				return true; // today, but in the past
			else
				return false;
		}
		else
		{
			// in the past
			return true;
		}
	}
	else
	{
		return false;
	}
}
