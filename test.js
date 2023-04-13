const RMQclient = require('./index.js');
const { publish } = require('./amqp/publisher.js');

const connectionConfig = {
  protocol: 'amqp',
  hostname: 'localhost',
  port: 5672,
  username: 'guest',
  password: 'guest',
  locale: 'en_US',
  frameMax: 0,
  heartbeat: 60,
  vhost: '/'
};

class EmailListener {
  static async listen(msg) {
    console.log('Email sent: ', msg);
  }
}

class SmsListener {
  static async listen(msg) {
    console.log('SMS sent: ', msg);
  }
}

const options = {
  connection_name: 'test',
  consumerQueues: [
    { name: 'sms', listener: SmsListener },
    { name: 'email', listener: EmailListener }
  ],
  publisherQueues: ['email', 'sms']
};

RMQclient.init(connectionConfig, options);

// for (let i = 0; i < 5; i++) {
setTimeout(() => {
  publish('email', `New Email ${0}`);
  publish('sms', `New SMS ${0}`);
}, 2000);
// }
