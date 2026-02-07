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
const ADMIN_PASSWORD = "CHANGE_ME";

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
  if (body.password !== ADMIN_PASSWORD) {
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
