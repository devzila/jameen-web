import React from 'react'
import { useParams } from 'react-router-dom'
import MaintanceBody from 'src/views/maintenance/MaintenanceBody'

function PropMaintenancesCat() {
  const { propertyId } = useParams()

  const endpoint = `v1/admin/premises/properties/${propertyId}/requests`
  return (
    <>
      <MaintanceBody api_endpoint={endpoint} />
    </>
  )
}

export default PropMaintenancesCat
