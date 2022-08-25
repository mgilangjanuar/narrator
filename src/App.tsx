import { Layout } from 'antd'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import Auth from './pages/Auth'
import Go from './pages/Go'
import Home from './pages/Home'

function App() {
  return (
    <Layout className="App" style={{ minHeight: '100vh' }}>
      <Header />
      <Layout.Content style={{ padding: '12px 22px', marginBottom: '5vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/go" element={<Go />} />
          <Route path="/redirect" element={<Auth />} />
        </Routes>
      </Layout.Content>
      <Footer />
    </Layout>
  )
}

export default App