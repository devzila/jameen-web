import PropTypes from 'prop-types'
import React from 'react'
import { toast } from 'react-toastify'

const Msg = ({ closeToast, toastProps }) => (
  <div>
    Lorem ipsum dolor {toastProps.position}
    <button>Retry</button>
    <button onClick={closeToast}>Close</button>
  </div>
)

const Dashboard = () => {
  const displayMsg = () => {
    toast(<Msg />)
    // toast(Msg) would also work
  }

  return (
    <div>
      <button onClick={displayMsg}>Click me</button>
    </div>
  )
}

Msg.propTypes = {
  closeToast: PropTypes.any,
  toastProps: PropTypes.any,
}

export default Dashboard
