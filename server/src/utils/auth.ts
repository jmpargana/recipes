import jwt from 'express-jwt'
import jwksRsa from 'jwks-rsa'

const authConfig = {
  domain: process.env.AUTH0_DOMAIN ?? '',
  audience: process.env.AUTH0_AUDIENCE ?? ''
}

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256']
})

export default checkJwt
