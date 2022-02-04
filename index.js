const puppeteer = require('puppeteer');

(async () => {

  // retrieve fundName from command
  const fundName = process.argv[2];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://codequiz.azurewebsites.net/');

  // click accept button and navigate to fund detail page
  await page.waitForSelector('h1');
  await page.$eval('input[value=Accept]', el => el.click());
  await page.waitForSelector('p');

  // get data from table convert to array
  const rawBody = await page.$$eval('table tbody tr', trs => trs.map(tr => {
    const tds = [...tr.getElementsByTagName('td')];
    return tds.map(td => td.textContent);
  }));

  // clean data for easy to using
  const fundData = cleanData(rawBody);
  const nav = fundData[fundName]['Nav'];
  console.log(`${fundName} NAV: ${nav}`)

  await browser.close();
})();

function cleanData(rawData) {
  const fundDetail = {}
  const fundMapping = {}
  rawData.map(data => {
    if (data.length > 0) {
      fundDetail['Nav'] = data[1]
      fundDetail['Bid'] = data[2]
      fundDetail['Offer'] = data[3]
      fundDetail['Change'] = data[4]
      const fundName = data[0].trim()
      fundMapping[fundName] = fundDetail;
    }
  })
  return fundMapping;
}
