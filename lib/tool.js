const { mailSender } = require('./mail');
const log4js = require('log4js');

log4js.configure({
  appenders: { 
    default: { type: 'file', filename: __dirname + '/../log/error.log' },
    jd: { type: 'file', filename: __dirname + '/../log/jd.log' },
    bilibili: { type: 'file', filename: __dirname + '/../log/bilibili.log' } 
  },
  categories: {
    default: { appenders: ['default'], level: 'error' },
    jd: { appenders: ['jd'], level: 'info' },
    bilibili: { appenders: ['bilibili'], level: 'info' }
  }
});

async function loginSendMail(page, site) {
	await page.screenshot({path: __dirname + '/../temp/' + site + '.png'});
  await page.waitFor(100);

  mailSender(site + '自动登录失败了', site + '登录失败了, 扫描二维码登录吧', [{
    filename : 'code.png',
    path: __dirname + '/../temp/' + site + '.png'
  }]);
  await page.waitFor(1000);

  await page.waitForNavigation({timeout: 60 * 60 * 1000});
  await page.waitFor(200);
}

module.exports = {
  loginSendMail,
  log4js
};