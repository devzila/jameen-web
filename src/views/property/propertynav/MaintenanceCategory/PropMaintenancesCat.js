import React from 'react'
import { useParams } from 'react-router-dom'
import TopCards from 'src/views/maintenance/Components/TopCards'
import MaintanceBody from 'src/views/maintenance/MaintenanceBody'

function PropMaintenancesCat() {
  const { propertyId } = useParams()

  const endpoint = `v1/admin/premises/properties/${propertyId}/requests`
  return (
    <>
      <TopCards />
      <MaintanceBody api_endpoint={endpoint} />
    </>
  )
}

export default PropMaintenancesCat
