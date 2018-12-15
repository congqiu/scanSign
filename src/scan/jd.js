const puppeteer = require('puppeteer');
const fs = require('fs');
const { loginSendMail, log4js } = require("../../lib/tool");
const logger = log4js.getLogger('jd');

const homeUrl = 'https://vip.jd.com/';
const cookieFile = __dirname + '/../../temp/jd.txt';

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
    height: 800
  });

  try {
    if (lastCookies) {
      logger.info('set cookies.');
      var cookieArr = JSON.parse(lastCookies);
      for (let index = 0; index < cookieArr.length; index++) {
        const element = cookieArr[index];
        await page.setCookie(element);
      }
      await page.waitFor(100);
    }
  
    await page.goto(homeUrl);
    await page.waitFor(5000);
  
    if (page.url() !== homeUrl && page.url().indexOf('login')) {
      logger.warn('need login!');
      await loginSendMail(page, 'jd');
    }
  
    let cookies = await page.cookies();
    fs.writeFile(cookieFile, JSON.stringify(cookies), function (err) {
      if (err) {
        logger.warn('save cookie error: ' + err.toString());
      } else {
        logger.info('save cookie success!');
      }
    });
  
    await page.waitForSelector('.user-welfare .welfare-content .sign-in');
  
    await page.click('.user-welfare .welfare-content .sign-in');
  
    await page.evaluate(async () => {
      window.scrollTo(0, parseInt(Math.random() * 500));
    });
    await page.waitFor(parseInt(Math.random() * 1000) + 200);
  
    await page.goto('https://www.jd.com/');

    await page.evaluate(async () => {
      window.scrollTo(0, parseInt(Math.random() * 500));
    });
    await page.waitFor(parseInt(Math.random() * 1000) + 200);

    await page.goto('https://jr.jd.com/');
    await page.click('.prime-wrap .prime-right .sign');

    await page.goto('https://vip.jr.jd.com/');
    await page.click('.fin-new-banner .fin-ban-rg .fin-g .m-qian');

    await page.evaluate(async () => {
      window.scrollTo(0, parseInt(Math.random() * 500));
    });
    await page.waitFor(parseInt(Math.random() * 1000) + 200);

    logger.info('will close');

  } catch (error) {
    logger.error(error.message);
  }
  
  browser.close();
}