import { useState, useEffect } from 'react'

const ViewLocation = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchAllUsers()
  }, [])

  const fetchAllUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users')
      const data = await response.json()
      if (data.success) setAllUsers(data.users || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleViewLocation = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setLocations([])
    setStats(null)

    if (!phoneNumber.trim() && !email.trim()) {
      setMessage({ type: 'error', text: '❌ Enter phone or email' })
      setLoading(false)
      return
    }

    try {
      const params = new URLSearchParams()
      if (phoneNumber.trim()) params.append('phoneNumber', phoneNumber.trim())
      if (email.trim()) params.append('email', email.trim())

      const [locRes, statsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/location/latest?${params.toString()}`),
        fetch(`http://localhost:5000/api/location/stats?${params.toString()}`)
      ])

      const locData = await locRes.json()
      const statsData = await statsRes.json()

      if (locData.success && locData.location) {
        setLocations([locData.location])
        setStats(statsData.statistics)
        setMessage({ type: 'success', text: '✅ Latest location found!' })
      } else {
        setMessage({ type: 'info', text: 'ℹ️ No location data found' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error: ' + error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleViewHistory = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setLocations([])

    if (!phoneNumber.trim() && !email.trim()) {
      setMessage({ type: 'error', text: '❌ Enter phone or email' })
      setLoading(false)
      return
    }

    try {
      const params = new URLSearchParams()
      if (phoneNumber.trim()) params.append('phoneNumber', phoneNumber.trim())
      if (email.trim()) params.append('email', email.trim())

      const response = await fetch(`http://localhost:5000/api/location/history?${params.toString()}`)
      const data = await response.json()

      if (data.success && data.locations.length > 0) {
        setLocations(data.locations)
        setMessage({ type: 'success', text: `✅ Found ${data.count} location(s)` })
      } else {
        setMessage({ type: 'info', text: 'ℹ️ No history found' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error: ' + error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLocation = async (id) => {
    if (!window.confirm('Delete this record?')) return

    try {
      const response = await fetch(`http://localhost:5000/api/location/delete/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        setLocations(locations.filter(loc => loc.id !== id))
        setMessage({ type: 'success', text: '✅ Location deleted' })
      } else {
        setMessage({ type: 'error', text: '❌ Failed to delete' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error: ' + error.message })
    }
  }

  const handleSelectUser = (user) => {
    setPhoneNumber(user.phone_number || '')
    setEmail(user.email || '')
  }

  return (
    <div className="card">
      <h2>🔍 View Location</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Search by phone number or email to view saved locations
      </p>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleViewLocation}>
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

        <div className="button-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '⏳ Loading...' : '📍 View Latest'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleViewHistory}
            disabled={loading}
          >
            {loading ? '⏳ Loading...' : '📚 View History'}
          </button>
        </div>
      </form>

      {allUsers.length > 0 && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem' }}>📋 Recent Users:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {allUsers.map((user, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-secondary"
                onClick={() => handleSelectUser(user)}
                style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.85rem' }}
              >
                <div>
                  <strong>{user.phone_number || user.email}</strong>
                  <br />
                  <small>{user.email || user.phone_number}</small>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {stats && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#e3f2fd', borderRadius: '6px', borderLeft: '4px solid #2196f3' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#1565c0' }}>📊 Statistics</h4>
          <div style={{ fontSize: '0.9rem', color: '#0d47a1' }}>
            <p><strong>Total Records:</strong> {stats.total}</p>
            {stats.avg_accuracy && <p><strong>Avg Accuracy:</strong> ±{stats.avg_accuracy.toFixed(1)}m</p>}
          </div>
        </div>
      )}

      {locations.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>📍 Location Results:</h3>
          {locations.map((location, index) => (
            <div key={location.id || index} className="location-card">
              <div className="location-info">
                {location.phone_number && (
                  <div className="info-item">
                    <span className="info-label">📱 Phone</span>
                    <span className="info-value">{location.phone_number}</span>
                  </div>
                )}
                {location.email && (
                  <div className="info-item">
                    <span className="info-label">📧 Email</span>
                    <span className="info-value">{location.email}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">🎯 Latitude</span>
                  <span className="info-value">{location.latitude.toFixed(6)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">🎯 Longitude</span>
                  <span className="info-value">{location.longitude.toFixed(6)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📍 Coordinates</span>
                  <span className="info-value" style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#667eea' }}>
                    {location.readable_coords || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                  </span>
                </div>
                {location.accuracy && (
                  <div className="info-item">
                    <span className="info-label">📡 Accuracy</span>
                    <span className="info-value">±{location.accuracy.toFixed(1)}m</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">📍 Address</span>
                  <span className="info-value">{location.address || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">⏰ Time</span>
                  <span className="info-value" style={{ fontSize: '0.85rem' }}>
                    {new Date(location.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f7ff', borderRadius: '6px', borderLeft: '4px solid #2196f3' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#1565c0', fontSize: '0.95rem' }}>🗺️ Open Location Links:</h4>
                <div className="button-group" style={{ gap: '0.5rem' }}>
                  {location.maps_links?.google_maps && (
                    <a
                      href={location.maps_links.google_maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ textDecoration: 'none', fontSize: '0.9rem', padding: '0.65rem 1rem' }}
                    >
                      🌍 Google Maps
                    </a>
                  )}
                  {location.maps_links?.apple_maps && (
                    <a
                      href={location.maps_links.apple_maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ textDecoration: 'none', fontSize: '0.9rem', padding: '0.65rem 1rem' }}
                    >
                      🍎 Apple Maps
                    </a>
                  )}
                  {location.maps_links?.openstreetmap && (
                    <a
                      href={location.maps_links.openstreetmap}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ textDecoration: 'none', fontSize: '0.9rem', padding: '0.65rem 1rem' }}
                    >
                      🗺️ OpenStreetMap
                    </a>
                  )}
                </div>
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fff', borderRadius: '4px', fontSize: '0.85rem', fontFamily: 'monospace', color: '#333' }}>
                  <strong>Coordinates:</strong> {location.readable_coords || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                </div>
              </div>

              <div className="button-group" style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteLocation(location.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {locations.length === 0 && !loading && message === null && (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <div className="empty-state-icon">🔍</div>
          <p>Enter details above to search locations</p>
        </div>
      )}
    </div>
  )
}

export default ViewLocation
