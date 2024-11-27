import React from 'react'
import Sidebar from './sidebar.jsx'
import Dashboard from './dashboard.jsx' 
import Home from './home.jsx'// Make sure to create this file

function home() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Dashboard />
    </div>
    
  )
}

export default home;