FROM postgres:latest
RUN usermod -u 1000 postgres
COPY init.sql /docker-entrypoint-initdb.d/init.sql
