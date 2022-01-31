import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import FormData from 'form-data';
import { verify } from 'jsonwebtoken';

const key = process.env.TOKEN_SECURITY_KEY;
const { SUMSUB_APP_TOKEN, SUMSUB_SECRET_KEY, SUMSUB_BASE_URL } = process.env;

const router = express.Router();

router.post('/sumsubAccesToken', async (req, res) => {
  const { userToken } = req.body;
  const { userId }: any = verify(userToken, key);

  const accessData = await axios({ ...createAccessToken(userId), method: 'post' })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log('Error:\n', error);
    });
  res.status(200).send(accessData);
});

const createAccessToken = (
  externalUserId,
  levelName = 'basic-kyc-level',
  ttlInSecs = 600,
) => {
  console.log('Creating an access token for initializng SDK...');

  const method = 'post';
  const url = `/resources/accessTokens?userId=${externalUserId}&ttlInSecs=${ttlInSecs}&levelName=${levelName}`;

  const config = {
    url,
    method,
    headers: {},
    data: null,
  };

  return createSignature(config);
};

function createSignature(config) {
  console.log('Creating a signature for the request...');

  var ts = Math.floor(Date.now() / 1000);
  const signature = crypto.createHmac('sha256', SUMSUB_SECRET_KEY);
  signature.update(ts + config.method.toUpperCase() + config.url);

  if (config.data instanceof FormData) {
    signature.update(config.data.getBuffer());
  } else if (config.data) {
    signature.update(config.data);
  }

  config.headers['Accept'] = 'application/json';
  config.headers['X-App-Token'] = SUMSUB_APP_TOKEN;
  config.headers['X-App-Access-Ts'] = ts;
  config.headers['X-App-Access-Sig'] = signature.digest('hex');
  config.baseURL = SUMSUB_BASE_URL;
  return config;
}

router.post('/applicantData', async (req, res) => {
  try {
    const { userToken } = req.body;
    const { userId }: any = verify(userToken, key);

    const config = {
      url: `/resources/applicants/-;externalUserId=${userId}/one`,
      method: 'get',
      headers: {},
      data: null,
    };

    const applicant = await axios(createSignature(config))
      .then(response => response.data)
      .catch(error => console.log(error));
    if (applicant) res.status(200).send({ ...applicant, status: 200 });
    else res.status(200).send({ status: 404 });
  } catch (error) {
    console.log(error.name);
    if (error.name === 'TokenExpiredError') res.status(500).send({ error: error.name });
  }
});

export default router;
