# Tech Journal -> Google Sheets (Shared for All Visitors)

This setup lets you edit Tech Journal posts on the site and save them for everyone.

## Step 1: Create a Google Sheet
Create a new sheet named `Tech Journal`.
Put this header in row 1:

```
PostsJSON
```

## Step 2: Apps Script
Extensions -> Apps Script, paste:

```javascript
const ADMIN_ID = "singhutsav555@gmail.com";
const ADMIN_PASSWORD = "SET_IN_APPS_SCRIPT";

function doGet(e) {
  const mode = (e.parameter && e.parameter.mode) || "read";
  if (mode !== "read") {
    return ContentService.createTextOutput(JSON.stringify({ error: "invalid mode" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const value = sheet.getRange(2, 1).getValue();
  const posts = value ? JSON.parse(value) : [];
  return ContentService.createTextOutput(JSON.stringify({ posts }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  const mode = body.mode || "write";

  if (mode === "request_otp") {
    if ((body.adminId || "").toLowerCase() !== ADMIN_ID.toLowerCase()) {
      return ContentService.createTextOutput(JSON.stringify({ error: "unauthorized" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const props = PropertiesService.getScriptProperties();
    props.setProperty("otp_code", otp);
    props.setProperty("otp_expires", (Date.now() + 5 * 60 * 1000).toString());
    MailApp.sendEmail(ADMIN_ID, "Your OTP Code", "OTP: " + otp + " (valid 5 minutes)");
    return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (mode === "verify_otp") {
    const props = PropertiesService.getScriptProperties();
    const code = props.getProperty("otp_code");
    const exp = Number(props.getProperty("otp_expires") || "0");
    if (Date.now() > exp) {
      return ContentService.createTextOutput(JSON.stringify({ status: "expired" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if ((body.code || "") === code) {
      const token = Utilities.getUuid();
      props.setProperty("otp_token", token);
      props.setProperty("otp_token_expires", (Date.now() + 60 * 60 * 1000).toString());
      return ContentService.createTextOutput(JSON.stringify({ status: "ok", token }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "invalid" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const token = body.token || "";
  const storedToken = PropertiesService.getScriptProperties().getProperty("otp_token") || "";
  const tokenExp = Number(PropertiesService.getScriptProperties().getProperty("otp_token_expires") || "0");
  const tokenValid = token && token === storedToken && Date.now() < tokenExp;

  if (body.password !== ADMIN_PASSWORD && !tokenValid) {
    return ContentService.createTextOutput(JSON.stringify({ error: "unauthorized" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(2, 1).setValue(JSON.stringify(body.posts || []));
  return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Step 3: Deploy Web App
Deploy -> New deployment -> Web App
- Execute as: Me
- Who has access: Anyone

Copy the Web App URL (ends with `/exec`).

## Step 4: Update Portfolio
In `script.js`, set:

```
const JOURNAL_ENDPOINT = 'YOUR_WEB_APP_URL';
const JOURNAL_ADMIN_PASSWORD = 'YOUR_PASSWORD';
```

## How to Edit Posts
Open your site with `?admin=1` in the URL and click **Manage Posts**.
```
https://your-site.netlify.app/?admin=1
```
