import { Button, Col, Layout, Row, Space, Typography } from 'antd'
import 'react-fake-tweet/dist/index.css'
import { ReactComponent as AutomaLogo } from './automa.svg'

function Go() {

  return (
    <Layout.Content style={{ margin: '5vh 0' }}>
      <Row>
        <Col xs={{ span: 24 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 10, offset: 7 }}>
          <br /><br />
          <Typography.Title level={2} style={{ textAlign: 'center' }}>
            <Space size={12}>
              <span>
                <img src="/logo512.png" style={{
                  width: '30px',
                  marginBottom: '5px'
                }}/> Narrator
              </span>
              <Typography.Text style={{ fontWeight: 'lighter' }}>&#88;</Typography.Text>
              <span>
                <AutomaLogo style={{
                  width: '30px', marginBottom: '-5px' }} /> Automa
              </span>
            </Space>
          </Typography.Title>
          <br />
          <Typography.Paragraph style={{ textAlign: 'center' }}>
            <Button size="large" shape="round" icon={<AutomaLogo style={{
              width: '23px', margin: '0 8px -6px 0' }} />} type="default" onClick={() => location.replace('https://www.automa.site/workflow/bJdby49DKLmQUkAOC52dx')}>
                Install Narrator Workflow
            </Button>
          </Typography.Paragraph>
          <br /><br />
          <Typography.Paragraph style={{ textAlign: 'center' }}>
            <div className="video-container">
              <iframe src="https://www.youtube.com/embed/yYKgK7yg6QU" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </Typography.Paragraph>
        </Col>
      </Row>
    </Layout.Content>
  )
}

export default Go