import { CPopover, CButton } from '@coreui/react'
import React from 'react'

function PickOwner(contract) {
  const ownerNames = contract
    ?.filter((member) => member.member_type === 'owner')
    .map((x) => x.member.name)
    .join(', ')

  const co_ownerNames = contract
    ?.filter((member) => member.member_type === 'co_owner')
    .map((x) => x.member.name)
    .join(', ')
  const result = `Owner: ${ownerNames || 'NA'} \n Residents: ${co_ownerNames || 'NA'}`

  return (
    <div>
      <CPopover
        className="border-0 p-0"
        style={{ '--cui-popover-border-radius': '0px', '--cui-popover-padding-y': '25px' }}
        content={result}
        placement="right"
        trigger={['hover', 'focus', 'click']}
      >
        <span className="d-inline-block" tabIndex={0}>
          <CButton color="white">
            {(ownerNames ? ownerNames[0] : '') +
              ' ' +
              (co_ownerNames && co_ownerNames.length > 1
                ? co_ownerNames.split(',')[0] + ',...'
                : '-')}
          </CButton>
        </span>
      </CPopover>
    </div>
  )
}

export default PickOwner
