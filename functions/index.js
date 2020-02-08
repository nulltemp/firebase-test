require('dotenv').config({path: process.env.NODE_ENV !== 'production' ? ".env" : ".env.production"})

const admin = require('firebase-admin')
const functions = require('firebase-functions');
const axios = require('axios');

var serviceAccount = require("./serviceAcount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.hello = functions.https.onRequest((req, res) => {
  res.send('Hello, World')
});

exports.authWithSlack = functions.https.onRequest(async (req, res) => {
  const slackAuthCode = req.query.code;

  if (!slackAuthCode) {
    console.warn('code query string not find.')
    res.status(400).end();
  }

  let userCredential;
  try {
    const res = await axios.get("https://slack.com/api/oauth.access", {
      params: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code: slackAuthCode,
        redirect_url: process.env.USE_REDIRECT_URL
      }
    });
    userCredential = res.data;
  } catch(e) {
    console.warn('Slack oauth was failed.', e);
    throw new Error();
  }

  try {
    const customToken = await admin.auth().createCustomToken(userCredential.user_id);

    const url = new URL(process.env.REDIRECT_URL);
    url.search = `t=${customToken}`;
    res.redirect(303, url.toString());
  } catch (e) {
    console.error('Failed to create custom token:', e)
    throw new Error();
  }
});