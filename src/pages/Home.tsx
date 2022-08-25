import { TwitterOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, Col, Collapse, Divider, Form, Input, Layout, Modal, notification, Row, Select, Space, Typography } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Tweet } from 'react-fake-tweet'
import 'react-fake-tweet/dist/index.css'
import { loadingMessages, objectives, storyTemplates } from '../utils/Constant'

function Home() {
  const [form] = Form.useForm()
  const [originalText, setOriginalText] = useState()
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingThread, setLoadingThread] = useState<boolean>(false)
  const [twitterProfile, setTwitterProfile] = useState<any>()
  const [showPreview, setShowPreview] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
      const req = async () => {
        const { data } = await axios.get('/api/v1/twitter/me', { withCredentials: true })
        setTwitterProfile(data)
      }
      try {
        await req()
      } catch (error) {
        await axios.post('/api/v1/twitter/refreshToken', {}, { withCredentials: true })
        await req()
      }
    })()
  }, [])

  useEffect(() => {
    const data = localStorage.getItem('data')
    if (data) {
      const dataJSON = JSON.parse(data)
      form.setFieldsValue(dataJSON)
      setOriginalText(dataJSON.originalText)
    } else {
      form.setFieldsValue(objectives[0])
    }
  }, [form])

  const submit = async () => {
    setLoading(true)
    const fields = form.getFieldsValue()
    const { data } = await axios.post('/api/v1/completions', fields)
    form.setFieldsValue({
      text: `${fields.text}${data?.result}`
    })
    if (!originalText || !fields.text.startsWith(originalText)) {
      setOriginalText(fields.text)
    }
    setLoading(false)
    sync(fields.text)
  }

  const reset = async () => {
    form.setFieldsValue({ text: originalText })
  }

  const pickRandom = () => {
    const text = storyTemplates[Math.floor(Math.random() * storyTemplates.length)]
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
      const chunks = data.match(/.{1,274}/g) as Array<string>
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
    const url = `https://twitter.com/${twitterProfile.username}/status/${data.id}`
    notification.success({
      message: 'Success',
      description: 'Your thread is generated successfully.',
      btn: <Button shape="round" href={url}>View your thread</Button>
    })
    setLoadingThread(false)
  }

  return (
    <Layout.Content style={{ margin: '5vh 0' }}>
      <Row>
        <Col xs={{ span: 24 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 10, offset: 7 }}>
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
                          prefix: objectives.find(o => o.type === e)?.prefix
                        })
                        sync()
                      }}>
                        {objectives?.map(obj => <Select.Option value={obj.type} key={obj.type}>{obj.type}</Select.Option>)}
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
              {loading && <Typography.Paragraph style={{ float: 'left' }} type="secondary" italic>
                {loadingMessages[Math.floor(Math.random() * loadingMessages.length)]}
              </Typography.Paragraph>}
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
            <Button shape="round" icon={<TwitterOutlined />} href={`https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_TWITTER_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`}>
              Log in with Twitter
            </Button>
          </Typography.Paragraph> : <Typography.Paragraph>
            <Button loading={loadingThread} type="primary" shape="round" icon={<TwitterOutlined />} onClick={() => setShowPreview(true)}>
              Preview Thread
            </Button>
          </Typography.Paragraph>}
          <Divider />
          <Typography.Title level={4}><WarningOutlined /> Disclaimer</Typography.Title>
          <Typography.Paragraph type="secondary">
            It uses Meta's OPT-175B model for text generation. <Typography.Text strong>Narrator</Typography.Text> is a research purpose project that enhances the model capabilities made by <a href="https://twitter.com/mgilangjanuar" target="_blank">@mgilangjanuar</a>. We can't ensure that this project will last long. So, use it wisely and read their <a target="_blank" href="https://opt.alpa.ai/#faq">FAQs</a>, <a href="https://github.com/facebookresearch/metaseq/blob/main/projects/OPT/MODEL_LICENSE.md" target="_blank">OPT license</a>, and <a href="https://github.com/alpa-projects/alpa/blob/main/LICENSE" target="_blank">Alpa license</a> carefully.
          </Typography.Paragraph>
        </Col>
      </Row>
      <Modal
        title="Preview"
        visible={showPreview}
        okButtonProps={{ shape: 'round', icon: <TwitterOutlined /> }}
        cancelButtonProps={{ shape: 'round' }}
        okText="Create Thread"
        onOk={() => {
          createThread()
          setShowPreview(false)
        }}
        onCancel={() => setShowPreview(false)}>
        <Typography.Paragraph type="secondary">
          You can edit your story before creating the thread. This action cannot be undone.
        </Typography.Paragraph>
        {generateTweets()?.map((tweet, i) => <Tweet
          key={i}
          config={{
            user: {
              avatar: twitterProfile?.profile_image_url,
              nickname: twitterProfile?.username,
              name: twitterProfile?.name
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

export default Home