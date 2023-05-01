import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

const Msg = ({ closeToast, toastProps }) => (
  <div>
    Unable to connect with server. Your token either expired or invalid.
    <br /> <button>Login Here</button> &nbsp;
    <button onClick={closeToast}>Close</button>
  </div>
)

export default (apiFunc) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const request = async (...args) => {
    setLoading(true)
    try {
      const result = await apiFunc(...args)
      setData(result.data.data.users)
    } catch (err) {
      setError(err.message || 'Unexpected Error!')
      if (err.response.status == 401) {
        toast(<Msg />)
      } else {
        toast('Unexpected Error!')
      }
    } finally {
      setLoading(false)
    }
  }

  Msg.propTypes = {
    closeToast: PropTypes.any,
    toastProps: PropTypes.any,
  }

  return {
    data,
    error,
    loading,
    request,
  }
}
