const express = require('express')
const puppeteer = require("puppeteer");

var cloudscraper = require('cloudscraper');
  const { promisify } = require('util');
const { exec } = require('child_process');
const app = express()

app.get("/", async (req, res) => {

	
    let browser;

 let data;
const result = await cloudscraper.get('https://medias24.com/content/api?method=getBidAsk&ISIN=MA0000011488&format=json')
  console.log(result);

	 
    try {
	/*	console.log(process.env.CHROME_PATH);
        browser = await puppeteer.launch({
           // executablePath: "/usr/bin/google-chrome",
		    headless: true,
		    args: [
		        "--no-sandbox",
		        "--disable-setuid-sandbox",
		    ],
        });

        const page = await browser.newPage();

        await page.setViewport({
            width: 1366,
            height: 768,
        });

        await page.goto("https://medias24.com", {
            waitUntil: "networkidle2",
            timeout: 60000,
        });

        // Give the page time to finish loading any client-side work.
        await page.waitForTimeout(5000);

        const result = await page.evaluate(async () => {
            const response = await fetch(
                "/content/api?method=getBidAsk&ISIN=MA0000011512&format=json",
                {
                    credentials: "include",
                    headers: {
                        "Accept": "application/json",
                    },
                }
            );

            return {
                ok: response.ok,
                status: response.status,
                text: await response.text(),
            };
        });

        console.log(result);*/

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message,
        });
    } finally {
       /* if (browser) {
            await browser.close();
        }*/
    }
});

		
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
