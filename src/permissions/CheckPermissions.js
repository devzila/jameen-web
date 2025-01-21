import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { AuthContext } from 'src/contexts/AuthContext'
import { processPrivileges } from './PrivilegesFunctions'

export default function CheckPermissions({ component, keys }) {
  const { roles } = useContext(AuthContext)?.state
  console.log(useContext(AuthContext))
  const has_access = processPrivileges(roles, keys)

  console.log(has_access)

  return <>{has_access ? component : null}</>
}

CheckPermissions.propTypes = {
  component: PropTypes.element,
  keys: PropTypes.array,
}
