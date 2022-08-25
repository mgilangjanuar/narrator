import axios from 'axios'
import { serialize } from 'cookie'
import { Request, Response } from 'express'
import QueryString from 'qs'

export default async (req: Request, res: Response) => {
  const { refresh_token: token } = req.cookies
  const { data } = await axios.post('https://api.twitter.com/2/oauth2/token', QueryString.stringify({
    grant_type: 'refresh_token',
    client_id: process.env.TWITTER_CLIENT_ID,
    refresh_token: token
  }), {
    auth: {
      username: process.env.TWITTER_CLIENT_ID || '',
      password: process.env.TWITTER_CLIENT_SECRET || ''
    }
  })
  res.setHeader('Set-Cookie', [
    serialize('access_token', data.access_token, { maxAge: data.expires_in * 1000 }),
    serialize('refresh_token', data.refresh_token)
  ])
  res.end(data.access_token)
}