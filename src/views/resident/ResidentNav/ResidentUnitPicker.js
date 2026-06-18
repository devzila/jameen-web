import { Dropdown } from 'react-bootstrap'
import React from 'react'
import { NavLink } from 'react-router-dom'

const THEME_COLOR = '#00bfcc'

const unitToggleStyle = {
  background: 'rgba(0,191,204,0.08)',
  color: THEME_COLOR,
  border: '1px solid rgba(0,191,204,0.2)',
  borderRadius: '8px',
  padding: '4px 12px',
  fontSize: '13px',
  fontWeight: 600,
}

export default function ResidentUnitPicker(resident) {
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

  const summary = [
    ...(ownerNames?.length > 0 ? [ownerNames[0][1]] : []),
    ...(co_ownerNames?.length > 0 ? [co_ownerNames[0][1]] : []),
  ].join(', ')

  if (!summary) {
    return <span style={{ color: '#8a94a6' }}>-</span>
  }

  const toggleProps = {
    variant: 'link',
    className: 'p-0 text-decoration-none',
    style: unitToggleStyle,
  }

  return (
    <Dropdown>
      <Dropdown.Toggle {...toggleProps}>{summary}</Dropdown.Toggle>
      <Dropdown.Menu
        renderOnMount
        popperConfig={{ strategy: 'fixed' }}
        style={{
          border: '1px solid #eef1f5',
          borderRadius: '10px',
          boxShadow: '0 6px 24px rgba(0,0,0,.08)',
          padding: '6px',
        }}
      >
        {ownerNames?.length > 0 && (
          <Dropdown.ItemText style={{ fontSize: '12px', fontWeight: 700, color: '#8a94a6' }}>
            Owner
          </Dropdown.ItemText>
        )}
        {ownerNames?.map((i, index) => (
          <Dropdown.Item
            key={`owner-${index}`}
            as={NavLink}
            to={`/resident/${residentId}/property/${property}/${i[2]}/${i[0]}`}
            style={{ borderRadius: '6px', color: THEME_COLOR, fontWeight: 600 }}
          >
            {i[1]}
          </Dropdown.Item>
        ))}
        {co_ownerNames?.length > 0 && (
          <Dropdown.ItemText
            style={{ fontSize: '12px', fontWeight: 700, color: '#8a94a6', marginTop: '6px' }}
          >
            Resident
          </Dropdown.ItemText>
        )}
        {co_ownerNames?.map((i, index) => (
          <Dropdown.Item
            key={`resident-${index}`}
            as={NavLink}
            to={`/resident/${residentId}/property/${property}/${i[2]}/${i[0]}`}
            style={{ borderRadius: '6px', color: THEME_COLOR, fontWeight: 600 }}
          >
            {i[1]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}
