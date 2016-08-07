var path = require('path'),
    url = require('url');

function getDb() {
    var dbUrl = url.parse(process.env.DATABASE_URL || 'sqlite://data/ghost.db'),
        dbConfig = {};

    var client = dbUrl.protocol.split(':')[0];
    if (client === 'sqlite') {
        dbConfig.client = 'sqlite3';

        if (dbUrl.host) {
          dbConfig.connection = {
              filename: path.join(process.env.GHOST_CONTENT, dbUrl.host, dbUrl.path || '')
          }
        } else {
          dbConfig.connection = {
              filename: dbUrl.path
          }
        }
    } else {
        dbConfig.client = client;
        dbConfig.connection = {
            host: dbUrl.hostname,
            database: dbUrl.path.split('/')[1],
            user: dbUrl.auth ? dbUrl.auth.split(':')[0] : '',
            password: dbUrl.auth ? dbUrl.auth.split(':')[1] : '',
            charset: 'utf8'
        };

        if (dbUrl.port) {
            dbConfig.connection.port = parseInt(dbUrl.port);
        }
    }

    dbConfig.debug = process.env.NODE_ENV === 'production' ? false : true;

    return dbConfig;
}

function getMail() {
  var mailConfig = { transport: 'SMTP' },
      options = {};

  if (process.env.MAIL_SERVICE) {
      options.service = process.env.MAIL_SERVICE;
  }
  if (process.env.SMTP_HOST) {
      options.host = process.env.SMTP_HOST;
  }
  if (process.env.SMTP_PORT) {
      options.port = parseInt(process.env.SMTP_PORT);
  }
  if (process.env.SMTP_USER) {
      options.auth = { user: process.env.SMTP_USER };
  }
  if (process.env.SMTP_PASSWORD) {
      options.auth.pass = process.env.SMTP_PASSWORD;
  }
  options.secure = process.env.SMTP_SECURE === 'true' ? true : false;

  mailConfig.options = options;
  return mailConfig;
}


var config = {
    url: process.env.URL || 'http://localhost:2368',
    mail: getMail(),
    database: getDb(),
    server: {
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT ? parseInt(process.env.PORT) : 2368
    },
    paths: {
        contentPath: process.env.GHOST_CONTENT
    },
    compress: process.env.COMPRESS === 'false' ? false : true,
    fileStorage: process.env.STORAGE === 'false' ? false : true,
    maintenance: { enabled: process.env.MAINTENANCE === 'true' ? true : false }
};

module.exports = {
    development: config,
    production: config
};
