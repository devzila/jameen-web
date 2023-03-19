import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'

const ProtectedRoutes = ({ children }) => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')) || true)
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

ProtectedRoutes.propTypes = {
  isSignedIn: PropTypes.bool,
  children: PropTypes.element,
}

export default ProtectedRoutes
