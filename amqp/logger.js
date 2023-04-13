let logger = console;

exports.init = function (clientLogger = null) {
  logger = clientLogger || logger;
};

exports.getLogger = function () {
  return logger;
};
