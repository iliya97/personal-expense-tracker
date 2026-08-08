var PARSER_MAP = {
  'mail.foodpanda.my': parseFoodpanda,
  'grab.com': parseGrab
};

function routeParser(message) {
  var from = message.getFrom();

  for (var domain in PARSER_MAP) {
    if (from.indexOf(domain) !== -1) {
      var body = message.getBody();
      return PARSER_MAP[domain](body);
    }
  }

  return null;
}
