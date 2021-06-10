const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(helmet());

require('./routes/routes')(app);

app.use(haltOnTimedout);
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}
// app.use(express.static('public/homework_images'));

// Error handler
app.use((error, request, response, next) => {
  response.status(error.status || 500);
  response.json({ error: error.message });
  next();
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(chalk.yellow('.......................................'));
  console.log(
    chalk.green(`App listening at http://localhost:${chalk.yellow(PORT)}`)
  );
  console.log(chalk.yellow('.......................................'));
});

module.exports = app;
