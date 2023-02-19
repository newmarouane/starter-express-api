const express = require('express')
const puppeteer = require('puppeteer')
const app = express()
app.all('/', async (req, res) => {
    console.log("Just got a request!")
    try {
  let browser;

    browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox','--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--no-zygote',
        '--deterministic-fetch',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',]} );
  const page = await browser.newPage();
  
  var url = 'https://www.npmjs.com/package/chrome-aws-lambda?activeTab=readme';
  console.log(url);
  
  await page.goto(url, {waitUntil: 'load', timeout: 90000});
    
	var jobDescription = await page.$eval('.content', el => el.innerHTML).catch((e)=> {
		return "";
	});
    
	const logo = await page.$eval('.container > header > img', el => el.getAttribute('src')).catch((e)=> {
		return "";
	});
  
	var applyUrl = await page.$eval('.btn-apply', el => el.getAttribute('href')).catch((e)=> {
		return "";
	});
	if(applyUrl != null && applyUrl.startsWith("/")) applyUrl = await stringToOriginUrl(page.url()) + applyUrl.replace("/job/register/","/job/");
    
  var jobContract = await page.$eval('#job > div > header > ul.details > li:has([*|href*="contract"])', el => el.textContent.replace(/\n/g, "").replaceAll("  ", "")).catch((e)=> {
		return "";
	});
	
  var jobDuration = await page.$eval('#job > div > header > ul.details > li:has([*|href*="duration"])', el => el.textContent.replace(/\n/g, "").replaceAll("  ", "")).catch((e)=> {
		return "";
	});
  
  page.close();
  browser.close();
  var items= {"jobDescription":jobDescription,"logo":logo,"applyUrl":applyUrl, "jobContract": jobContract, "jobDuration": jobDuration};
  res.status(200).json(items);
}
  catch(e) {console.log(
            JSON.stringify({
                error : true,
                errorMessage : e.message
            })
        );
    } finally {
       // await browser.close();
    } 
  
})
app.listen(process.env.PORT || 3000)
