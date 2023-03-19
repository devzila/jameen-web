import React from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
const ProtectedRoutes = ({ isSignedIn, children }) => {
  if (!isSignedIn) {
    return <Navigate to="/login" replace />
  }
  return children
}

ProtectedRoutes.propTypes = {
  isSignedIn: PropTypes.bool,
  children: PropTypes.element,
}

export default ProtectedRoutes
