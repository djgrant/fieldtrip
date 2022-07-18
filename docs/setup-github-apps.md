# Set Up Github Apps

Four Github apps are required for Fieldwork to work. One root app handles authentication and repo level events. The other three apps are the bots used in courses.

## 1. Preparation

- Complete steps 1 and 2 of [setup](setup.md)
- Generate secrets for each Github app and add to your `.env`

## 2. Creation

Create four GitHub Apps at https://github.com/settings/apps/new.

Where a variable substituion is declared (e.g. `{SERVER_HOST}/auth/login/cb`) use the values from your `.env`.

### Config: All Github Apps

- **_Github App Name_**: `{GH_APP[i]_NAME}` as a title e.g.`fieldwork-amber-dev` becomes `Fieldwork Amber (Dev)`
- **_Homepage URL_**: `{ROOT_DOMAIN}`
- **_Webhook URL_**: A webhook proxy created at https://smee.io/new (one for each Github App)
- Select **_Redirect on update_**

### Config: Github App 1

- Select **_Add Callback Url_**
- Select **_Request user authorization (OAuth) during installation_**
- **_Callback URL_**: `{SERVER_HOST}/auth/login/cb`

Add the permissions:

- `Read/Write: Administration`
- `Read/Write: Commit statuses`
- `Read/Write: Deployments`
- `Read/Write: Issues`
- `Read/Write: Pages`
- `Read/Write: Projects`
- `Read/Write: Pull Requests`
- `Read/Write: Workflows`

Subscribe to all events _except_:

- `Merge Queue Entry`
- `Star`
- `Security Advisory`
- `Watch`

### Config: Github Apps 2-4

- **_Setup URL_**: `{SERVER_HOST}/auth/install/amber/cb`

Add the permissions:

- `Read/Write: Issues`
- `Read/Write: Projects`
- `Read/Write: Pull Requests`

Subscribe to all events _except_:

- `Merge Queue Entry`
- `Repository`
- `Star`
- `Security Advisory`
- `Watch`

### Private Key

After creating each Github App, click the button to generate a private key.

## 4. Environment Variables

Add each app's private key to your `.env` as a single string. You will need to replace any line breaks with `\n`.

Once each Github App is created, you will be be able to access the app ID and client ID. Add these to your `.env`.

You should now have the following values set in your `.env`:

- `GH_APP[i]_ID`
- `GH_APP[i]_CLIENT_ID`
- `GH_APP[i]_CLIENT_SECRET`
- `GH_APP[i]_WEBHOOK_PROXY_URL`
- `GH_APP[i]_WEBHOOK_SECRET`
- `GH_APP[i]_PRIVATE_KEY`
