# Full CMS + Application Tracker (Single Google Sheet)

This powers:
- Full site content (CMS JSON)
- Section visibility toggles
- Application tracker rows

## 1) Google Sheet structure
Use your sheet:
`https://docs.google.com/spreadsheets/d/1JAPlW_bCWW25NQMZN8DeY0QMedq1G18CLzcCMW0nt40/edit`

Create two tabs:

### Tab 1: `CMS`
Row 1:
```
CMS_JSON
```
Row 2:
```
{ "hero": { "subtitle": "..." } }
```

### Tab 2: `Applications`
Row 1:
```
Timestamp | Company | Role | Link | Status | Applied Date | Follow-up Date | Notes
```

## 2) Apps Script (Web App)
Extensions → Apps Script, paste:

```javascript
function doGet(e) {
  const mode = (e.parameter && e.parameter.mode) || "cms_read";
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (mode === "cms_read") {
    const sheet = ss.getSheetByName("CMS");
    const raw = sheet ? sheet.getRange(2, 1).getValue() : "{}";
    let cms = {};
    try { cms = raw ? JSON.parse(raw) : {}; } catch (e) {}
    return ContentService.createTextOutput(JSON.stringify({ cms }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (mode === "tracker_read") {
    const sheet = ss.getSheetByName("Applications");
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ rows: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const data = sheet.getDataRange().getValues();
    const rows = data.slice(1).map(r => ({
      timestamp: r[0],
      company: r[1],
      role: r[2],
      link: r[3],
      status: r[4],
      appliedDate: r[5],
      followUpDate: r[6],
      notes: r[7]
    }));
    return ContentService.createTextOutput(JSON.stringify({ rows }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ error: "invalid mode" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const isJson = e.postData && e.postData.type === "application/json";
  const body = isJson ? JSON.parse(e.postData.contents || "{}") : (e.parameter || {});
  const mode = body.mode || "tracker_append";

  if (mode === "cms_write") {
    const sheet = ss.getSheetByName("CMS");
    if (!sheet) throw new Error("CMS sheet missing");
    sheet.getRange(2, 1).setValue(JSON.stringify(body.cms || {}));
    return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (mode === "tracker_append") {
    const sheet = ss.getSheetByName("Applications");
    if (!sheet) throw new Error("Applications sheet missing");
    sheet.appendRow([
      body.timestamp || new Date().toISOString(),
      body.company || "",
      body.role || "",
      body.link || "",
      body.status || "",
      body.appliedDate || "",
      body.followUpDate || "",
      body.notes || ""
    ]);
    return ContentService.createTextOutput("ok")
      .setMimeType(ContentService.MimeType.TEXT);
  }

  return ContentService.createTextOutput(JSON.stringify({ error: "invalid mode" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Deploy as **Web App**:
- Execute as: **Me**
- Who has access: **Anyone**

Copy the Web App URL (ends with `/exec`).

## 3) Update the site
In `script.js`:

```
const CMS_ENDPOINT = 'YOUR_WEB_APP_URL';
```

This single endpoint powers:
- CMS read/write
- Tracker add rows
- Tracker dashboard
