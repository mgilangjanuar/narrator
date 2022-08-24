import { Layout } from 'antd'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'

function App() {
  return (
    <Layout className="App" style={{ minHeight: '100vh' }}>
      <Layout.Header style={{ paddingLeft: '27px' }}>
        <div style={{
          color: '#fff',
          fontSize: '1.4rem',
          fontWeight: 'bold',
        }}>
          Narrator <img src="/logo512.png" style={{
            width: '1.7rem',
            marginLeft: '6px'
          }}/>
        </div>
      </Layout.Header>
      <Layout.Content style={{ padding: '12px 22px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center' }}>
        Narrator | A Story Generator Engine &copy; 2022
      </Layout.Footer>
    </Layout>
  )
}

export default App