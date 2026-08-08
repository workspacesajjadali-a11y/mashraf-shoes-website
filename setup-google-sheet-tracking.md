# Order Tracking Setup — Google Sheet + SheetDB

## Part A — Create the Google Sheet

1. Go to sheets.google.com → Blank spreadsheet
2. Rename it: "M Ashraf Shoes Orders"
3. In Row 1, type these exact column headers (one per cell, left to right):

   OrderID | Date | CustomerName | Phone | Address | Product | Color | Size | Price | DeliveryCharge | PaymentMethod | Status

4. Leave everything else blank — the website will add new rows automatically once connected.

## Part B — Connect it with SheetDB (free, turns your sheet into an API)

1. Go to sheetdb.io → Sign up (free plan is enough to start)
2. Click "Create new API" → Connect to Google Sheets → choose "M Ashraf Shoes Orders"
3. Once connected, SheetDB gives you a URL that looks like:
   `https://sheetdb.io/api/v1/xxxxxxxxxxxxx`
4. **Copy that URL and send it to me** — I'll wire it into the checkout and tracking pages.

## Part C — How you'll manage orders day to day

- New orders appear automatically as new rows in your sheet
- To update status: just click the "Status" cell for that order and type "Processing", "Shipped", or "Delivered"
- Customers checking their order will see whatever you typed there, live
