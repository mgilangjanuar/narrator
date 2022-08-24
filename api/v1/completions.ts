import axios from 'axios'
import { Request, Response } from 'express'

export default async (req: Request, res: Response) => {
  const { prefix, text } = req.body
  const { data } = await axios.post('https://opt.alpa.ai/completions', {
    'prompt': `${prefix}\n\n${text}`,
    'max_tokens': '96',
    'temperature': '0.7',
    'top_p': '0.5'
  })
  return res.send({ result: data?.choices[0]?.text })
}