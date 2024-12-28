import { Dropdown } from 'react-bootstrap'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

function ResidentUnitPicker(resident) {
  console.log(resident)
  const contract = resident.membership
  const property = resident.property_id
  const residentId = resident.id
  const ownerNames = contract
    ?.filter((member) => member.member_type === 'owner')
    .map((x) => [x.unit_contract.id, x.unit_contract.unit.unit_no, x.unit_contract.contract_type])

  const co_ownerNames = contract
    ?.filter(
      (member) => member.member_type === 'co_owner' || member.member_type === 'primary_resident',
    )
    .map((x) => [x.unit_contract.id, x.unit_contract.unit.unit_no, x.unit_contract.contract_type])

  const result = `Owner: ${ownerNames || 'NA'} \n Residents: ${co_ownerNames || 'NA'} `
  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle className="ms-2 text-start text-black h-100 w-100 border-0 rounded-0 transparent-bg resident-unit-dropdown">
          {(ownerNames && ownerNames.length > 1 ? ownerNames[0][1] + '...' : '') +
            ' ' +
            (co_ownerNames && co_ownerNames.length > 1 ? co_ownerNames[0][1] + ',...' : '-')}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item eventKey="1">
            <p className="d-inline me-1">Owner:</p>
            {ownerNames.map((i, index) => (
              <NavLink key={index} to={`${residentId}/property/${property}/${i[2]}/${i[0]}`}>
                {i[1]}
              </NavLink>
            ))}
          </Dropdown.Item>
          <Dropdown.Item eventKey="2">
            <p className="d-inline me-1"> Co-Owner:</p>

            {co_ownerNames.map((i, index) => (
              <NavLink key={index} to={`${residentId}/property/${property}/${i[2]}/${i[0]}`}>
                {i[1]}
              </NavLink>
            ))}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default ResidentUnitPicker

// <CPopover
// className="border-0 p-0"
// style={{ '--cui-popover-border-radius': '0px', '--cui-popover-padding-y': '25px' }}
// content={result}
// placement="right"
// trigger={['hover', 'focus', 'click']}
// >
// <span className="d-inline-block p-0" tabIndex={0}>
//   <CButton color="white" className="p-0">
//     {(ownerNames ? ownerNames.split(',')[0] : '') +
//       ' ' +
//       (co_ownerNames && co_ownerNames.length > 1
//         ? co_ownerNames.split(',')[0] + ',...'
//         : '-')}
//   </CButton>
// </span>
// </CPopover>
