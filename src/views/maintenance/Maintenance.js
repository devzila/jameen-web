import React from 'react'
import TopCards from './Components/TopCards'
import MaintanceBody from './MaintenanceBody'

const Maintenance = () => {
  return (
    <>
      <TopCards />
      <MaintanceBody api_endpoint="/v1/admin/maintenance/requests" />
    </>
  )
}
export default Maintenance
