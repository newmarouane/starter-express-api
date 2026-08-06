const express = require('express')
const puppeteer = require('puppeteer-extra')




const StealthPlugin = require('puppeteer-extra-plugin-stealth')

//const puppeteer = require('puppeteer')
const app = express()
app.all('/', async (req, res) => {
	console.log('req json');
const browser = await puppeteer.launch();
  const page = await browser.newPage();
	let json;
  page.on("response", async (response) => {
//  if (response.url().includes("/api/")) {
    try {
       json = await response.json();
      console.log(json);
    } catch {}
//  }
});

await page.goto("https://raw.githubusercontent.com/GoogleChrome/puppeteer/master/package.json", {
  waitUntil: "networkidle2",
});


	await page.close();
   await browser.close()	;
	res.status(200).json(json);
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
