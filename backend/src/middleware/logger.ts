import * as bunyan from 'bunyan';

// Create a Bunyan logger instance
const Logger = bunyan.createLogger({
  name: 'MyApp',
  streams: [
    {
      level: 'info',
      stream: process.stdout // Logs to console
    },
    {
      level: 'error',
      stream: process.stdout // Logs errors to a file
    }
  ],
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res
  }
});

export default Logger;
