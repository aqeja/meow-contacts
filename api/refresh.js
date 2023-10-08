const { OAuth2Client } = require("google-auth-library");
const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

export default async function handler(req, res) {
  const { body } = req;
  const { tokens } = await oAuth2Client.refreshToken(body.refreshToken);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.status(200).json(tokens);
}
