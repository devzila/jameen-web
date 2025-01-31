import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { AuthContext } from 'src/contexts/AuthContext'
import { processPrivileges } from './PrivilegesFunctions'

export default function CheckPermissions({ component, keys }) {
  const { roles } = useContext(AuthContext)?.state
  const has_access =
    !roles.is_admin || keys == undefined || processPrivileges(roles?.privileges, keys)
  return <>{has_access ? component : null}</>
}

CheckPermissions.propTypes = {
  component: PropTypes.element,
  keys: PropTypes.array,
}
