import { useState } from 'react'

const TrackLocation = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [response, setResponse] = useState(null)

  const handleGetLocation = () => {
    setLoading(true)
    setMessage(null)

    if (!navigator.geolocation) {
      setMessage({ type: 'error', text: '❌ Geolocation not supported' })
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setAccuracy(position.coords.accuracy)
        setMessage({ type: 'success', text: '✅ Location retrieved successfully!' })
        setLoading(false)
      },
      (error) => {
        setMessage({ type: 'error', text: '❌ ' + error.message })
        setLoading(false)
      }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setResponse(null)

    if (!phoneNumber.trim() && !email.trim()) {
      setMessage({ type: 'error', text: '❌ Please enter phone or email' })
      setLoading(false)
      return
    }

    if (latitude === null || longitude === null) {
      setMessage({ type: 'error', text: '❌ Please get location first' })
      setLoading(false)
      return
    }

    try {
      const res = await fetch('http://localhost:5000/api/location/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim() || null,
          email: email.trim() || null,
          latitude,
          longitude,
          accuracy,
          address: address.trim() || null,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Location tracked! ID: ' + data.id })
        setResponse(data)
        setPhoneNumber('')
        setEmail('')
        setAddress('')
        setLatitude(null)
        setLongitude(null)
      } else {
        setMessage({ type: 'error', text: '❌ ' + data.error })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error: ' + error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>📍 Track Location</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Enter phone number OR email (or both) to track your real-time location
      </p>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="+91-9876543210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Location Name/Address</label>
          <input
            id="address"
            type="text"
            placeholder="e.g., Delhi Office, Home"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>📡 GPS Coordinates</label>
          <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <small style={{ color: '#666' }}>Latitude</small>
              <p style={{ margin: '0.25rem 0', fontWeight: 'bold' }}>
                {latitude ? latitude.toFixed(6) : '—'}
              </p>
            </div>
            <div>
              <small style={{ color: '#666' }}>Longitude</small>
              <p style={{ margin: '0.25rem 0', fontWeight: 'bold' }}>
                {longitude ? longitude.toFixed(6) : '—'}
              </p>
            </div>
            {accuracy && (
              <div style={{ gridColumn: '1 / -1' }}>
                <small style={{ color: '#666' }}>Accuracy</small>
                <p style={{ margin: '0.25rem 0', fontWeight: 'bold' }}>
                  ±{accuracy.toFixed(1)} meters
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="button-group">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleGetLocation}
            disabled={loading}
          >
            {loading ? '⏳ Getting...' : '📍 Get Location'}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '⏳ Saving...' : '✓ Save & Track'}
          </button>
        </div>
      </form>

      {response && response.analysis && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#e8f5e9', borderRadius: '6px', borderLeft: '4px solid #4caf50' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>🤖 AI Analysis</h4>
          <div style={{ fontSize: '0.9rem', color: '#1b5e20' }}>
            <p><strong>Location Type:</strong> {response.analysis.location_type}</p>
            <p><strong>Status:</strong> {response.analysis.movement_status}</p>
            <p><strong>Accuracy:</strong> {response.analysis.accuracy_level}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackLocation
