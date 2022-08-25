import { GithubOutlined } from '@ant-design/icons'
import { Button, Layout } from 'antd'

function Header() {
  return <Layout.Header style={{
    position: 'relative',
    zIndex: 10,
    maxWidth: '100%',
    background: '#fff',
    boxShadow:' 0 2px 8px #f0f1f2'
  }}>
    <div style={{ float: 'right' }}>
      <Button type="text" icon={<GithubOutlined />} shape="round" size="large" href="https://github.com/mgilangjanuar/narrator" target="_blank" />
    </div>
    <div style={{
      fontSize: '1.4rem',
      fontWeight: 'bold'
    }}><a href="/" style={{ color: '#000' }}><img src="/logo512.png" style={{
        width: '1.7rem',
        marginRight: '6px'
      }}/> Narrator</a>
    </div>
  </Layout.Header>
}

export default Header