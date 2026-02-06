# Contact Form -> Google Sheets (Free)

This setup keeps your custom form UI and stores submissions in Google Sheets.

## Step 1: Create a Google Sheet
1. Create a new Google Sheet named `Portfolio Contact`.
2. Add headers in row 1:
   - Name | Email | Subject | Message | Timestamp

## Step 2: Create Apps Script
1. In the Sheet, go to Extensions -> Apps Script.
2. Replace the code with the following:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = e.parameter;

    sheet.appendRow([
      data.name || "",
      data.email || "",
      data.subject || "",
      data.message || "",
      data.timestamp || new Date().toISOString()
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 3: Deploy as Web App
1. Click Deploy -> New deployment.
2. Select type: Web App.
3. Execute as: `Me`.
4. Who has access: `Anyone`.
5. Click Deploy.
6. Copy the Web App URL.

## Step 4: Add Endpoint to Portfolio
Update this line in `script.js`:

```
const CONTACT_FORM_ENDPOINT = 'PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
```

Replace the placeholder with your Web App URL.

## Test
Open the site, submit the contact form, and check the Google Sheet.
