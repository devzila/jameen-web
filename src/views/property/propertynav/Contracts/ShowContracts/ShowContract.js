import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import useFetch from 'use-http'
import { CAvatar } from '@coreui/react'
import { formatdate } from '../../../../../services/CommonFunctions'
import { NavLink, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Loading from 'src/components/loading/loading'
import Invoices from './Invoice'
import defaultAvatar from '../../../../../assets/images/avatars/default.png'
import MovingInUnit from 'src/views/property/unit/MovingInUnit'
import ContractDocuments from './ContractDocuments'
import ContractCreditNotes from './ContractCreditNotes'

const THEME_COLOR = '#00bfcc'

const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,.05)',
  overflow: 'hidden',
}

const tileGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '14px',
}

const headerCellStyle = {
  color: '#8a94a6',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  borderBottom: '1px solid #eef1f5',
  padding: '14px 16px',
  whiteSpace: 'nowrap',
}

const bodyCellStyle = {
  padding: '14px 16px',
  borderBottom: '1px solid #f2f4f7',
  color: '#1f2933',
  verticalAlign: 'middle',
}

function contractTypeBadgeStyle() {
  return {
    background: 'rgba(0,191,204,0.12)',
    color: THEME_COLOR,
    padding: '4px 14px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'capitalize',
    display: 'inline-block',
  }
}

function memberTypeBadgeStyle() {
  return {
    background: 'rgba(0,191,204,0.12)',
    color: THEME_COLOR,
    padding: '4px 14px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'capitalize',
    display: 'inline-block',
  }
}

function SectionTitle({ icon, children, action }) {
  return (
    <div
      className="d-flex justify-content-between align-items-center flex-wrap"
      style={{ gap: '12px', marginBottom: '16px' }}
    >
      <div className="d-flex align-items-center" style={{ gap: '10px' }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'rgba(0,191,204,0.12)',
            color: THEME_COLOR,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CIcon icon={icon} />
        </div>
        <h6 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
          {children}
        </h6>
      </div>
      {action ? <div className="d-flex align-items-center">{action}</div> : null}
    </div>
  )
}

SectionTitle.propTypes = {
  icon: PropTypes.array,
  children: PropTypes.node,
  action: PropTypes.node,
}

function InfoTile({ label, value }) {
  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #eef1f5',
        borderRadius: '12px',
        padding: '14px 16px',
      }}
    >
      <div
        style={{
          color: '#8a94a6',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '6px',
        }}
      >
        {label}
      </div>
      <div className="text-capitalize" style={{ fontWeight: 600, color: '#1f2933' }}>
        {value || '-'}
      </div>
    </div>
  )
}

InfoTile.propTypes = {
  label: PropTypes.node,
  value: PropTypes.node,
}

function resolveMemberAvatarSrc(avatar) {
  if (typeof avatar === 'string' && avatar.trim() !== '') {
    return avatar.trim()
  }
  return defaultAvatar
}

export default function ShowContract() {
  const { propertyId, contractId } = useParams()
  const params = useParams()
  const { get, response, loading } = useFetch()
  const [contract, setContractData] = useState({})

  const pathParts = (params['*'] || '').split('/')
  const for_moving_in = pathParts[0] === 'moving-in' || pathParts[2] === 'moving_in'

  useEffect(() => {
    loadInitialContractData()
  }, [propertyId, contractId])

  async function loadInitialContractData() {
    const endpoint = `/v1/admin/premises/properties/${propertyId}/contracts/${contractId}`
    const initialContractData = await get(endpoint)
    if (response.ok) {
      setContractData(initialContractData.data)
    }
  }

  const backPath = for_moving_in
    ? `/properties/${propertyId}/moving-in`
    : `/properties/${propertyId}/Contracts`

  const pageTitle = for_moving_in ? 'Moving In Details' : 'Contract Details'
  const unitLabel = contract?.unit?.unit_no
    ? `${contract.unit.unit_no}${
        contract.unit.building?.name ? ` (${contract.unit.building.name})` : ''
      }`
    : 'Contract'

  const periodValue = `${formatdate(contract.start_date) || '-'} – ${
    formatdate(contract.end_date) || 'Present'
  }`

  if (loading && !contract?.id) {
    return (
      <div style={{ padding: '20px' }}>
        <Loading />
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .contract-members-table tbody tr { transition: background-color .15s ease; }
        .contract-members-table tbody tr:hover { background-color: #f5fdfe; }
      `}</style>

      {/* Hero */}
      <div
        style={{
          ...cardStyle,
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div className="d-flex align-items-center" style={{ gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #0098a3 100%)`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CIcon icon={freeSet.cilDescription} size="xl" />
          </div>
          <div>
            <div className="d-flex align-items-center flex-wrap" style={{ gap: '10px' }}>
              <h4 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                {pageTitle}
              </h4>
              {contract?.contract_type ? (
                <span style={contractTypeBadgeStyle()}>
                  {contract.contract_type.replace(/_/g, ' ')}
                </span>
              ) : null}
            </div>
            <div style={{ color: '#8a94a6', marginTop: '4px' }}>{unitLabel}</div>
          </div>
        </div>

        <div className="d-flex align-items-center flex-wrap" style={{ gap: '10px' }}>
          {contract?.unit?.status === 'vacant' ? (
            <MovingInUnit
              unitId={contract?.unit?.id}
              unitNo={contract?.unit?.unit_no}
              after_submit={loadInitialContractData}
            />
          ) : null}
          <NavLink
            to={backPath}
            className="btn d-flex align-items-center"
            style={{
              gap: '6px',
              background: '#f5f7fb',
              color: '#495057',
              borderRadius: '10px',
              height: '40px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <CIcon icon={freeSet.cilArrowLeft} size="sm" />
            Back
          </NavLink>
        </div>
      </div>

      {/* Contract Information */}
      <div style={{ ...cardStyle, padding: '24px', marginTop: '16px' }}>
        <SectionTitle icon={freeSet.cilLineStyle}>Contract Information</SectionTitle>
        <div style={tileGridStyle}>
          <InfoTile
            label="Unit No"
            value={
              contract?.unit?.id ? (
                <NavLink
                  to={`/properties/${propertyId}/unit/${contract.unit.id}`}
                  style={{ color: THEME_COLOR, textDecoration: 'none' }}
                >
                  {contract?.unit?.unit_no}
                  {contract?.unit?.building?.name ? ` (${contract.unit.building.name})` : ''}
                </NavLink>
              ) : (
                contract?.unit?.unit_no
              )
            }
          />
          <InfoTile label="Contract Type" value={contract?.contract_type?.replace(/_/g, ' ')} />
          <InfoTile label="Period" value={periodValue} />
        </div>
      </div>

      {/* Members */}
      <div style={{ ...cardStyle, marginTop: '16px' }}>
        <div
          className="d-flex justify-content-between align-items-center flex-wrap"
          style={{ gap: '12px', padding: '20px 24px' }}
        >
          <div className="d-flex align-items-center" style={{ gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(0,191,204,0.12)',
                color: THEME_COLOR,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CIcon icon={freeSet.cilPeople} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Members
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {contract?.contract_members?.length ?? 0} total
              </small>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table
            className="table contract-members-table mb-0"
            style={{ borderCollapse: 'collapse' }}
          >
            <thead>
              <tr>
                <th style={headerCellStyle}>Name</th>
                <th style={headerCellStyle}>Member Type</th>
              </tr>
            </thead>
            <tbody>
              {contract?.contract_members?.map((member, index) => {
                const memberName =
                  [member?.member?.first_name, member?.member?.last_name]
                    .filter(Boolean)
                    .join(' ')
                    .trim() || '—'
                const avatarSrc = resolveMemberAvatarSrc(member?.member?.avatar)

                return (
                  <tr key={member?.member?.id ?? index}>
                    <td style={bodyCellStyle}>
                      <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                        <CAvatar src={avatarSrc} size="md" className="flex-shrink-0" />
                        <span style={{ fontWeight: 600 }}>{memberName}</span>
                      </div>
                    </td>
                    <td style={bodyCellStyle}>
                      {member?.member_type ? (
                        <span style={memberTypeBadgeStyle()}>
                          {member.member_type.replace(/_/g, ' ')}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                )
              })}
              {!contract?.contract_members?.length && (
                <tr>
                  <td
                    colSpan={2}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div style={{ ...cardStyle, marginTop: '16px' }}>
        <div style={{ padding: '20px 24px' }}>
          <div className="d-flex align-items-center" style={{ gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(0,191,204,0.12)',
                color: THEME_COLOR,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CIcon icon={freeSet.cilNotes} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Notes
              </h5>
              <small style={{ color: '#8a94a6' }}>Contract notes and remarks</small>
            </div>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #eef1f5',
              borderRadius: '12px',
              padding: '16px',
              color: '#1f2933',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              minHeight: '72px',
            }}
          >
            {contract?.notes?.replace(/_/g, ' ') || (
              <span className="text-secondary fst-italic">No notes added</span>
            )}
          </div>
        </div>
      </div>

      <ContractDocuments />

      {!for_moving_in ? (
        <Invoices after_submit={loadInitialContractData} contract={contract} />
      ) : null}

      {!for_moving_in ? <ContractCreditNotes /> : null}
    </div>
  )
}
