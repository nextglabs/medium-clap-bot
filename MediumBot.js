const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const {invisible, search_entry, number_of_articles, random_claps_minimum, random_claps_maximum, username, password} = require('./config');

function randomIntFromInterval(min, max) { 
	return Math.floor(Math.random() * (max - min + 1) + min);
}
let randomSlowTyper = async (selector, text) => {
	await new Promise((resolve, reject) => {
		const sleep = m => new Promise(r => setTimeout(r, m));
		(async () => {
			for (let i = 0; i < text.length; i++) {
				var rand = Math.round(Math.random() * (50)) + 150;
				await sleep(rand);
				document.querySelector(selector).value += text[i];
				if (i === text.length - 1) resolve();
			}
		})()
	});
};
(async () => {
	puppeteer.use(AdblockerPlugin({
		blockTrackers: true
	}));
	puppeteer.use(StealthPlugin());
	puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')());
	puppeteer.use(require('puppeteer-extra-plugin-user-preferences')({
		userPrefs: {
			webkit: {
				webprefs: {
					default_font_size: 16
				}
			}
		}
	}));
	let browser = await puppeteer.launch({
		headless: invisible,
		defaultViewport: null,
		ignoreDefaultArgs: ['--disable-extensions'],
		args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
	});
	const page = await browser.newPage();
	let login_link = `https://medium.com/`;
	await page.goto(login_link, {
		waitUntil: 'networkidle0'
	});
	let signInSelector = "#top-nav-sign-in-cta-desktop > div > p > span > a";
	await page.click(signInSelector);
	let signInWithGoogleSelector = "#susi-modal-google-button > a";
	await page.click(signInWithGoogleSelector);
	await page.waitForNavigation();
	let usernameInputSelector = "#identifierId";
	let usernameSubmitSelector = "#identifierNext > div > button > div.VfPpkd-RLmnJb";
	await page.click(usernameInputSelector);
	await page.evaluate(randomSlowTyper, usernameInputSelector, username);
	await page.click(usernameSubmitSelector);
	await page.waitForNavigation();
	let passwordInputSelector = "#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input";
	await page.evaluate(randomSlowTyper, passwordInputSelector, password);
	await page.evaluate(() => document.querySelector("#passwordNext > div > button > div.VfPpkd-RLmnJb").click());
	await page.waitForNavigation();
	let searchButtonSelector = "#root > div > nav > div > div > div > div > div.z.jq.iw > div > div.jt.ju.an.f > div > div > button";
	await page.click(searchButtonSelector);
	let searchInputSelector = "#root > div > nav > div > div > div > div > div.z.jq.iw > div > div.jt.ju.an.f > div > div > input";
	await page.type(searchInputSelector, search_entry);
	page.keyboard.press('Enter');
	await page.waitForNavigation();
	async function autoScroll(NUM_SCROLLS) {
		await page.evaluate(async (NUM_SCROLLS) => {
			await new Promise((resolve, reject) => {
				var distance = 1000;
				var scrollCount = 0;
				var totalHeight = 0;
				var timer = setInterval(() => {
					scrollCount++;
					window.scrollBy(0, distance);
					totalHeight += distance;
					if (scrollCount >= NUM_SCROLLS) {
						clearInterval(timer);
						resolve();
					}
				}, 100);
			});
		}, NUM_SCROLLS);
	};
	await autoScroll(number_of_articles * 2);
	const data = await page.evaluate(() => {
		const tds = Array.from(document.querySelectorAll('.postArticle-content > a'))
		return tds.map(td => {
			return td.href;
		});
	});
	let commentsButtonSelector = "#root > div > div.s > div:nth-child(6) > div > div.n.p > div > div > div > div.n > button > div > div:nth-child(1) > div > span > svg";
	let auxCommentsButtonSelector = "#root > div > div.s > div > div > div.n.p > div > div > div > button > div > span > svg";
	for (let i = 0; i < number_of_articles; i++) {
		await page.goto(data[i], {
			waitUntil: 'networkidle0'
		});
		try {
			await page.click(commentsButtonSelector);
		} catch (e) {
			try {
				await page.click(auxCommentsButtonSelector);
			} catch (e_) {}
		}
		for (let commentNumber = 1; commentNumber < 9999; commentNumber++) {
			try {
				let commentSelector = "#root > div > div.s > div > div > div.s > div > div:nth-child(" + commentNumber + ") > div > div > div > div > div.n.o > div:nth-child(1) > div > div > button > svg";
				let numClaps = randomIntFromInterval(random_claps_minimum, random_claps_maximum);
				if (numClaps < 1) continue;
				for (let x = 0; x < numClaps; x++) await page.click(commentSelector);
			} catch (z) {
				break;
			}
		}
	}
})().catch((error) => {
	console.error(error.message);
});