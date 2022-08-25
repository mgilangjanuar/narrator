import { Divider, Layout, Typography } from 'antd'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Auth from './pages/Auth'
import Home from './pages/Home'

function App() {
  return (
    <Layout className="App" style={{ minHeight: '100vh' }}>
      <Layout.Header style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '100%',
        background: '#fff',
        boxShadow:' 0 2px 8px #f0f1f2'
      }}>
        <div style={{
          fontSize: '1.4rem',
          fontWeight: 'bold',
        }}><img src="/logo512.png" style={{
            width: '1.7rem',
            marginRight: '6px'
          }}/> Narrator
        </div>
      </Layout.Header>
      <Layout.Content style={{ padding: '12px 22px', marginBottom: '5vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/redirect" element={<Auth />} />
        </Routes>
      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center' }}>
        <Divider />
        <Typography.Paragraph>
          Narrator | A Story Generator Engine &copy; 2022
        </Typography.Paragraph>
      </Layout.Footer>
    </Layout>
  )
}

export default App