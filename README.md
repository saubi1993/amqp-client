![Hellobetter](https://hellobetter.de/wp-content/uploads/2021/04/hellobetter-main.svg)
# RabbitMQ JS client

This is a npm package that has a client connection code (publisher/consumer) to connect RabbitMQ
## Features
- Auto connect on failure
- Survive broker restart
- 1 connection per process

## Installation & Usage

```bash
npm install
```

#### Configs:
```bash
const config = {
    "protocol": "amqp",
    "hostname": "localhost",
    "port": 5672,
    "username": "guest",
    "password": "guest",
    "locale": "en_US",
    "frameMax": 0,
    "heartbeat": 60,
    "vhost": "/"
}
const options= {
  connection_name: 'amqpClient',
  prefetch: 5,
  consumer: true,
  publisher: true,
  consumerQueues: [], //   [{ name: 'email', listener: EmailQueue }]
  publisherQueues: [], // Array of queue names
  logger: null
}
```

#### Test
```yaml
node test.js
```
## Contributing
- Pull requests are welcome.
Format: `(feature|release|hotfix|fix|docs|style|refactor|perf|test|chore)/([A-Za-z]+-\\d+).*`
- Please make sure to update tests as appropriate.
- Keep `config.sample.json` up to date
