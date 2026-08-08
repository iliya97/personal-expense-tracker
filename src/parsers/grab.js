var GRAB_MONTHS = {
  'January': '01', 'February': '02', 'March': '03', 'April': '04',
  'May': '05', 'June': '06', 'July': '07', 'August': '08',
  'September': '09', 'October': '10', 'November': '11', 'December': '12'
};

function parseGrab(body) {
  var totalMatch = body.match(/Total Paid<\/td>[\s\S]*?<div[^>]*>RM([\d.]+)<\/div>/);
  var dateMatch = body.match(/Picked up on (\d{2})\s+(\w+)\s+(\d{4})/);
  var paidByMatch = body.match(/Paid by[\s\S]*?<td[^>]*>\s*(\w[\w\s]*?)\s*<\/td>/);

  if (!totalMatch || !dateMatch) {
    return null;
  }

  var month = GRAB_MONTHS[dateMatch[2]];
  var date = dateMatch[3] + '-' + month + '-' + dateMatch[1];

  return {
    date: date,
    merchant: 'Grab Car',
    category: 'Transport',
    amount: parseFloat(totalMatch[1]),
    paymentMethod: paidByMatch ? paidByMatch[1].trim() : '',
    source: 'grab.com'
  };
}
