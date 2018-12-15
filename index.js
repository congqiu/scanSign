const schedule = require('node-schedule');
const bilibili = require('./src/scan/bilibili');
const jd = require('./src/scan/jd');

var j = schedule.scheduleJob('30 30 12 * * *', function() {
  bilibili();
  jd();
});
