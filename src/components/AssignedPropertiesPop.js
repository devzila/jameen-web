import React from 'react'
import { CTooltip, CButton } from '@coreui/react'

export default function AssignedPropertiesPop(properties) {
  const assigned_properties = properties.prop.map((val) => val.name)

  return (
    <div>
      <CTooltip
        content={assigned_properties}
        placement="top"
        style={{ overflow: 'hidden' }}
        className="overflow-hidden"
      >
        <CButton variant="ghost" color="dark">
          {assigned_properties[0]},...
        </CButton>
      </CTooltip>
    </div>
  )
}
