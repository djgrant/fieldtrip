# Local Setup

Creating your own development environment requires a fair bit of set up.

## 1. Environment

```sh
cp .env.example .env
cp apps/client/.env.local.example .env.local
```

## 2. Tunnels

To work with Github apps you will need two tunnels to proxy Github HTTP requests to the client and server.

Follow the instructions in [setup-tunnel.md](setup-tunnel.md).

## 3. Github Apps

Follow the instructsion in [setup-github-apps.md](setup-github-apps.md).

## 4. Database

Create a local Postgres database and add the connection string to .env

```
DATABASE_URL="postgres://<user>@localhost:5432/fieldwork"
```

## 5. Install

```sh
npm install
```

## 6. Run

```sh
npm run dev
```
