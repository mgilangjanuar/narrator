import { Layout, notification, Typography } from 'antd'
import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function Auth() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (params.get('code')) {
      (async () => {
        try {
          await axios.post('/api/v1/twitter/accessToken', {
            code: params.get('code')
          }, { withCredentials: true })
        } catch (error: any) {
          notification.error({
            message: 'Error',
            description: error?.response.data?.error.message || error?.response.data?.error || 'Something error, please try again...',
          })
        } finally {
          navigate('/')
        }
      })()
    }
  }, [params])

  return (
    <Layout.Content style={{ margin: '5vh 0' }}>
      <Typography.Paragraph italic>
        Logging in...
      </Typography.Paragraph>
    </Layout.Content>
  )
}

export default Auth