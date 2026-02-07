# Application Tracker Setup (Google Sheets)

This adds a simple form endpoint that appends rows to your tracker sheet.

## 1) Create a Google Sheet
Create a sheet named `Applications` with these header columns in row 1:

```
Timestamp | Company | Role | Link | Status | Applied Date | Follow-up Date | Notes
```

## 2) Apps Script (Web App)
Open Extensions → Apps Script and paste:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Applications');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    }
    var data = e.parameter || {};
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.company || '',
      data.role || '',
      data.link || '',
      data.status || '',
      data.appliedDate || '',
      data.followUpDate || '',
      data.notes || ''
    ]);
    return ContentService
      .createTextOutput('ok')
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService
      .createTextOutput('error')
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
```

Deploy as **Web App**:
- Execute as: **Me**
- Who has access: **Anyone**

Copy the Web App URL and paste it in `script.js`:

```
const TRACKER_FORM_ENDPOINT = 'PASTE_TRACKER_ENDPOINT_HERE';
```

## 3) Test
Open the site, click **Apply Now**, fill the form, and confirm a new row appears.
