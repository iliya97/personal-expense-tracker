function parseAtome(body, message) {
  var amountMatch = body.match(/payment of RM([\d,.]+)/);

  if (!amountMatch) {
    return null;
  }

  var msgDate = message.getDate();
  var year = msgDate.getFullYear();
  var month = ('0' + (msgDate.getMonth() + 1)).slice(-2);
  var day = ('0' + msgDate.getDate()).slice(-2);
  var date = year + '-' + month + '-' + day;

  return {
    date: date,
    merchant: 'Atome',
    category: 'Miscellaneous',
    amount: parseFloat(amountMatch[1].replace(',', '')),
    description: (message.getSubject().match(/Transaction Confirmation:\s*(.+)/) || [])[1] || '',
    paymentMethod: 'PayLater',
    source: 'service.atome.my'
  };
}
