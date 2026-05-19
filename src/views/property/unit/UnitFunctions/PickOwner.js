import { CTooltip, CButton } from '@coreui/react'
import React from 'react'

const MEMBER_TYPES_BY_VALUE = ['owner', 'co_owner', 'primary_resident', 'resident']

function normalizeMemberType(memberType) {
  if (memberType == null) return null

  if (typeof memberType === 'number') {
    return MEMBER_TYPES_BY_VALUE[memberType] ?? null
  }

  if (typeof memberType === 'string' && /^\d+$/.test(memberType)) {
    return MEMBER_TYPES_BY_VALUE[Number(memberType)] ?? null
  }

  return String(memberType).trim().toLowerCase().replace(/-/g, '_')
}

function resolveContractMembers(source) {
  if (!source) return []
  if (Array.isArray(source)) return source
  if (Array.isArray(source.contract_members)) return source.contract_members
  return []
}

function memberDisplayName(entry) {
  const member = entry?.member ?? entry
  if (!member) return null

  if (member.name?.trim()) {
    return member.name.trim()
  }

  const fullName = [member.first_name, member.last_name].filter(Boolean).join(' ').trim()
  return fullName || null
}

function isOwnerMember(entry) {
  const type = normalizeMemberType(entry?.member_type)
  return type === 'owner' || type === 'co_owner'
}

function isResidentMember(entry) {
  const type = normalizeMemberType(entry?.member_type)
  return type === 'primary_resident' || type === 'resident'
}

function PickOwner(contractMembers, tooltipMode = 'all') {
  const mode = tooltipMode === true ? 'owner' : tooltipMode === false ? 'all' : tooltipMode
  const members = resolveContractMembers(contractMembers)

  const ownerNames = members
    .filter(isOwnerMember)
    .map(memberDisplayName)
    .filter((name) => name)
    .join(', ')

  const residentNames = members
    .filter(isResidentMember)
    .map(memberDisplayName)
    .filter((name) => name)
    .join(', ')

  const showOwnerInTooltip = mode !== 'residents'
  const showResidentsInTooltip = mode !== 'owner'

  const tooltipContent = (
    <div className="text-start" style={{ whiteSpace: 'pre-line' }}>
      {showOwnerInTooltip ? (
        <div>
          <strong>Owner:</strong> {ownerNames || 'N/A'}
        </div>
      ) : null}
      {showResidentsInTooltip ? (
        <div>
          <strong>Residents:</strong> {residentNames || 'N/A'}
        </div>
      ) : null}
    </div>
  )

  const displayLabel = ownerNames || residentNames || '-'

  const displaySuffix =
    ownerNames && residentNames && mode === 'all'
      ? ` ${residentNames.split(',')[0].trim()},...`
      : ''

  return (
    <div>
      <CTooltip
        key={`${ownerNames}|${residentNames}`}
        content={tooltipContent}
        placement="right"
        trigger={['hover', 'focus']}
      >
        <span className="d-inline-block p-0" tabIndex={0}>
          <CButton color="white" className="p-0 text-start">
            {displayLabel}
            {displaySuffix}
          </CButton>
        </span>
      </CTooltip>
    </div>
  )
}

export default PickOwner
