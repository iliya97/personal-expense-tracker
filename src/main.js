function processNewEmails() {
    var startTime = new Date();
    var threads = GmailApp.search(SETTINGS.SEARCH_QUERY, 0, 50);
    var messages = flattenThreads(threads);

    var parsedCount = 0;
    var errorCount = 0;

    var label = getProcessedLabel();

    messages.forEach(function(message) {
        try {
            var emailId = message.getId();

            if (isDuplicateEmailId(emailId)) {
                return;
            }

            var parsed = routeParser(message);

            if (!parsed) {
                logError(message.getSubject(), 'No parser mathced', emailId);
                return;
            }

            parsed.emailId = emailId;

            if (isDuplicateTransaction(parsed)) {
                logError(message.getSubject(), 'Duplicate transaction', emailId);
                return;
            }

            appendTransaction(parsed);
            message.markRead();
            label.addToThread(message.getThread());
            parsedCount++;
        } catch (error) {
            errorCount++;
            logError(message.getSubject(), error, message.getId());
        }
    });

    logRunSummary(messages.length, parsedCount, errorCount, (new Date() - startTime) / 1000);
    trimErrorLogIfNeeded();
}

function flattenThreads(threads) {
    return threads.reduce(function(result, thread) {
        return result.concat(thread.getMessages());
    }, []);
}

function getProcessedLabel() {
    var label = GmailApp.getUserLabelByName(SETTINGS.PROCESSED_LABEL);
    return label || GmailApp.createLabel(SETTINGS.PROCESSED_LABEL);
}

function isDuplicateEmailId(emailId) {
  var sheet = SpreadsheetApp.openById(SETTINGS.SHEET_ID).getSheetByName(SETTINGS.TRANSACTIONS_SHEET);
  var values = sheet.getRange('H2:H' + sheet.getLastRow()).getValues();
  return values.some(function(row) {
    return row[0] === emailId;
  });
}

function isDuplicateTransaction(parsed) {
  var sheet = SpreadsheetApp.openById(SETTINGS.SHEET_ID).getSheetByName(SETTINGS.TRANSACTIONS_SHEET);
  if (sheet.getLastRow() < 2) {
    return false;
  }

  var rows = sheet.getRange('A2:D' + sheet.getLastRow()).getValues();
  var targetDate = new Date(parsed.date).getTime();
  var windowMs = SETTINGS.DUPLICATE_WINDOW_MINUTES * 60 * 1000;

  return rows.some(function(row) {
    var rowDate = new Date(row[0]).getTime();
    var rowMerchant = String(row[1] || '').toLowerCase();
    var rowAmount = Number(row[3] || 0);

    return rowMerchant === String(parsed.merchant || '').toLowerCase()
      && rowAmount === Number(parsed.amount)
      && Math.abs(rowDate - targetDate) <= windowMs;
  });
}

function appendTransaction(data) {
  var sheet = SpreadsheetApp.openById(SETTINGS.SHEET_ID).getSheetByName(SETTINGS.TRANSACTIONS_SHEET);
  sheet.appendRow([
    data.date,
    data.merchant,
    data.category,
    data.amount,
    data.description || '',
    data.paymentMethod || '',
    data.source || '',
    data.emailId
  ]);
}

function logError(subject, error, emailId) {
  var sheet = SpreadsheetApp.openById(SETTINGS.SHEET_ID).getSheetByName(SETTINGS.ERROR_LOG_SHEET);
  var message = error instanceof Error ? error.message : String(error);

  sheet.appendRow([
    new Date(),
    subject || '',
    message,
    emailId || ''
  ]);
}

function logRunSummary(found, parsed, errors, durationSeconds) {
  var sheet = SpreadsheetApp.openById(SETTINGS.SHEET_ID).getSheetByName(SETTINGS.RUN_LOG_SHEET);
  sheet.appendRow([
    new Date(),
    found,
    parsed,
    errors,
    durationSeconds
  ]);
}

function trimErrorLogIfNeeded() {
  var sheet = SpreadsheetApp.openById(SETTINGS.SHEET_ID).getSheetByName(SETTINGS.ERROR_LOG_SHEET);
  var lastRow = sheet.getLastRow();
  if (lastRow <= SETTINGS.MAX_ERROR_LOG_ROWS + 1) {
    return;
  }

  var rowsToDelete = lastRow - (SETTINGS.MAX_ERROR_LOG_ROWS + 1);
  sheet.deleteRows(2, rowsToDelete);
}
