import { Button, Layout, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { TwitterTweetEmbed } from 'react-twitter-embed'

function Home() {
  const navigate = useNavigate()
  return (
    <Layout.Content style={{ margin: '5vh 0' }}>
      <Typography.Title level={2} style={{ textAlign: 'center' }}>
        Build a bullsh💩t story that is easy to go viral in a minute with AI.
      </Typography.Title>
      <br />
      <Typography.Paragraph style={{ textAlign: 'center' }}>
        <Button shape="round" size="large" type="primary" onClick={() => navigate('/go')}>
          Generate Now!
        </Button>
      </Typography.Paragraph>
      <br /><br />
      <TwitterTweetEmbed tweetId="1562711157885939712" />
      <TwitterTweetEmbed tweetId="1562750163273515011" />
    </Layout.Content>
  )
}

export default Home
