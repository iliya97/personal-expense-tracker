var GRAB_MONTHS_FULL = {
  'January': '01', 'February': '02', 'March': '03', 'April': '04',
  'May': '05', 'June': '06', 'July': '07', 'August': '08',
  'September': '09', 'October': '10', 'November': '11', 'December': '12'
};

var GRAB_MONTHS_SHORT = {
  'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
  'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
  'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
};

function parseGrab(body) {
  var isGrabFood = /Vehicle type:[\s\S]*?GrabFood/.test(body);

  if (isGrabFood) {
    return parseGrabFood(body);
  }
  return parseGrabCar(body);
}

function parseGrabCar(body) {
  var totalMatch = body.match(/Total Paid<\/td>[\s\S]*?<div[^>]*>RM([\d.]+)<\/div>/);
  var dateMatch = body.match(/Picked up on (\d{2})\s+(\w+)\s+(\d{4})/);
  var paidByMatch = body.match(/Paid by[\s\S]*?<td[^>]*>\s*(\w[\w\s]*?)\s*<\/td>/);

  if (!totalMatch || !dateMatch) {
    return null;
  }

  var month = GRAB_MONTHS_FULL[dateMatch[2]];
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

function parseGrabFood(body) {
  var totalMatch = body.match(/TOTAL \(INCL\. TAX\)[\s\S]*?RM\s*([\d.]+)/);
  var dateMatch = body.match(/Pick-up time:[\s\S]*?(\d{1,2})\s+(\w{3})\s+(\d{2,4})/);
  var paymentMatch = body.match(/Payment Method:[\s\S]*?<span[^>]*>([^<]+)<\/span>/);

  if (!totalMatch || !dateMatch) {
    return null;
  }

  var month = GRAB_MONTHS_SHORT[dateMatch[2]];
  var year = dateMatch[3].length === 2 ? '20' + dateMatch[3] : dateMatch[3];
  var day = dateMatch[1].length === 1 ? '0' + dateMatch[1] : dateMatch[1];
  var date = year + '-' + month + '-' + day;

  return {
    date: date,
    merchant: 'GrabFood',
    category: 'Food Delivery',
    amount: parseFloat(totalMatch[1]),
    paymentMethod: paymentMatch ? paymentMatch[1].replace(/&nbsp;/g, '').trim() : '',
    source: 'grab.com'
  };
}
