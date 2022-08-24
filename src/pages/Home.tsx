import { Button, Col, Collapse, Form, Input, Layout, Row, Select, Space, Typography } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'

function Home() {
  const [form] = Form.useForm()
  const [originalText, setOriginalText] = useState()
  const [loading, setLoading] = useState<boolean>(false)

  const objectives = [
    {
      type: 'Motivational',
      prefix: 'The motivational story for a social media post.'
    },
    {
      type: 'Article',
      prefix: 'A good article to publish a blog post.'
    },
    {
      type: 'Person',
      prefix: 'Description of someone that is mentioned.'
    },
    {
      type: 'QnA',
      prefix: 'The best answer for this question based on facts.'
    },
    {
      type: 'Custom',
      prefix: ''
    }
  ]

  const loadingMessages = [
    'Generating story...',
    'It is taking longer than usual...',
    'You can grab a coffee and wait for a while...',
    'Relax and enjoy the view...',
    'Please walk around and wait for it...',
    'Take a break and please wait...'
  ]

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
                      <Select placeholder="Select the objective" defaultValue="motivate" onChange={e => {
                        form.setFieldsValue({
                          prefix: objectives.find(o => o.type === e)?.prefix
                        })
                      }}>
                        {objectives?.map(obj => <Select.Option value={obj.type}>{obj.type}</Select.Option>)}
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
              {loading && <Typography.Paragraph style={{ float: 'left' }} type="secondary" italic>
                {loadingMessages[Math.floor(Math.random() * loadingMessages.length)]}
              </Typography.Paragraph>}
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Generate
                </Button>
                <Button type="default" disabled={loading} onClick={reset}>
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Layout.Content>
  )
}

export default Home