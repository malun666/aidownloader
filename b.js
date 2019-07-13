const http = require('http');
const EventBus = require('./EventBus');
const Db = require('./service');

const options = {
  hostname: 'data.zz.baidu.com',
  port: 80,
  path: '/urls?site=https://www.aicoder.com&token=r3pT5T9PUSMDLawO',
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
    // 'Content-Length': Buffer.byteLength(postData)
  }
};

let pageIndex = 1;
EventBus.on('mongodbConn', async () => {
  try {
    let pushBaidu = async () => {
      let idArrs = await Db.Article.find({})
      .sort({"_id": -1})
      .skip(20*(pageIndex - 1))
      .limit(20)
      .select('_id');
      if(idArrs.length <= 0) {
        return;
      }
  
      const req = http.request(options, (res) => {
        console.log(' :', );
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
          console.log('No more data in response. =====> ', pageIndex++);
          pushBaidu();
        });
      });

      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`, pageIndex++);
        pushBaidu();
      });

      // write data to request body
      idArrs.forEach(item => {
        req.write(`https://www.aicoder.com/bnews/${item._id}/d.html
        `);
        console.log(`push: ===>  https://www.aicoder.com/bnews/${item._id}/d.html`);
      })
      req.end();
    };
    pushBaidu();
  } catch (e) {
    console.log(e);
  }
});



