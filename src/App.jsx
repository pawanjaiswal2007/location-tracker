import { useState, useEffect } from 'react'
import './App.css'
import TrackLocation from './components/TrackLocation'
import ViewLocation from './components/ViewLocation'

function App() {
  const [activeTab, setActiveTab] = useState('track')
  const [backendStatus, setBackendStatus] = useState('checking...')

  useEffect(() => {
    checkBackendStatus()
  }, [])

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health')
      if (response.ok) {
        setBackendStatus('✓ Connected')
      } else {
        setBackendStatus('✗ Backend error')
      }
    } catch (error) {
      setBackendStatus('✗ Not connected')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📍 Location Tracker</h1>
        <p className="status">Backend: {backendStatus}</p>
      </header>

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'track' ? 'active' : ''}`}
          onClick={() => setActiveTab('track')}
        >
          Track Location
        </button>
        <button 
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          View Location
        </button>
      </div>

      <main className="main-content">
        {activeTab === 'track' && <TrackLocation />}
        {activeTab === 'view' && <ViewLocation />}
      </main>

      <footer className="footer">
        <p>Location Tracking System | Running on localhost</p>
      </footer>
    </div>
  )
}

export default App
