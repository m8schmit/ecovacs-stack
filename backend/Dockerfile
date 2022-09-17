FROM node:lts-alpine
RUN apk  --no-cache add bash curl wget build-base g++ cairo-dev jpeg-dev pango-dev giflib-dev --upgrade grep --update sudo

RUN echo "node ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/node \
        && chmod 0440 /etc/sudoers.d/node

RUN curl -s https://api.github.com/repos/FiloSottile/mkcert/releases/latest | grep browser_download_url  | grep linux-amd64 | cut -d '"' -f 4 | wget -qi -
RUN mv mkcert-v*-linux-amd64 mkcert
RUN chmod a+x mkcert
RUN mv mkcert /usr/local/bin
USER node
RUN mkcert -install
ENV NODE_EXTRA_CA_CERTS="/home/node/.local/share/mkcert/rootCA.pem"

WORKDIR /opt/app
