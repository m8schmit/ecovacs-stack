#!/bin/ash
set -e

# this should execute every time as repo does provide ssl.crt and ssl.key files but not chain nor ca
#~ if [ ! -f ./ssl.crt ]; then
	echo "Generate Certificates" 

  BASE_URLS=$(env | grep -P "^BASE_URL(_\d\d)?\=")
  for base_url in $BASE_URLS; do
    domain=$(echo $base_url | cut -d "=" -f 2)
  echo here $domain
    echo "127.0.0.1 ${domain:8}" | sudo tee -a /etc/hosts
    domains_list="$domains_list ${domain:8}"
  done

  rm -f ./ssl.crt ./ssl.key
  mkcert -cert-file  ./ssl.crt -key-file  ./ssl.key $domains_list
  mkcert -install
# hacky hack to make node happy...
  cat ./ssl.crt "$(mkcert -CAROOT)/rootCA.pem" > chain.pem
  cp "$(mkcert -CAROOT)"/rootCA.pem .
  
#~ fi
