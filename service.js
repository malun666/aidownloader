const EventBus = require('./EventBus');
let mongoose = require('mongoose');
let { Schema } = mongoose;
let Db = {};
// mongoose.connect('mongodb://admin:aicoder_com@localhost:27021/kk');
mongoose.connect('mongodb://admin:aicoder_com@pre.hamkd.com:27021/kk');
let con = mongoose.connection;
con.on('error', console.error.bind(console, '连接数据库失败'));
con.once('open', () => {
  const ArticleSchema = new Schema({
    SubName: { required: true, type: String, trim: true },
    SubOn: { type: Date, default: Date.now() },
    Del: { type: Boolean, default: false },
    IsHot: { type: Boolean, default: false },
    Remark: { type: String, trim: true, default: '' },
    Content: { type: String, trim: false, default: '' },
    Title: { type: String, trim: true, default: '' },
    Tages: { type: String, trim: true, default: '' },
    Favs: { type: Number, default: 0 },
    Vote: { type: Number, default: 0 },
    Opend: { type: Number, default: 0 },
    UserId: Schema.Types.ObjectId,
    Comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
  });
  const ArtSchema = new Schema({
    SubName: { required: true, type: String, trim: true },
    SubOn: { type: Date, default: Date.now() },
    Del: { type: Boolean, default: false },
    IsHot: { type: Boolean, default: false },
    Remark: { type: String, trim: true, default: '' },
    Content: { type: String, trim: false, default: '' },
    Title: { type: String, trim: true, default: '' },
    Tages: { type: String, trim: true, default: '' },
    Favs: { type: Number, default: 0 },
    Vote: { type: Number, default: 0 },
    Opend: { type: Number, default: 0 },
    UserId: Schema.Types.ObjectId,
    Comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
  });
  Db.Article = mongoose.model('ArticleBoot', ArticleSchema);
  Db.Art = mongoose.model('Article', ArtSchema);
  EventBus.emit('mongodbConn')
});
module.exports = Db;
