const Crawler = require('crawler');
const request = require('request');
const EventBus = require('./EventBus');
const fs = require('fs');
const path = require('path');
const Db = require('./service');
const urlencode = require('urlencode');

let newsCount = 0;
const c = new Crawler({
  maxConnections: 1,
  rateLimit: 2500,
  callback: function(error, res, done) {
    if (error) {
      console.log(error);
    } else {
      const $ = res.$;
      let tags = '谦太祥和,AICODER,大前端，前端培训，全栈培训';
      $('.news_tags .catalink').each((index, item) => {
        tags += ',' + $(item).text();
      });

      $('img').each(function(index, item) {
        let url = $(item).attr('src');
        if (!url) {
          return;
        }
        const name = url.slice(url.lastIndexOf('/') + 1);
        url = url.replace(name, encodeURI(name));
        try {
          if (/^\/\//i.test(url)) {
            // console.log('`http:${url}` :', `http:${url}`);
            let urlName = `http:${url}`;
            if (
              !/(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?/i.test(
                urlName
              )
            ) {
              return;
            }
            request(`http:${url}`).pipe(
              // fs.createWriteStream(path.join(__dirname, '/imgs/', name))
              fs.createWriteStream(
                path.join(
                  // '/Users/flydragon/Desktop/work/gitdata/aicoder_egg/app/pub/public/bootimgs',
                  '/home/github/aicoder_egg/app/pub/public/bootimgs',
                  name
                )
              )
            );
          }
        } catch (e) {}
        $(item).attr('src', `/public/bootimgs/${name}`);
      });
      let bodyHtml = $('#news_body').html();
      // console.log(bodyHtml);
      let article = new Db.Article({
        SubName: '谦太祥和',
        SubOn: Date.now(),
        Del: false,
        IsHot: false,
        Remark: 'AICODER大前端，全栈培训，前端培训，前端教程，项目实战',
        Content: `${bodyHtml}`,
        Title: $('#news_title').text(),
        Tages: tags,
        Favs: 0,
        Vote: 0,
        Opend: 0,
        UserId: '5bf1c82edd3a6b79cb380b66',
        Comments: []
      });
      article.save();
      // console.log($('#news_title').text());
      // console.log('============')
    }
    console.log(++newsCount);
    done();
  }
});

EventBus.on('mongodbConn', () => {
  try {
    let arr = [];
    for (let i = 0, k = 628110; i < 5; i++) {
      arr.push(`https://news.cnblogs.com/n/${k - i}`);
    }
    c.queue(arr);
  } catch (e) {
    console.log(e);
  }
});
