import axios from 'axios'
import { serialize } from 'cookie'
import { Request, Response } from 'express'
import QueryString from 'qs'

export default async (req: Request, res: Response) => {
  const { code } = req.body
  const { data } = await axios.post('https://api.twitter.com/2/oauth2/token', QueryString.stringify({
    grant_type: 'authorization_code',
    client_id: process.env.TWITTER_CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
    code_verifier: 'challenge',
    code
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    auth: {
      username: process.env.TWITTER_CLIENT_ID || '',
      password: process.env.TWITTER_CLIENT_SECRET || ''
    }
  })
  res.setHeader('Set-Cookie', [
    serialize('access_token', data.access_token, { maxAge: data.expires_in * 1000, httpOnly: true, secure: false }),
    serialize('refresh_token', data.refresh_token, { httpOnly: true })
  ])
  res.end(data.access_token)
}