import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import useFetch from 'use-http'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { CTooltip } from '@coreui/react'
import logo from '../../../assets/images/avatars/default.png'
import { formatdate } from 'src/services/CommonFunctions'
import { toast } from 'react-toastify'
import EditResidents from '../EditResidents'
import CheckPermissions from 'src/permissions/CheckPermissions'

const THEME_COLOR = '#00bfcc'
const NOTES_PREVIEW_LENGTH = 40

const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,.05)',
  overflow: 'hidden',
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

function SectionHeader({ icon, title, action }) {
  return (
    <div
      className="d-flex justify-content-between align-items-center"
      style={{ padding: '20px 24px', borderBottom: '1px solid #f2f4f7' }}
    >
      <div className="d-flex align-items-center" style={{ gap: '12px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(0,191,204,0.12)',
            color: THEME_COLOR,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CIcon icon={icon} size="lg" />
        </div>
        <h6 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
          {title}
        </h6>
      </div>
      {action}
    </div>
  )
}

SectionHeader.propTypes = {
  icon: PropTypes.object,
  title: PropTypes.string,
  action: PropTypes.node,
}

function InfoTile({ label, value, className = '' }) {
  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #eef1f5',
        borderRadius: '12px',
        padding: '14px 16px',
      }}
    >
      <small
        style={{
          color: '#8a94a6',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </small>
      <div className={className} style={{ color: '#1f2933', fontWeight: 600, marginTop: '4px' }}>
        {value ?? '-'}
      </div>
    </div>
  )
}

InfoTile.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
}

function resolvePropertyName(contract) {
  const unit = contract?.unit
  const building = unit?.building

  return (
    building?.property_name ||
    building?.property?.name ||
    unit?.property?.name ||
    unit?.property_name ||
    contract?.property?.name ||
    contract?.property_name ||
    '-'
  )
}

function formatUnitLocation(contract) {
  const unit = contract?.unit
  const building = unit?.building
  const unitNo = unit?.unit_no ?? '-'
  const buildingName = building?.name ?? '-'
  const propertyName = resolvePropertyName(contract)
  return `${unitNo}, ${buildingName} (${propertyName})`
}

function formatContractType(contractType) {
  if (!contractType) {
    return '-'
  }
  return String(contractType).replace(/_/g, ' ')
}

function formatContractEndDate(endDate) {
  if (!endDate) {
    return 'Running'
  }
  return formatdate(endDate) || '-'
}

function ContractNotesCell({ notes }) {
  const text = notes?.trim() || '-'
  if (text === '-' || text.length <= NOTES_PREVIEW_LENGTH) {
    return <span>{text}</span>
  }

  const preview = `${text.slice(0, NOTES_PREVIEW_LENGTH)}...`

  return (
    <CTooltip content={text} placement="top" trigger={['hover', 'focus']}>
      <span
        className="d-inline-block text-truncate"
        style={{ maxWidth: '220px', cursor: 'default' }}
        tabIndex={0}
      >
        {preview}
      </span>
    </CTooltip>
  )
}

ContractNotesCell.propTypes = {
  notes: PropTypes.string,
}

export default function ResOverview() {
  const { residentId } = useParams()

  const [resident_data, setResident_data] = useState({})
  const [contracts, setContracts] = useState([])
  const { get, response } = useFetch()

  useEffect(() => {
    loadResident()
    loadContracts()
  }, [residentId])

  const loadResident = async () => {
    const api = await get(`/v1/admin/members/${residentId}`)
    if (response.ok) {
      setResident_data(api?.data ?? api)
    } else {
      toast.error(api?.message || response?.data?.message)
    }
  }

  async function loadContracts() {
    const api = await get(`/v1/admin/members/${residentId}/contracts`)
    if (response.ok) {
      const list = api?.data ?? api
      setContracts(Array.isArray(list) ? list : [])
    } else {
      setContracts([])
      toast.error(api?.message || response?.data?.message || 'Unable to load contracts.')
    }
  }

  const residentName = [resident_data?.first_name, resident_data?.last_name]
    .filter(Boolean)
    .join(' ')

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .resident-overview-table tbody tr { transition: background-color .15s ease; }
        .resident-overview-table tbody tr:hover { background-color: #f5fdfe; }
      `}</style>

      <div className="row g-3">
        <div className="col-lg-4">
          <div style={cardStyle}>
            <div
              className="text-center"
              style={{
                background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #0098a3 100%)`,
                padding: '32px 24px 24px',
              }}
            >
              <img
                src={resident_data.avatar || logo}
                alt={residentName || 'Resident'}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '4px solid rgba(255,255,255,0.4)',
                }}
              />
              <h5 className="mt-3 mb-0 text-white fw-bold text-capitalize">
                {residentName || '-'}
              </h5>
              <small style={{ color: 'rgba(255,255,255,0.85)' }}>
                {resident_data.email || '-'}
              </small>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div className="row g-3">
                <div className="col-6">
                  <InfoTile label="Phone" value={resident_data?.phone_number} />
                </div>
                <div className="col-6">
                  <InfoTile
                    label="Gender"
                    value={resident_data?.gender}
                    className="text-capitalize"
                  />
                </div>
                <div className="col-12">
                  <InfoTile label="Date of Birth" value={formatdate(resident_data?.dob)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div style={cardStyle}>
            <SectionHeader
              icon={freeSet.cilUser}
              title="Resident Data"
              action={
                <CheckPermissions
                  component={<EditResidents id={residentId} after_submit={loadResident} />}
                  keys={['resident', 'update']}
                />
              }
            />
            <div style={{ padding: '20px 24px' }}>
              <div className="row g-3">
                <div className="col-md-4">
                  <InfoTile
                    label="First Name"
                    value={resident_data?.first_name}
                    className="text-capitalize"
                  />
                </div>
                <div className="col-md-4">
                  <InfoTile
                    label="Last Name"
                    value={resident_data?.last_name}
                    className="text-capitalize"
                  />
                </div>
                <div className="col-md-4">
                  <InfoTile
                    label="Gender"
                    value={resident_data?.gender}
                    className="text-capitalize"
                  />
                </div>
                <div className="col-md-4">
                  <InfoTile label="Email" value={resident_data?.email} />
                </div>
                <div className="col-md-4">
                  <InfoTile label="Phone No." value={resident_data?.phone_number} />
                </div>
                <div className="col-md-4">
                  <InfoTile label="D.O.B." value={formatdate(resident_data?.dob)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <div style={cardStyle}>
            <SectionHeader icon={freeSet.cilDescription} title="Contract Info" />
            <div className="table-responsive">
              <table
                className="table resident-overview-table mb-0"
                style={{ borderCollapse: 'collapse' }}
              >
                <thead>
                  <tr>
                    <th style={headerCellStyle}>Unit / Building / Property</th>
                    <th style={headerCellStyle}>Start date</th>
                    <th style={headerCellStyle}>Contract type</th>
                    <th style={headerCellStyle}>End date</th>
                    <th style={headerCellStyle}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.length >= 1 ? (
                    contracts.map((contract) => (
                      <tr key={contract.id}>
                        <td style={bodyCellStyle} className="text-capitalize">
                          {formatUnitLocation(contract)}
                        </td>
                        <td style={bodyCellStyle}>{formatdate(contract.start_date) || '-'}</td>
                        <td style={bodyCellStyle} className="text-capitalize">
                          {formatContractType(contract.contract_type)}
                        </td>
                        <td style={bodyCellStyle}>{formatContractEndDate(contract.end_date)}</td>
                        <td style={bodyCellStyle}>
                          <ContractNotesCell notes={contract.notes} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-secondary fst-italic"
                        style={{ padding: '32px' }}
                      >
                        No contracts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div style={cardStyle}>
            <SectionHeader icon={freeSet.cilHistory} title="Resident Log" />
            <div style={{ padding: '20px 24px' }}>
              <div className="row g-3">
                <div className="col-12">
                  <InfoTile label="Last Changes" value={formatdate(resident_data?.updated_at)} />
                </div>
                <div className="col-12">
                  <InfoTile label="Created On" value={formatdate(resident_data?.created_at)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div style={cardStyle}>
            <SectionHeader icon={freeSet.cilFile} title="Identity Document" />
            <div style={{ padding: '20px 24px' }}>
              {resident_data?.identity_proof_doc ? (
                resident_data.identity_proof_doc.startsWith('data:image') ? (
                  <div className="text-center">
                    <img
                      src={resident_data.identity_proof_doc}
                      alt={resident_data.identity_proof_doc_name || 'Identity Document'}
                      className="img-fluid rounded border"
                      style={{ maxHeight: '350px', objectFit: 'contain' }}
                    />
                  </div>
                ) : (
                  <a
                    href={resident_data.identity_proof_doc}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    style={{
                      background: 'rgba(0,191,204,0.12)',
                      color: THEME_COLOR,
                      borderRadius: '8px',
                      fontWeight: 600,
                      border: '1px solid rgba(0,191,204,0.2)',
                    }}
                  >
                    View Document
                  </a>
                )
              ) : (
                <div className="text-muted">No identity document uploaded.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
