import { WarningOutlined } from '@ant-design/icons'
import { Col, Divider, Layout, Row, Typography } from 'antd'

function Footer() {
  return <Layout.Footer style={{ textAlign: 'center' }}>
    <Divider />
    <Row>
      <Col xs={{ span: 24 }} sm={{ span: 22, offset: 1 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 10, offset: 7 }}>
        <Typography.Title level={4}><WarningOutlined /> Disclaimer</Typography.Title>
        <Typography.Paragraph type="secondary">
          It uses Meta's OPT-175B model for text generation. <Typography.Text strong>Narrator</Typography.Text> is a research purpose project that enhances the model capabilities made by <a href="https://twitter.com/mgilangjanuar" target="_blank">@mgilangjanuar</a>. We can't ensure that this project will last long. So, use it wisely and read their <a target="_blank" href="https://opt.alpa.ai/#faq">FAQs</a>, <a href="https://github.com/facebookresearch/metaseq/blob/main/projects/OPT/MODEL_LICENSE.md" target="_blank">OPT license</a>, and <a href="https://github.com/alpa-projects/alpa/blob/main/LICENSE" target="_blank">Alpa license</a> carefully.
        </Typography.Paragraph>
      </Col>
    </Row>
    <Typography.Paragraph>
      Narrator | A Story Generator Engine &copy; 2022
    </Typography.Paragraph>
  </Layout.Footer>
}

export default Footer