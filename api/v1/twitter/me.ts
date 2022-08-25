import axios from 'axios'
import { Request, Response } from 'express'

export default async (req: Request, res: Response) => {
  const { access_token: token } = req.cookies
  const { data } = await axios.get('https://api.twitter.com/2/users/me?user.fields=profile_image_url', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return res.send({
    ...data?.data,
    profile_image_url: data?.data.profile_image_url?.replace('_normal', '_400x400')
  })
}