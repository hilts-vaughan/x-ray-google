'use strict'

var Xray = require('x-ray')
var util = require('util')
var x = new Xray()

var scrapeUrl = function(url, callback) {
  x(url, '.g', [{
    link: 'a@href',
  }]).paginate('#pnnext@href').limit(5)
  (function(err, obj) {
    if(err || !obj) {
      console.log('An exception occured.')
      callback(err);
      return;
    }
    obj.forEach((item) => {
      var start = item.link.indexOf('q=')
      var end = item.link.indexOf('&sa')
      item.link = item.link.substring(start + 2, end)
    })

    callback(null, obj)
  })
}

var genericScrape = function(url, callback) {
  x(url, 'html', {
    title: 'title',
    links: 'a@href'
  })((err, obj) => {
    if(err || !obj) {
      callback(err)
      return;
    }
    callback(null, obj);
  })
}

var wikiScrape = function(url, callback) {

}

scrapeUrl("https://www.google.ca/search?site=&source=hp&q=spice+and+wolf&oq=spice+and+wolf", function(err, obj) {
  if(err) {
    console.log(err);
  } else {
    obj.forEach((linker) => {
      var link = linker.link
      genericScrape(link, (err, obj) => {
        if(obj.title) {
          console.log(util.format("%s :::: %s", obj.title.trim(), obj.links.trim()))
        }
      })
    })
  }
});
