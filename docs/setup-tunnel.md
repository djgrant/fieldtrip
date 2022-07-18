# Set Up Cloudflare Tunnels

The Fieldwork session model requires that the environment variables `SERVER_HOST` and `CLIENT_HOST` are subdomains of `ROOT_DOMAIN`.

These domains, and therefore any tunnels created to redirect traffic to them, must be a custom domain as domains like ngrok.io appear in https://publicsuffix.org/list/public_suffix_list.dat which prevents browsers from sharing cookies between them.

## 1. Install Cloudflared

https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/#set-up-a-tunnel-locally-cli-setup

```sh
cloudflared login
```

And connect to your testing domain. This will create a cert and private key in `~/.cloudflared/cert.pem`.

Note: when this cert.pem is present, all cloudfared commands will related to the domain you selected for this step.

## 2. Create Tunnels

Create two tunnels, where `<scope>` is an identifier known only to you.

```sh
cloudflared tunnel create <scope>-fieldwork
cloudflared tunnel create <scope>-fieldwork-api
```

This creates a credentials files in `~/.cloudflared`. Copy these credentials to a `.cloudflared` directory in the repo (this is .gitignored).

```sh
cp ~/.cloudflared/<client_tunnel_id>.json .cloudflared/credentials.client.json
cp ~/.cloudflared/<server_tunnel_id>.json .cloudflared/credentials.server.json
```

## 3. Create Tunnel Routes

```sh
cloudflared tunnel route dns <client tunnel name/id> fieldwork.<scope>.testingdomain.com
cloudflared tunnel route dns <server tunnel name/id> api.fieldwork.<scope>.testingdomain.com
```

## 4. Add Environment Variables

In `.env` add the routes you created:

```
SERVER_HOST=https://api.fieldwork.<scope>.testingdomain.com
CLIENT_SERVER_HOST=https://fieldwork.<scope>.testingdomain.com
ROOT_DOMAIN=<scope>.testingdomain.com
```

In `apps/client/.env.local` add:

```
REACT_APP_SERVER_URL="https://api.fieldwork.<scope>.testingdomain.com"
```
