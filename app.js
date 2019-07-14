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
  rateLimit: 5500,
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
            console.log(`http:${url}`);
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
                  '/Users/flydragon/Desktop/work/gitdata/aicoder_egg/app/pub/public/bootimgs',
                  // '/home/github/aicoder_egg/app/pub/public/bootimgs',
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
    for (let i = 0, k = 600629; i < 100; i++) {
      arr.push({
        uri: `https://news.cnblogs.com/n/${k - i}`,
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Safari/605.1.15',
        headers: {
          Cookie: "__utma=66375729.263404499.1558367666.1562858270.1562895161.3; __utmb=66375729.3.10.1562895162; __utmc=66375729; __utmt=1; __utmz=66375729.1562895162.3.2.utmcsr=home.cnblogs.com|utmccn=(referral)|utmcmd=referral|utmcct=/news/page/16/; _ga=GA1.2.263404499.1558367666; _gid=GA1.2.564746900.1562850097; .CNBlogsCookie=3DBB8CCC60FE41E401E12A44DEF4F2F454990DF8EE0A6B7819E98EAEC59B58033070B7B3B85FB8155785C8EDC71DA270AC6587DA118CC7CC6CBD541C9FFDD96D13CA0B1C9C3B1B88435B365D057F8C1D33A1F154C48B8E10EA85D5E9E6F68165A129450C; .Cnblogs.AspNetCore.Cookies=CfDJ8D8Q4oM3DPZMgpKI1MnYlrm442pni5jKePTMiMEBb_IUgh5REicbgXROJSklhyQQsRby-HZCUmWp2iM3TqOP6daRWwJV38tKaBEO3k6jvLJpWTgsX8sgp1BaVsxyI8oEvSt_3iNG51MnzsVzq-5UR5x1zT6RuqNeIYHlI3bNkpZqtolGvk1BovNv8oYOu2VlVthpvLbxgEJhUW_MjwvGMeB2J9URAkXwUiA9u3L6T6FO58cyADHTuebwN4LpJG0WeWqRqqY7PYaW-8OtQnfHs0IiOvHrMvpSYLj1bf58MI6DYL_KJUNWAJPfTNJWhyqMKWFMNI39T2jVMZSj-HrcVnD_o_hsHf24tYUW4o_SqbJNKkXUH1Jn7h-ZayovPrQRgnAxZgPcm6fC2BDXA40IZ4BTJf2evrFJod9awI7WNB3Fv5p_sy2hCSPjtxj8dzRRI_kKy2EMzRWefkbtpv54IEs; __gads=ID=9f47d14844d62aaa:T=1558367666:RT=1562850003:S=ALNI_MYejz0YlevO2F72J275p5H66jdTVA"
        },
        referer: 'https://home.cnblogs.com/news/page/16/'
      });
      if(i%20 === 0) {
        let fileName = path.join(__dirname, 'number.txt');
        fs.writeFile(fileName, (k-i) + '', {
          encoding: 'utf8',
          flag: 'w'
        });
      }
    }
    c.queue(arr);
  } catch (e) {
    console.log(e);
  }
});
