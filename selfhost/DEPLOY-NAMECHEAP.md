# Hosting Bracon on Namecheap (cPanel + Node.js + MySQL)

## 1. Create the database
1. cPanel > **MySQL Databases**: create a database (e.g. `cpuser_bracon`) and a user with a strong password. Add the user to the database with **ALL PRIVILEGES**.
2. cPanel > **phpMyAdmin** > select the database > **Import** > choose `selfhost/mysql-schema.sql` > Go.

## 2. Build the site (on your computer)
Requires Node.js 22+.
```
npm install
SELF_HOST=1 npm run build
```
(Windows PowerShell: `$env:SELF_HOST=1; npm run build`)

This creates a `.output` folder. Zip its contents (`server`, `public`, `nitro.json`) plus `selfhost/app.mjs`.

## 3. Upload
1. cPanel > **File Manager**: create a folder outside `public_html`, e.g. `/home/cpuser/bracon`.
2. Upload and extract the zip there, so you have `bracon/server`, `bracon/public`, `bracon/app.mjs`.

## 4. Create the Node.js app
cPanel > **Setup Node.js App** > Create Application:
- Node.js version: **22** (or newest available, at least 20)
- Application mode: **Production**
- Application root: `bracon`
- Application URL: your domain (e.g. braconwire.com)
- Application startup file: `app.mjs`

Add these **Environment variables**:

| Name | Value |
|---|---|
| `DATABASE_URL` | `mysql://DBUSER:DBPASSWORD@localhost:3306/DBNAME` (URL-encode special characters in the password) |
| `OPENAI_API_KEY` | your key from platform.openai.com |
| `OPENAI_MODEL` | `gpt-6-luna` |
| `CHAT_MONTHLY_LIMIT` | `1000` |
| `GOOGLE_ANALYTICS_MEASUREMENT_ID` | your `G-...` ID |
| `NODE_ENV` | `production` |

Click **Create**, then **Restart**.

## 5. First sign-in
Open `https://yourdomain/auth`, choose "New staff member? Create an account". The first account becomes the administrator. Later accounts appear under **Staff** in the dashboard for you to approve.

## 6. HTTPS
cPanel > **SSL/TLS Status** > Run AutoSSL. Staff sign-in cookies require HTTPS.

## Updating the site later
Rebuild with `SELF_HOST=1 npm run build`, re-upload `server` and `public`, then click **Restart** in Setup Node.js App.

## Notes
- If the assistant shows a model error, check the model name is available on your OpenAI account; change `OPENAI_MODEL` and restart.
- The monthly assistant limit resets on the 1st of each month (UTC).
