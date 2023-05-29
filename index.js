const argon2 = require('argon2');
const bodyParser = require('body-parser');

const app = require('express')();

const apiKey = [...require('./apiKey.json'), ...(process.env.API_KEY || '').split(',').map(key => key.trim())];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  let authHeader = req.get('authorization');
  if(!authHeader) return res.status(401).end();
  authHeader = authHeader.split(' ');
  if(authHeader[0].toLowerCase() === 'bearer' && apiKey.indexOf(authHeader[1]) !== -1) {
    return next();
  }
  else {
    return res.status(401).end();
  }
});

app.post('/argon2/hash', async(req, res) => {
  const { password } = req.body;
  if(!password) return res.status(400).end();
  const hash = await argon2.hash(req.body.password);
  res.json({hash});
});
app.post('/argon2/verify', async(req, res) => {
  const { password, hash } = req.body;
  if(!password || !hash) return res.status(400).end();
  const match = await argon2.verify(hash, password);
  res.json({match});
});

module.exports = app;
