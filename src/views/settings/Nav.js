import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import User from './User'

export default function Nav({ children }) {
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)

  return (
    <div className="body-box-new sectio new-settings-box" style={{ border: 'none' }}>
      <div className="new-settings-menu">
        <div className="menu-list">
          <div>
            <Link to="/settings/roles">Role</Link>
          </div>
          <div>
            <Link to="/settings/users">User</Link>
          </div>
          <div>
            <Link to="/setting/allotment"> Allotment </Link>
          </div>
          <div>
            <Link to="/setting/moving-out"> Moving Out </Link>
          </div>
          <div>
            <Link to="/setting/integrations"> Integrations </Link>
          </div>
          <div>
            <Link to="/setting/workflow_settings"> Workflow </Link>
          </div>
        </div>
      </div>
      {/*<div className="clearfix">{children || <User />}</div>*/}
    </div>
  )
}

Nav.propTypes = {
  children: PropTypes.node,
}
