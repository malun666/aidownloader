const Crawler = require('crawler');
const request = require('request');
const fs = require('fs');
const path = require('path');
const c = new Crawler({
  maxConnections: 1,
  rateLimit: 1000,
  callback: function(error, res, done) {
    if (error) {
      console.log(error);
    } else {
      const $ = res.$;
      // console.log($('#news_body').html());
      console.log($('#news_title').text());
      $('.news_tags .catalink').each((index, item) => {
        console.log('tag:', $(item).text());
      })
      console.log('============')
      $('img').each(function(index, item) {
        return;
        console.log($(item).attr('src'));
        let url = $(item).attr('src');
        if (!url) {
          return;
        }
        const name = url.slice(url.lastIndexOf('/') + 1);
        try {
          if (/^\/\//i.test(url)) {
            console.log('`http:${url}` :', `http:${url}`);
            request(`http:${url}`).pipe(
              fs.createWriteStream(path.join(__dirname, '/imgs/', name))
            );
          } else {
            console.log(`http://images0.cnblogs.com${url}`);
            // request(`http://images0.cnblogs.com${url}`).pipe(fs.createWriteStream(path.join(__dirname, '/imgs/', name)));
          }
        } catch (e) {}
      });
    }
    done();
  }
});

let arr = [];
for (let i = 0, k = 628114; i < 10; i++) {
  arr.push(`https://news.cnblogs.com/n/${k - i}`);
}
c.queue(arr);
