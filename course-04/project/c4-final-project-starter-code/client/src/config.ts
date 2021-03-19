// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'bh40pe3s29'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-fu2-ey4d.eu.auth0.com',            // Auth0 domain
  clientId: 'xTXB4jhAcLVDo4jBGXySrNBhN27qjCl9',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
