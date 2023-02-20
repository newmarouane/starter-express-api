const express = require('express')
const puppeteer = require('puppeteer-extra')

const StealthPlugin = require('puppeteer-extra-plugin-stealth')

//const puppeteer = require('puppeteer')
const app = express()
app.all('/', async (req, res) => {
    console.log("Just got a request!")
    try {
  let browser;
puppeteer.use(StealthPlugin())

    browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox','--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--no-zygote',
        '--deterministic-fetch',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',]} );
  const page = await browser.newPage();
  
  var url = 'https://jobviewtrack.com/fr-fr/job-1c4f417d4c160a4e650649100d632815044e170000004f297f5f44170a6c7715520669575f545710/d874a4ab712e6dd8fff99e22e3008ce4.html?affid=0afaf0173305e4b8';
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
