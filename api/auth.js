const { OAuth2Client } = require("google-auth-library");
const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, "postmessage");

export default async function handler(req, res) {
  const { body } = req;
  // return res.send(`Hello ${body.name}, you just parsed the request body!`);
  const { tokens } = await oAuth2Client.getToken(body.code);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.status(200).json(tokens);
}
