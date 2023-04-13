const { getLogger } = require('./logger.js');

const { RMQConnection } = require('./initConnection.js');

let pubChannel;
exports.start = (queues) => {
  // Init publisher
  const amqpConn = RMQConnection();
  const logger = getLogger();
  amqpConn.createConfirmChannel(function (err, ch) {
    if (closeOnErr(err, logger)) return;

    ch.on('error', function (error) {
      logger.error(`[AMQP] ${error.message}`);
    });

    ch.on('close', function () {
      pubChannel = null;
      logger.error('[AMQP] channel closed');
    });

    // Set publisher channel in a var
    pubChannel = ch;
    // Create all queues
    Object.values(queues).forEach((queue) => pubChannel.assertQueue(queue, { durable: true }));
    logger.info('[AMQP] Publisher Started');
  });
};

exports.publish = (queue, message) => {
  if (process.env.NODE_ENV === 'test') return;
  const logger = getLogger();
  if (!pubChannel) {
    logger.error(
      "[AMQP] Can't publish message. Publisher is not initialized. You need to initialize them with StartPublisher function"
    );
    return;
  }
  const msg = JSON.stringify(message);
  try {
    pubChannel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    logger.info(`[AMQP] Message sent to queue ${queue}: ${msg}`);
  } catch (error) {
    logger.error(`[AMQP] Queue: ${queue} Publish error ${error.message}`);
  }
};

function closeOnErr(err, logger) {
  if (!err) return false;
  logger.error(`[AMQP] ${err}`);
  const amqpConn = RMQConnection();
  amqpConn.close();
  return true;
}
