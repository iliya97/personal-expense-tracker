# Expense Tracker

Automated personal expense tracker that reads transaction receipts from Gmail, extracts spending data, and records it in Google Sheets with an analytics dashboard.

## How It Works

```
Gmail (receipts & notifications)
        │
        ▼
Google Apps Script (time-triggered every 15 min)
        │
        ├── Search for unread receipt emails
        ├── Parse amount, merchant, category, date
        ├── (Optional) Gemini AI fallback for unrecognized formats
        │
        ▼
Google Sheets (structured expense log)
        │
        ▼
Dashboard (Sheets Charts / Looker Studio)
```

## Supported Services

| Service | Type | Email Format |
|---------|------|-------------|
| Grab | Food delivery, transport | HTML template |
| Shopee | E-commerce | HTML template |
| Foodpanda | Food delivery | HTML template |
| Atome | Buy-now-pay-later | HTML template |
| Bank notifications | Transactions (Maybank, CIMB, etc.) | Plain text / HTML |
| Subscriptions | Recurring charges (Spotify, Netflix, etc.) | HTML template |

## Tech Stack

| Component | Tool | Cost |
|-----------|------|------|
| Email reading | Google Apps Script (GmailApp) | Free |
| Data parsing | Regex + HTML parsing in Apps Script | Free |
| AI fallback parser | Gemini API (free tier) | Free |
| Storage | Google Sheets | Free |
| Dashboard | Google Sheets Charts / Looker Studio | Free |
| Scheduler | Apps Script time-driven triggers | Free |

**Total cost: $0/month**

## Project Structure

```
expense-tracker/
├── README.md
├── IMPLEMENTATION_PLAN.md
├── src/
│   ├── main.gs                 # Entry point, trigger setup
│   ├── gmail-reader.gs         # Gmail search and email fetching
│   ├── parsers/
│   │   ├── grab.gs             # Grab receipt parser
│   │   ├── shopee.gs           # Shopee receipt parser
│   │   ├── foodpanda.gs        # Foodpanda receipt parser
│   │   ├── atome.gs            # Atome receipt parser
│   │   ├── bank.gs             # Bank notification parser
│   │   └── subscriptions.gs    # Subscription receipt parser
│   ├── sheets-writer.gs        # Google Sheets insert/update logic
│   ├── categorizer.gs          # Merchant-to-category mapping
│   ├── gemini-parser.gs        # Gemini AI fallback parser
│   └── utils.gs                # Shared helpers (date formatting, currency, logging)
├── config/
│   └── settings.gs             # Configuration (sheet ID, search queries, labels)
├── dashboard/
│   └── looker-studio-setup.md  # Looker Studio connection guide
└── .clasp.json                 # clasp config for local development
```

## Setup

### Prerequisites

- Google account with Gmail
- Receipt emails from supported services arriving in your inbox

### Quick Start

1. Open [Google Apps Script](https://script.google.com) and create a new project
2. Copy the `.gs` files from `src/` into the script editor
3. Update `config/settings.gs` with your Google Sheet ID
4. Create a Google Sheet with the required columns (see Implementation Plan)
5. Set up a time-driven trigger to run `processNewEmails()` every 15 minutes
6. (Optional) Connect the Sheet to Looker Studio for a richer dashboard

### Local Development with clasp

```bash
npm install -g @google/clasp
clasp login
clasp clone <script-id>
clasp push
```

## Google Sheets Schema

| Column | Description | Example |
|--------|-------------|---------|
| Date | Transaction date | 2026-08-07 |
| Merchant | Service or store name | GrabFood |
| Category | Spending category | Food Delivery |
| Amount (MYR) | Transaction amount | 25.90 |
| Description | Item or order details | 2x Nasi Lemak |
| Payment Method | Card or e-wallet used | Maybank Visa |
| Source | Email or service origin | grab.com |
| Email ID | Gmail message ID (dedup key) | 18a3f... |

## License

MIT
