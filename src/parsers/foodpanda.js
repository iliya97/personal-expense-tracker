function parseFoodpanda(body) {
  var dateMatch = body.match(/Order time[\s\S]*?(\d{4}-\d{2}-\d{2})\s+\d{2}:\d{2}:\d{2}/);
  var totalMatch = body.match(/Order Total[\s\S]*?RM\s*([\d.]+)/);

  if (!dateMatch || !totalMatch) {
    return null;
  }

  return {
    date: dateMatch[1],
    merchant: 'Foodpanda',
    category: 'Food Delivery',
    amount: parseFloat(totalMatch[1]),
    source: 'mail.foodpanda.my'
  };
}
