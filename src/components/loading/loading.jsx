import React from 'react'
import '../../scss/loader.css'
export default function loading() {
  return (
    <div className="d-flex justify-content-cente">
      <div className="splash-screen p-5 m-5">
        <p id="display_text">Wait a moment while we load data.</p>
        <div className="loading-dot">.</div>
      </div>
    </div>
  )
}
