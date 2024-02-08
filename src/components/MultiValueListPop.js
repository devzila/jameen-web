import React from 'react'
import { CTooltip, CButton } from '@coreui/react'

export default function MultiValueListPop(list) {
  console.log(list)
  const list_values = list.prop.map((val) => val.name)

  return (
    <div>
      <CTooltip
        content={list_values}
        placement="top"
        style={{ overflow: 'hidden' }}
        className="overflow-hidden"
      >
        <CButton variant="ghost" color="dark">
          {list_values[0]},...
        </CButton>
      </CTooltip>
    </div>
  )
}
