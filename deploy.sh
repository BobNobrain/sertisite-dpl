#!/bin/bash

cd "$( dirname "${BASH_SOURCE[0]}" )"

echo ':: Reading DB configuration ::'
if [ -f 'config.sh' ]; then
	source config.sh
else
	echo '[WARNING (deploy.sh)]: No config.sh found! Using example config.sh.example (this may cause errors)'
	source config.sh.example
fi

echo ':: Running MySQL ::'
docker run --name site-db \
	-e "DBUSER=${sitedb_user}" \
	-e "DBPASS=${sitedb_password}" \
	-d bobnobrain/sertisite-db
sleep 1
# docker run -it --link site-db:mysql \
# 	mysql sh -c 'exec mysql -h"$MYSQL_PORT_3306_TCP_ADDR" -P"$MYSQL_PORT_3306_TCP_PORT" -u site -p"123123"'

sitedb_ip=`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' site-db`

echo ":: MySQL running at ${sitedb_ip}:3306 ::"
echo ':: Running node ::'
docker run --name site-server \
	-e "DBIP=${sitedb_ip}" \
	-e "DBUSER=${sitedb_user}" \
	-e "DBPASS=${sitedb_password}" \
	--link site-db:mysql \
	-d bobnobrain/sertisite-server

siteserver_ip=`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' site-server`
echo ":: Server should be up at ${siteserver_ip}:1337 now ::"
