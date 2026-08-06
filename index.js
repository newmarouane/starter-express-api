const express = require('express')
const puppeteer = require('puppeteer-extra')



const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin());
//const puppeteer = require('puppeteer')
const app = express()
app.all('/', async (req, res) => {
	console.log('req json');


	const browser = await puppeteer.launch({ headless: false }); // Headed mode reduces bot detection
  const page = await browser.newPage();
// Set a realistic user-agent to match the IP’s region and browser version
await page.setUserAgent(
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
);

// Randomize viewport slightly to avoid fingerprinting from consistent dimensions
await page.setViewport({
  width: Math.floor(1024 + Math.random() * 100),
  height: Math.floor(768 + Math.random() * 100),
});
	// Look for iframes likely tied to CAPTCHA providers (Cloudflare, Turnstile, etc.)
const isCaptcha = await page.$('iframe[src*="captcha"], iframe[src*="turnstile"]');

if (isCaptcha) {
  console.log("CAPTCHA triggered");
  // You may want to skip, retry with a new proxy, or solve it with a 3rd-party service
}
	await page.goto("https://medias24.com", {
  waitUntil: "networkidle2",
});

// Wait a few seconds if Cloudflare performs checks
await new Promise(resolve => setTimeout(resolve, 5000));

const data = await page.evaluate(async () => {
  const res = await fetch("https://medias24.com/content/api?method=getBidAsk&ISIN=MA0000011512&format=json", {
    credentials: "include",
  });

  return await res.json();
});
	await page.close();
   await browser.close()	;
	res.status(200).json(data);
})
		
app.all('/job', async (req, res) => {
    console.log("Just got a request!")
    try {
  let browser;
puppeteer.use(StealthPlugin())

    browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']} );
  const page = await browser.newPage();
  
  var url = 'https://www.optioncarriere.com/jobad/fr570a1ea897a985defb53f15e669ff6f8';
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
