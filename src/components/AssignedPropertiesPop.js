import React from 'react'
import { CTooltip, CButton } from '@coreui/react'

export default function AssignedPropertiesPop(properties) {
  console.log(properties.prop.map((ky) => ky.name))
  const assigned_properties = properties.prop.map((val) => val.name)
  const customTooltipStyle = {
    '--cui-tooltip-bg': 'var(--cui-primary)',
    overflow: 'hidden',
  }
  return (
    <div>
      <CTooltip
        content={assigned_properties}
        placement="top"
        style={customTooltipStyle}
        className="overflow-hidden"
      >
        <CButton color="secondary">{assigned_properties[0]}...</CButton>
      </CTooltip>
    </div>
  )
}
