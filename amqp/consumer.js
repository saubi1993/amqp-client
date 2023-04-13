const { getLogger } = require('./logger.js');

const { RMQConnection } = require('./initConnection.js');

exports.start = (queues, options) => {
  if (Object.keys(queues).length === 0) return;
  const amqpConn = RMQConnection();
  const logger = getLogger();
  const sentry = options.sentry;
  const onConsumerError = options.onConsumerError;
  queues.forEach((queue) => {
    // Create a channel for queue
    amqpConn.createChannel(function (err, ch) {
      if (closeOnErr(err, logger)) return;

      ch.on('error', function (error) {
        sentry?.captureException(error);
        logger.error(`[AMQP] ${error.message}`);
      });

      ch.on('close', function () {
        sentry?.captureException(error);
        logger.info('[AMQP] channel closed');
      });

      // Set prefetch value
      ch.prefetch(options.prefetch);

      // Connect to queue
      ch.assertQueue(queue.name, { durable: true }, function (error, _ok) {
        if (closeOnErr(error)) return;
        // Consume incoming messages
        ch.consume(queue.name, async function (msg) {
          const message = msg.content.toString();
          logger.info('%s: [AMQP] Received %s', queue.name, message);
          const params = JSON.parse(message);
          try {
            await queue.listener.listen(params);
            logger.info('%s: [AMQP] Processed %s', queue.name, message);
          } catch (error) {
            logger.error(error);
            sentry?.captureException(error);
            if (typeof onConsumerError === 'function') await onConsumerError(error, params.userNotificationId);
          }
          ch.ack(msg);
        });
        logger.info(`[AMQP] ${queue.name} consumer is listening`);
      });
    });
  });
  logger.info('[AMQP] Waiting for messages. To exit press CTRL+C');
};

function closeOnErr(err, logger) {
  if (!err) return false;
  logger.error(`[AMQP] ${err}`);
  const amqpConn = RMQConnection();
  amqpConn.close();
  return true;
}
