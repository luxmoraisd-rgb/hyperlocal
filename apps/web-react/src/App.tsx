import { useState } from 'react'
import { getApiHealth } from './api/client'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState('Not checked')

  async function checkApi() {
    setApiStatus('Checking…')
    try {
      const health = await getApiHealth()
      setApiStatus(`${health.service}: ${health.status}`)
    } catch {
      setApiStatus('API unavailable')
    }
  }

  return (
    <main className="workspace">
      <span className="eyebrow">PROJECT SETUP</span>
      <h1>HyperLocal</h1>
      <p>React client is ready. Product screens and flows will be built from the Figma design.</p>
      <button type="button" onClick={checkApi}>Check API connection</button>
      <p className="status" aria-live="polite">{apiStatus}</p>
    </main>
  )
}

export default App
