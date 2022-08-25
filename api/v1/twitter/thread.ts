import axios from 'axios'
import { Request, Response } from 'express'

export default async (req: Request, res: Response) => {
  const { access_token: token } = req.cookies
  const { tweets } = req.body

  let parentId: string = ''
  let lastId: string = ''
  for (const tweet of tweets) {
    const { data } = await axios.post('https://api.twitter.com/2/tweets', {
      text: tweet.trim(),
      ...lastId ? {
        reply: {
          in_reply_to_tweet_id: lastId
        }
      } : {}
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!parentId) {
      parentId = data?.data.id
    }
    lastId = data?.data.id
  }

  return res.send({ id: parentId })
}