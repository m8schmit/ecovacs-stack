FROM alpine:latest

RUN apk update && \
    apk add --no-cache openssl

COPY generate-cert.sh  openssl-config /

RUN chmod +x generate-cert.sh
