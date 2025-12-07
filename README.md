# 📍 Location Tracker

A full-stack location tracking web application built with React.js (frontend) and Node.js/Express (backend) that allows users to track and view locations by phone number and email ID.

## Features

✓ **Track Location**: Get real-time GPS coordinates from your device  
✓ **Store Location Data**: Save location with phone number and email  
✓ **View Locations**: Retrieve location history by phone number and email  
✓ **Google Maps Integration**: View tracked locations on Google Maps  
✓ **User History**: View all location records for a user  
✓ **Delete Records**: Remove location records as needed  
✓ **SQLite Database**: Persistent storage of all location data  
✓ **Responsive UI**: Works on desktop and mobile devices  

## Tech Stack

**Frontend:**
- React.js 19
- Vite (build tool)
- CSS3 with responsive design

**Backend:**
- Node.js
- Express.js
- SQLite3 (database)
- CORS enabled for frontend communication

## Quick Start

### Installation & Setup

#### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)

#### Step 1: Install Frontend Dependencies
```bash
npm install
```

#### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

#### Step 3: Start Both Backend and Frontend
```bash
npm start
```

### Running the Application

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:5000

## Project Structure

```
location.track/
├── src/
│   ├── components/
│   │   ├── TrackLocation.jsx      # Track location component
│   │   └── ViewLocation.jsx       # View location component
│   ├── App.jsx                    # Main app component
│   ├── App.css                    # Styling
│   └── main.jsx                   # Entry point
├── backend/
│   ├── server.js                  # Express server
│   ├── package.json               # Backend dependencies
│   └── locations.db               # SQLite database (auto-created)
└── package.json                   # Frontend dependencies
```

## API Endpoints

### Track Location
```
POST /api/location/track
Body: { phoneNumber, email, latitude, longitude, address }
```

### Get Latest Location
```
GET /api/location/latest?phoneNumber=...&email=...
```

### Get Location History
```
GET /api/location/get?phoneNumber=...&email=...
```

### Get All Users
```
GET /api/users
```

### Delete Location
```
DELETE /api/location/delete/:id
```

## Usage

1. **Track Location**: Enter phone & email, click "Get My Location", then "Save & Track"
2. **View Location**: Enter phone & email, click "View Latest" or "View History"
3. **Google Maps**: Click "View on Google Maps" to see location on map

## Browser Requirements

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

*Geolocation requires a secure context (HTTPS) or localhost*

---

**Status:** Production Ready ✓
# location-tracker
