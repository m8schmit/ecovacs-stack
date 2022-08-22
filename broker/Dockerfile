FROM eclipse-mosquitto:openssl

RUN apk update && \
    apk add --no-cache openssl

COPY docker-entrypoint.sh  openssl-config /
