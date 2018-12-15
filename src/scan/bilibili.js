const puppeteer = require('puppeteer');
const fs = require('fs');
const { loginSendMail, log4js } = require("../../lib/tool");
const logger = log4js.getLogger('bilibili');

const homeUrl = 'https://account.bilibili.com/account/home';
const cookieFile = __dirname + '/../../temp/bilibili.txt';

module.exports = async () => {
  let lastCookies = fs.readFileSync(cookieFile, {encoding: 'UTF-8', flag: "a+"});

  const browser = await (puppeteer.launch({
    timeout: 15000,
    ignoreHTTPSErrors: true,
    devtools: false,
    headless: false,
    args: []
  }));
  const page = await browser.newPage();
  page.setViewport({
    width: 1400,
    height: 600
  });

  try {
    if (lastCookies) {
      logger.info('set cookies.');
      var cookieArr = JSON.parse(lastCookies);
      for (let index = 0; index < cookieArr.length; index++) {
        const element = cookieArr[index];
        await page.setCookie(element);
      }
    }
  
    await page.goto(homeUrl);
    await page.waitFor(5000);
  
  
    if (page.url() !== homeUrl && page.url().indexOf('passport')) {
      logger.warn('need login!');
      await loginSendMail(page, 'bilibili');
    }
  
    let cookies = await page.cookies();
    fs.writeFile(cookieFile, JSON.stringify(cookies), function (err) {
      if (err) {
        logger.warn('save cookie error: ' + err.toString());
      } else {
        logger.info('save cookie success!');
      }
    });
  
    await page.goto('https://www.bilibili.com/');
  
    await page.waitFor(1000);
  
    await page.waitForSelector('.bili-wrapper .nav-con .profile-info .i-face .face');
  
    await page.hover('.bili-wrapper .nav-con .profile-info .i-face .face');
  
    await page.waitFor(1000);
  
    // 假装滚动看些什么
    await page.evaluate(async () => {
      window.scrollTo(0, parseInt(Math.random() * 500));
    });
    await page.waitFor(parseInt(Math.random() * 1000) + 200);
  
    logger.info('will close');
  } catch (error) {
    logger.error(error.message);
  }

  browser.close();
};