import React, { useState, useEffect } from 'react'

export default function ShowUser() {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <button
        style={{ backgroundColor: 'white', marginLeft: '4px', width: '90%', border: 'none' }}
        color="#00bfcc"
        type="button"
        className="btn btn-tertiary "
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Show User
      </button>
    </div>
  )
}
