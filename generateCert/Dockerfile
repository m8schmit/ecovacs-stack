FROM alpine:3.15 as cert-generation

RUN apk update && \
    apk add --no-cache openssl

COPY generate-cert.sh  openssl-config /

RUN chmod +x generate-cert.sh
