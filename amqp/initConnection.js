const { getLogger } = require('./logger.js');
const amqplib = require('amqplib/callback_api.js');

let clientConfig, clientOptions, amqpConn;

module.exports = {
  init: (config, options, callback) => {
    clientConfig = config;
    clientOptions = options;
    const logger = getLogger();
    // Start connection with Rabbitmq
    amqplib.connect(config, { clientProperties: { connection_name: options.connection_name } }, (err, conn) => {
      // If connection error
      if (err) {
        logger.error(`[AMQP] ${err.message}`);
        return setTimeout(() => {
          module.exports.init(clientConfig, clientOptions, callback);
        }, 1000);
      }

      conn.on('error', function (error) {
        logger.error(`[AMQP] ${error.message}`);
        if (error.message !== 'Connection closing') {
          logger.error(`[AMQP] ${error.message}`);
        }
      });

      conn.on('close', function () {
        // Reconnect when connection was closed
        logger.info('[AMQP] reconnecting');
        return setTimeout(() => {
          module.exports.init(clientConfig, clientOptions, callback);
        }, 1000);
      });

      // Connection OK
      logger.info('[AMQP] Connection with Rabbitmq was successful');
      amqpConn = conn;
      // Execute finish function
      callback();
    });
  },
  RMQConnection: () => amqpConn
};
