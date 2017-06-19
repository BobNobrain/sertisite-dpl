FROM mysql:8
ADD files/* /tmp/
ENV MYSQL_ALLOW_EMPTY_PASSWORD="yes"
RUN /tmp/init_db
EXPOSE 3306
ENTRYPOINT /tmp/run_db
