import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJOGv1oEpTfXvoMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1mdTItZXk0ZC5ldS5hdXRoMC5jb20wHhcNMjEwMzE2MTk0MjU2WhcN
MzQxMTIzMTk0MjU2WjAkMSIwIAYDVQQDExlkZXYtZnUyLWV5NGQuZXUuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2nQDQWkoE3zsC9NG
SoFURb6RlXOPkZZmpSiLnYFHiPLwx4/2DouiuVbwOl+UaSCPSWSHA24pUR6weyUS
WMWThaQw7AfHaSIEvvFAV70KjLjLFWc0xYJF6PASJfnG7inaz+ObP0I0Oo5LeCBe
UOwBkq/OK0oL+v3qwS2nzEV3aq9a2awiGtcEnL1c3ioBjA/Yy6pnO/ja5RV8BE/O
gH0IU+D5SxfnwHo/MWLl2Jf9tW3bfTbmI9rbrzIXSKgO6jFX9O1OFg/Kuy3VuCUw
8mWdRDg/VnfW3iJv1kt8pQIj+lUyJQIUASDT/wicm8GO7BXNRUcY8v1hBUQuLbaH
ioI64QIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRtjcOZRQmU
84qCX89pPcCCZ0XEZDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AHZ7YDgbyEVnWoUbQ+6KdV7SHuDWGezIBhMtMAt1faUEPbmAKT980y89hR7OAgCE
ErpMJ+mkTWW9VDk5w0pIEkW1wyYvewCTTBCIXtK93lRJXwFhunmskrBdt7bN7ZmE
GIRrrAUiJrGBoodvA1PQe9QdO+OyWTQuQ4eb4GAvrLGByC/IbPYi29oQD8K3UFtH
9Wr8m9F6PnKFEL4MbJLMVo1ACVg4XhWaTxVe7MYMtUpVJ54GkkA5OpVj8KrbeKzu
kQQpEX+Pys1RS2GGsg2EeX+EwHmIlnBGooEw+Y519JIzZLMuzuUm2ZPF6VhvkTis
tQ9XvccVGEEGfQWiaf8vo7s=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}

