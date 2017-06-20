cd "$( dirname "${BASH_SOURCE[0]}" )"

if ! [ -d ./static/lib ]; then
	mkdir ./static/lib
fi

cp ./node_modules/date-input-polyfill/date-input-polyfill.dist.js ./static/lib/date.js

cd ./static/lib

deps=("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" \
)

if [[ "$1." == "--force." ]]; then
    rm ".gitignore" 2> /dev/null
fi

for dep in ${deps[@]}; do
    fname=$(echo "$dep" | grep -oE '[^/]+$')
    if [[ "$1." == "--force." ]]; then
        rm "$fname" 2> /dev/null
    fi
    if ! [[ -e "$fname" ]]; then
        echo "Loading: " "$fname"
        wget "$dep"
        echo "$fname" >> ./.gitignore
    else
        echo "$fname" "already exists"
    fi
done
