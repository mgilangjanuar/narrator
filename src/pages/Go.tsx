import { TwitterOutlined } from '@ant-design/icons'
import { Button, Col, Collapse, Divider, Form, Input, Layout, Modal, notification, Row, Select, Space, Typography } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Tweet } from 'react-fake-tweet'
import 'react-fake-tweet/dist/index.css'
import useSWR from 'swr'
import { OBJECTIVES, STORY_TEMPLATES } from '../utils/Constant'

function Go() {
  const [form] = Form.useForm()
  const [originalText, setOriginalText] = useState()
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingThread, setLoadingThread] = useState<boolean>(false)
  const { data: twitterProfile, error: errorTwitterProfile } = useSWR<{ data: Record<string, string> }>('/api/v1/twitter/me', axios.get)
  const [showPreview, setShowPreview] = useState<boolean>(false)

  useEffect(() => {
    if (errorTwitterProfile) {
      (async () => {
        await axios.post('/api/v1/twitter/refreshToken', {}, { withCredentials: true })
      })()
    }
  }, [errorTwitterProfile])

  useEffect(() => {
    const data = localStorage.getItem('data')
    if (data) {
      const dataJSON = JSON.parse(data)
      form.setFieldsValue(dataJSON)
      setOriginalText(dataJSON.originalText)
    } else {
      form.setFieldsValue(OBJECTIVES[0])
    }
  }, [form])

  const submit = async () => {
    setLoading(true)
    const fields = form.getFieldsValue()
    try {
      const { data } = await axios.post('/api/v1/completions', fields)
      form.setFieldsValue({
        text: `${fields.text}${data?.result}`
      })
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error?.response.data?.error.message || error?.response.data?.error || 'Something error, please try again...',
      })
    } finally {
      if (!originalText || !fields.text.startsWith(originalText)) {
        setOriginalText(fields.text)
      }
      setLoading(false)
      sync(fields.text)
    }
  }

  const reset = async () => {
    form.setFieldsValue({ text: originalText })
  }

  const pickRandom = () => {
    const text = STORY_TEMPLATES[Math.floor(Math.random() * STORY_TEMPLATES.length)]
    form.setFieldsValue({ text })
    sync(text)
  }

  const sync = async (overwriteOriginalText?: string) => {
    const fields = form.getFieldsValue()
    localStorage.setItem('data', JSON.stringify({ ...fields, originalText: overwriteOriginalText || originalText }))
  }

  const generateTweets = (text: string = form.getFieldValue('text')): string[] => text
    ?.split('\n\n')
    .filter(Boolean)
    .map(t => t.trim())
    .reduce((res: string[], data: string) => {
      const chunks = data.match(/(.|[\r\n]){1,274}/g) as Array<string>
      return [...res, ...chunks.length > 1 ? chunks.map((t, i) => {
        if (i === 0) {
          return `${t}...`
        }
        if (i === chunks.length - 1) {
          return `...${t}`
        }
        return `...${t}...`
      }) : chunks]
    }, [])

  const createThread =  async () => {
    setLoadingThread(true)
    const tweets = generateTweets()
    const { data } = await axios.post('/api/v1/twitter/thread', { tweets }, { withCredentials: true })
    const url = `https://twitter.com/${twitterProfile?.data.username}/status/${data.id}`
    notification.success({
      message: 'Success',
      description: 'Your thread is generated successfully.',
      btn: <Button shape="round" href={url}>View your thread</Button>
    })
    setLoadingThread(false)
    setShowPreview(false)
  }

  return (
    <Layout.Content style={{ margin: '5vh 0' }}>
      <Row>
        <Col xs={{ span: 24 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 10, offset: 7 }}>
          <br /><br />
          <Form form={form} onFinish={submit}>
            <Form.Item name="prefix" hidden>
              <Input type="text" />
            </Form.Item>
            <Collapse accordion style={{ marginBottom: '20px' }}>
              <Collapse.Panel header="Objective" key="1">
                <Row gutter={12} align="middle">
                  <Col span={24} sm={8} md={5}>
                    <Form.Item name="type">
                      <Select disabled={loading} placeholder="Select the objective" defaultValue="Motivational" onChange={e => {
                        form.setFieldsValue({
                          prefix: OBJECTIVES.find(o => o.type === e)?.prefix
                        })
                        sync()
                      }}>
                        {OBJECTIVES?.map(obj => <Select.Option value={obj.type} key={obj.type}>{obj.type}</Select.Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24} sm={16} md={19}>
                    <Form.Item name="prefix">
                      <Input.TextArea onBlur={() => sync()} disabled={loading} autoSize />
                    </Form.Item>
                  </Col>
                </Row>
              </Collapse.Panel>
            </Collapse>
            <Form.Item name="text" rules={[{ required: true }]}>
              <Input.TextArea allowClear onBlur={() => sync()} disabled={loading} autoSize={{ minRows: 7 }} placeholder="Write your story here..." />
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button shape="round" style={{ textAlign: 'right' }} type="link" disabled={loading} onClick={pickRandom}>
                Pick a Random Story
              </Button>
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Space>
                <Button shape="round" type="primary" htmlType="submit" loading={loading}>
                  Generate
                </Button>
                <Button shape="round" type="default" disabled={loading} onClick={reset}>
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Form>
          <Divider />
          <Typography.Title level={4}>
            Create thread on Twitter 🧵🪡
          </Typography.Title>
          <Typography.Paragraph type="secondary">
            You can create a thread on Twitter automatically based on your story above by clicking the button below.
          </Typography.Paragraph>
          {!twitterProfile ? <Typography.Paragraph>
            <Button shape="round" icon={<TwitterOutlined />} type="primary" onClick={
              () => {
                const w = 600
                const h = 800
                const left = screen.width / 2 - w / 2
                const top = screen.height / 2 - h / 2
                window.open(`https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_TWITTER_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`, 'name', `height=${h},width=${w},left=${left},top=${top}`)
              }
            }>
              Log in with Twitter
            </Button>
          </Typography.Paragraph> : <Typography.Paragraph>
            <Button loading={loadingThread} type="primary" shape="round" icon={<TwitterOutlined />} onClick={() => setShowPreview(true)}>
              Preview Thread
            </Button>
          </Typography.Paragraph>}
        </Col>
      </Row>
      <Modal
        title="Preview"
        visible={showPreview}
        okButtonProps={{ shape: 'round', icon: <TwitterOutlined />, loading: loadingThread }}
        cancelButtonProps={{ shape: 'round' }}
        okText="Create Thread"
        onOk={createThread}
        onCancel={() => setShowPreview(false)}>
        <Typography.Paragraph type="secondary">
          You can edit your story before creating the thread. This action cannot be undone.
        </Typography.Paragraph>
        {generateTweets()?.map((tweet, i) => <Tweet
          key={i}
          config={{
            user: {
              avatar: twitterProfile?.data.profile_image_url,
              nickname: twitterProfile?.data.username,
              name: twitterProfile?.data.name
            },
            text: tweet,
            date: Date.now(),
            retweets: 0,
            likes: 0
          }}
        />)}
      </Modal>
    </Layout.Content>
  )
}

export default Go