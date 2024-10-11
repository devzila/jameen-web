import React from 'react'
import MaintanceBody from './MaintenanceBody'

const Maintenance = () => {
  return (
    <>
      <MaintanceBody api_endpoint="/v1/admin/maintenance/requests" />
    </>
  )
}
export default Maintenance
