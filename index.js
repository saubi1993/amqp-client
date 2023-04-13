const LoggerModule = require('./amqp/logger.js');
const Connection = require('./amqp/initConnection.js');
const Publisher = require('./amqp/publisher.js');
const Consumer = require('./amqp/consumer.js');

const DefaultOptions = Object.freeze({
  connection_name: 'amqpClient',
  prefetch: 5,
  consumer: true,
  publisher: true,
  consumerQueues: [], //   [{ name: 'email', listener: EmailQueue }]
  publisherQueues: [], // Array of queue names
  logger: null,
  onConsumerError: () => {},
  sentry: null
});

exports.init = function (config, options = {}) {
  options = { ...DefaultOptions, ...options };
  LoggerModule.init(options.logger);
  Connection.init(config, options, () => {
    if (options.publisher) Publisher.start(options.publisherQueues);
    if (options.consumer) Consumer.start(options.consumerQueues, options);
  });
};

exports.publish = function (queue, message) {
  Publisher.publish(queue, message);
};
