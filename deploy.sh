echo ":: Creating container ::"
docker run --name site-db -d bobnobrain/sertisite-db
docker pause site-db
