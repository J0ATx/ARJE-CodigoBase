FROM mysql:8.0

# Set environment variables
ENV MYSQL_DATABASE=lostrestanosdb
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_USER=arje_user
ENV MYSQL_PASSWORD=arje_password

# Copy SQL files
COPY *.sql /docker-entrypoint-initdb.d/

# Set default charset and collation
RUN echo "[mysqld]" >> /etc/mysql/conf.d/docker.cnf \
    && echo "character-set-server=utf8mb4" >> /etc/mysql/conf.d/docker.cnf \
    && echo "collation-server=utf8mb4_unicode_ci" >> /etc/mysql/conf.d/docker.cnf

EXPOSE 3306
