# Medium Clap Bot
This script uses libraries to remain undetectable and randomized typing to appear somewhat human, however you should use it at your own risk.  Currently only supports login with Google.  

![](https://github.com/paymon123/medium-clap-bot/blob/master/demo.gif)

## Configuration
Using these settings, the script will login, search for "How to write a web bot", visit the top 50 articles, and clap each comment between -5 and 15 times, skipping the comment if the random number generated is negative. 
```javascript
const config = {
	invisible: false,
	search_entry: "How to write a web bot",
	number_of_articles: 50,
	random_claps_minimum: -5,
	random_claps_maximum: 15,
	username: "gmail_account@gmail.com",
	password: "medium_password"
};
```
## Debugging
The script will occasionally fail to hit the Sign In button, just restart it.

After some time, Medium will update their website and the selectors used to target the DOM elements may become obsolete.  If you take some time to update the selectors you can make it compatible with newer versions of Medium.  
