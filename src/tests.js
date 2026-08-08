function testFoodpandaParser() {
  var threads = GmailApp.search('from:mail.foodpanda.my subject:"Your order has been placed"', 0, 1);
  if (threads.length === 0) {
    Logger.log('No Foodpanda emails found');
    return;
  }

  var message = threads[0].getMessages()[0];
  var body = message.getBody();
  var result = parseFoodpanda(body);

  if (!result) {
    Logger.log('ERROR: Parser returned null — regex did not match');
    return;
  }

  Logger.log('=== Foodpanda Parser Result ===');
  Logger.log('Date:     ' + result.date);
  Logger.log('Merchant: ' + result.merchant);
  Logger.log('Category: ' + result.category);
  Logger.log('Amount:   RM ' + result.amount);
  Logger.log('Source:   ' + result.source);
  Logger.log('==============================');
}

function testSheetsWriter() {
  var testData = {
    date: '2026-08-08',
    merchant: 'TEST MERCHANT',
    category: 'Testing',
    amount: 99.99,
    description: '',
    paymentMethod: '',
    source: 'test',
    emailId: 'test-' + new Date().getTime()
  };

  appendTransaction(testData);
  Logger.log('Row written. Check the Transactions sheet and delete the test row.');
}

function testDuplicateDetection() {
  var testEmailId = 'dup-test-' + new Date().getTime();

  var testData = {
    date: '2026-08-08',
    merchant: 'DUPLICATE TEST',
    category: 'Testing',
    amount: 11.11,
    description: '',
    paymentMethod: '',
    source: 'test',
    emailId: testEmailId
  };

  appendTransaction(testData);
  Logger.log('First insert done.');

  var isDupById = isDuplicateEmailId(testEmailId);
  Logger.log('isDuplicateEmailId: ' + isDupById + ' (expected: true)');

  var isDupByTxn = isDuplicateTransaction(testData);
  Logger.log('isDuplicateTransaction: ' + isDupByTxn + ' (expected: true)');

  Logger.log('Delete the test rows from the Transactions sheet when done.');
}

function testGrabParser() {
  var threads = GmailApp.search('from:grab.com subject:"Your Grab E-Receipt"', 0, 1);
  if (threads.length === 0) {
    Logger.log('No Grab emails found');
    return;
  }

  var message = threads[0].getMessages()[0];
  var body = message.getBody();
  var result = parseGrab(body);

  if (!result) {
    Logger.log('ERROR: Parser returned null — regex did not match');
    return;
  }

  Logger.log('=== Grab Parser Result ===');
  Logger.log('Date:     ' + result.date);
  Logger.log('Merchant: ' + result.merchant);
  Logger.log('Category: ' + result.category);
  Logger.log('Amount:   RM ' + result.amount);
  Logger.log('Paid by:  ' + result.paymentMethod);
  Logger.log('Source:   ' + result.source);
  Logger.log('==========================');
}

function testEndToEnd() {
  Logger.log('=== End-to-End Test ===');
  Logger.log('Running processNewEmails() against live Gmail...');
  processNewEmails();
  Logger.log('Done. Check:');
  Logger.log('  1. Transactions sheet — new rows should appear');
  Logger.log('  2. Run Log sheet — a run entry should appear');
  Logger.log('  3. Run again — no duplicate rows should be created');
}
