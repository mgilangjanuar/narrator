import axios from 'axios'
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
  return res.json(data)
}