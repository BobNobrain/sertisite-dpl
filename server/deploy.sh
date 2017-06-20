cd "$( dirname "${BASH_SOURCE[0]}" )"

if ! [ -d ./static/lib ]; then
	mkdir ./static/lib
fi

cp ./node_modules/date-input-polyfill/date-input-polyfill.dist.js ./static/lib/date.js
