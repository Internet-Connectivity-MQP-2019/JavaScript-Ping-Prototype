// See LICENSE for usage information

// The following lines allow the ping function to be loaded via commonjs, AMD,
// and script tags, directly into window globals.
// Thanks to https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) { if (typeof define === 'function' && define.amd) { define([], factory); } else if (typeof module === 'object' && module.exports) { module.exports = factory(); } else { root.ping = factory(); }
}(this, function () {

    /**
     * Creates and loads an image element by url.
     * @param  {String} url
     * @return {Promise} promise that resolves to an image element or
     *                   fails to an Error.
     */
    function request_image(url) {
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.onload = function() { resolve(img); };
            img.onerror = function() { reject(url); };
            img.src = "http://" + url + '/favicon.ico?=' + Math.floor((1 + Math.random()) * 0x10000).toString(16);
        });
    }

    /**
     * Pings a url.
     * @param  {String} url
     * @param  {Number} multiplier - optional, factor to adjust the ping by.  0.3 works well for HTTP servers.
     * @return {Promise} promise that resolves to a ping (ms, float).
     */
    function ping(url, multiplier) {
        return new Promise(function(resolve, reject) {
            var start = (new Date()).getTime();
            var response = function() { 
                var delta = ((new Date()).getTime() - start);
                delta *= (multiplier || 1);
                resolve(delta); 
            };
            request_image(url).then(response).catch(response);
            
            // Set a timeout for max-pings, 5s.
            //setTimeout(function() { reject(Error('Timeout')); }, 5000);
        });
    }
    
    return ping;
}));

const TRIAL_COUNT = 200 // We love double jeopardy here!

//"google.com", "youtube.com", "facebook.com", 
sites = ["chinadaily.com.cn", "sueddeutsche.de", "deutschland.de", "google.com", "youtube.com", "facebook.com", "wikipedia.org", "yahoo.com", "amazon.com", "live.com", "reddit.com", "netflix.com", "blogspot.com", "bing.com", "instagram.com", "office.com", "linkedin.com", "microsoft.com", "twitter.com", "ebay.com", "twitch.tv", "stackoverflow.com", "msn.com", "imdb.com", "whatsapp.com", "apple.com", "github.com", "fandom.com", "paypal.com", "t.co", "pinterest.com", "espn.com", "nytimes.com", "walmart.com", "quora.com", "accuweather.com", "bitly.com", "nasa.gov", "ampproject.org", "wpi.edu"]
async function test(){
    const row = document.getElementById("data_row")
    
    // Initialize headers
    for (let s = 0; s < sites.length; s ++) {
        row.innerHTML += '<td id="cell' + s + '">' + sites[s] + '</td>'
    }
    
    for (let i = 0; i < TRIAL_COUNT; i ++) {
        for (let s = 0; s < sites.length; s ++) {
            const cell = document.getElementById("cell" + s)
            
            // Wait for the result of the ping and add it to the table
            const res = await ping("www." + sites[s], 1)
            cell.innerHTML += "<br>" + res
        }
    }
}