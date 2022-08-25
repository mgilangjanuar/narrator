import { TwitterOutlined } from '@ant-design/icons'
import { Button, Col, Collapse, Divider, Form, Input, Layout, Row, Select, Space, Typography } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { loadingMessages, objectives, storyTemplates } from '../utils/Constant'

function Home() {
  const [form] = Form.useForm()
  const [originalText, setOriginalText] = useState()
  const [loading, setLoading] = useState<boolean>(false)
  const [twitterProfile, setTwitterProfile] = useState<any>()

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/v1/twitter/me', { withCredentials: true })
        setTwitterProfile(data)
      } catch (error) {
        // ignore
      }
    })()
  }, [])

  useEffect(() => {
    form.setFieldsValue(objectives[0])
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
  }

  const reset = async () => {
    form.setFieldsValue({ text: originalText })
  }

  const pickRandom = () => {
    form.setFieldsValue({ text: storyTemplates[Math.floor(Math.random() * storyTemplates.length)] })
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
                      <Select disabled={loading} placeholder="Select the objective" defaultValue="motivate" onChange={e => {
                        form.setFieldsValue({
                          prefix: objectives.find(o => o.type === e)?.prefix
                        })
                      }}>
                        {objectives?.map(obj => <Select.Option value={obj.type} key={obj.type}>{obj.type}</Select.Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24} sm={16} md={19}>
                    <Form.Item name="prefix">
                      <Input.TextArea disabled={loading} autoSize />
                    </Form.Item>
                  </Col>
                </Row>
              </Collapse.Panel>
            </Collapse>
            <Form.Item name="text" rules={[{ required: true }]}>
              <Input.TextArea disabled={loading} autoSize={{ minRows: 7 }} placeholder="Write your story here..." />
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
          {!twitterProfile && <Typography.Paragraph>
            <Button shape="round" icon={<TwitterOutlined />} href={`https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_TWITTER_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`}>
              Log in with Twitter
            </Button>
          </Typography.Paragraph>}
        </Col>
      </Row>
    </Layout.Content>
  )
}

export default Home