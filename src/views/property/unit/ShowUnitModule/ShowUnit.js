import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import useFetch from 'use-http'

import { NavLink, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { formatdate, status_color } from 'src/services/CommonFunctions'
import PickOwner from '../UnitFunctions/PickOwner'
import InvoicePayment from 'src/views/finance/InvoicePayment'
import InvoiceCancel from 'src/views/finance/InvoiceCancel'
import Edit from '../EditUnit'
import Delete from '../DeleteUnit'
import AllocateUnit from '../AllocateUnit'
import MovingInUnit from '../MovingInUnit'
import AddParking from './AllotParking'
import CheckPermissions from 'src/permissions/CheckPermissions'
import avtar from 'src/assets/images/default-building.png'

const THEME_COLOR = '#00bfcc'

const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,.05)',
}

const tileGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '14px',
}

function statusBadgeStyle(status) {
  const palette = {
    red: { bg: '#fdeaea', color: '#e03131' },
    orange: { bg: '#fff4e6', color: '#e8590c' },
    green: { bg: '#e6f9ec', color: '#1a9e54' },
    gray: { bg: '#eef1f5', color: '#495057' },
  }
  const colors = palette[status_color(String(status).toLowerCase())] || palette.gray
  return {
    background: colors.bg,
    color: colors.color,
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
      className="d-flex justify-content-between align-items-center"
      style={{ marginBottom: '16px' }}
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

const emptyText = (text) => (
  <p className="text-center text-secondary fst-italic mb-0" style={{ padding: '12px' }}>
    {text}
  </p>
)

export default function Showunit() {
  const { propertyId, unitId } = useParams()

  const [unit, setUnit] = useState({})
  const [invoices, setInvoices] = useState({})
  const [parkingData, setParkingData] = useState({})
  const [residents, setResidents] = useState([])
  const { get, response } = useFetch()
  useEffect(() => {
    getUnitData()
    getUnitInvoices()
    getParkingData()
    getResidents()
  }, [])

  async function getUnitInvoices() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}/invoices`)
    if (response.ok) {
      setInvoices(api.data)
    }
  }

  async function getUnitData() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}`)
    if (response.ok) {
      setUnit(api.data)
    }
  }

  async function getParkingData() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}/parkings`)
    if (response.ok) {
      setParkingData(api.data)
    }
  }
  async function getResidents() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}/residents`)
    if (response.ok) {
      setResidents(api.data || [])
    }
  }
  const refresh_data = () => {
    getUnitData()
    getUnitInvoices()
    getResidents()
  }

  const calculateAge = (dob) => {
    if (!dob) return '-'

    const birthDate = new Date(dob)
    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div style={{ padding: '20px' }}>
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
            <CIcon icon={freeSet.cilHome} size="xl" />
          </div>
          <div>
            <div className="d-flex align-items-center flex-wrap" style={{ gap: '10px' }}>
              <h4 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Unit {unit?.unit_no || ''}
                {unit?.building?.name ? ` (${unit.building.name})` : ''}
              </h4>
              {unit?.status ? (
                <span style={statusBadgeStyle(unit.status)}>{unit.status}</span>
              ) : null}
            </div>
            <div className="text-capitalize" style={{ color: '#8a94a6', marginTop: '4px' }}>
              {unit?.property?.name || '-'}
              {unit?.unit_type?.name ? ` · ${unit.unit_type.name}` : ''}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center flex-wrap" style={{ gap: '8px' }}>
          <CheckPermissions
            component={<Edit unitId={unitId} after_submit={refresh_data} />}
            keys={['unit', 'create']}
          />
          {unit.status === 'unallotted' ? (
            <CheckPermissions
              component={
                <>
                  <AllocateUnit unitId={unitId} unitNo={unit.unit_no} after_submit={refresh_data} />
                  <Delete unitId={unitId} after_submit={refresh_data} />
                </>
              }
              keys={['operation', 'manage_allotment']}
            />
          ) : null}
          {unit.status === 'vacant' ? (
            <CheckPermissions
              component={
                <MovingInUnit unitId={unitId} unitNo={unit.unit_no} after_submit={refresh_data} />
              }
              keys={['operation', 'manage_moving_in']}
            />
          ) : null}
        </div>
      </div>

      {/* Unit Information */}
      <div style={{ ...cardStyle, padding: '24px', marginTop: '16px' }}>
        <SectionTitle icon={freeSet.cilLineStyle}>Unit Information</SectionTitle>
        <div style={tileGridStyle}>
          <InfoTile label="Name" value={unit?.property?.name} />
          <InfoTile label="Year Built" value={unit?.year_built} />
          <InfoTile label="Unit Type" value={unit?.unit_type?.name} />
          <InfoTile label="Use Type" value={unit?.unit_type?.use_type} />
          <InfoTile label="Description" value={unit?.unit_type?.description} />
          <InfoTile label="Bedroom Number" value={unit?.bedrooms_number} />
          <InfoTile label="Bathroom Number" value={unit?.bathrooms_number} />
          <InfoTile label="Total Area (sq. ft.)" value={unit?.unit_type?.sqft} />
          <InfoTile
            label="Monthly Maintenance / sq. ft."
            value={unit?.unit_type?.monthly_maintenance_amount_per_sqft}
          />
          <InfoTile label="Last Modified" value={formatdate(unit?.unit_type?.updated_at)} />
          <InfoTile label="Electricity Account No." value={unit?.electricity_account_number} />
          <InfoTile label="Water Account No." value={unit?.water_account_number} />
          <InfoTile label="Internal Extension No." value={unit?.internal_extension_number} />
        </div>
      </div>

      {/* Owners & Residents */}
      <div style={{ ...cardStyle, padding: '24px', marginTop: '16px' }}>
        <SectionTitle icon={freeSet.cilPeople}>Owners &amp; Residents</SectionTitle>
        {residents?.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '14px',
            }}
          >
            {residents.map((member, index) => (
              <div
                key={index}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #eef1f5',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div className="d-flex align-items-center mb-3" style={{ gap: '12px' }}>
                  <img
                    src={member?.avatar || avtar}
                    alt=""
                    width="48"
                    height="48"
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <h6
                    className="mb-0 text-capitalize"
                    style={{ fontWeight: 700, color: '#1f2933' }}
                  >
                    {member?.first_name || member?.last_name
                      ? `${member?.first_name || ''} ${member?.last_name || ''}`
                      : '-'}
                  </h6>
                </div>
                <div className="d-flex justify-content-between" style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#8a94a6' }}>Age</span>
                  <span style={{ fontWeight: 600 }}>{calculateAge(member?.dob)}</span>
                </div>
                <div
                  className="d-flex justify-content-between text-capitalize"
                  style={{ marginBottom: '6px' }}
                >
                  <span style={{ color: '#8a94a6' }}>Gender</span>
                  <span style={{ fontWeight: 600 }}>{member?.gender || '-'}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: '#8a94a6' }}>Join Date</span>
                  <span style={{ fontWeight: 600 }}>{formatdate(member?.join_date) || '-'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          emptyText('No Owner/Resident Data Found')
        )}
      </div>

      {/* Parking Info */}
      <div style={{ ...cardStyle, padding: '24px', marginTop: '16px' }}>
        <SectionTitle
          icon={freeSet.cilCarAlt}
          action={<AddParking unitId={unitId} after_submit={getParkingData} />}
        >
          Parking Info.
        </SectionTitle>
        {parkingData?.length ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '14px',
            }}
          >
            {parkingData.map((parking) => (
              <div
                key={parking.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #eef1f5',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div className="d-flex justify-content-between" style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#8a94a6' }}>Parking No.</span>
                  <span className="text-capitalize" style={{ fontWeight: 600 }}>
                    {parking?.parking_number || '-'}
                  </span>
                </div>
                <div className="d-flex justify-content-between" style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#8a94a6' }}>Vehicles</span>
                  <span style={{ fontWeight: 600 }}>{parking?.bedrooms_number || '-'}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: '#8a94a6' }}>Created At</span>
                  <span style={{ fontWeight: 600 }}>{formatdate(parking.created_at) || '-'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          emptyText('No Parking Data Found')
        )}
      </div>

      {/* Contract Info */}
      <div style={{ ...cardStyle, padding: '24px', marginTop: '16px' }}>
        <SectionTitle icon={freeSet.cilDescription}>Contract Info.</SectionTitle>
        {unit?.running_contracts?.length >= 1 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '14px',
            }}
          >
            {unit.running_contracts.map((contract) => (
              <NavLink
                to={`contract/${contract.id}`}
                key={contract.id}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #eef1f5',
                    borderRadius: '12px',
                    padding: '16px',
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      color: THEME_COLOR,
                      fontWeight: 700,
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '10px',
                    }}
                  >
                    Contract
                  </div>
                  <div className="d-flex justify-content-between" style={{ marginBottom: '6px' }}>
                    <span style={{ color: '#8a94a6' }}>Type</span>
                    <span className="text-capitalize" style={{ fontWeight: 600, color: '#1f2933' }}>
                      {contract.contract_type?.replace('_', ' ') || '-'}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between" style={{ marginBottom: '10px' }}>
                    <span style={{ color: '#8a94a6' }}>Duration</span>
                    <span style={{ fontWeight: 600, color: '#1f2933', textAlign: 'right' }}>
                      {formatdate(contract.start_date) || '-'}
                      {formatdate(contract.end_date) || ' - Present'}
                    </span>
                  </div>

                  <div
                    style={{
                      color: THEME_COLOR,
                      fontWeight: 700,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '6px',
                    }}
                  >
                    Contract Members
                  </div>
                  {contract.contract_members ? (
                    contract.contract_members.map((members, index) => (
                      <div key={index} style={{ color: '#1f2933', marginBottom: '2px' }}>
                        {index + 1}. {members.member.name}{' '}
                        <sub className="text-secondary text-capitalize">
                          {members.member_type?.replace('_', ' ') || '-'}
                        </sub>
                      </div>
                    ))
                  ) : (
                    <p className="text-secondary fst-italic mb-0">No Contract Members Found</p>
                  )}

                  {contract.notes ? (
                    <div
                      className="d-flex justify-content-between"
                      style={{ marginTop: '10px', gap: '8px' }}
                    >
                      <span style={{ color: '#8a94a6' }}>Notes</span>
                      <abbr
                        style={{ cursor: 'pointer', textAlign: 'right' }}
                        className="text-decoration-none"
                        title={contract.notes}
                      >
                        {contract.notes.slice(0, 15)}
                        {contract.notes.length > 15 ? '...' : ''}
                      </abbr>
                    </div>
                  ) : null}
                </div>
              </NavLink>
            ))}
          </div>
        ) : (
          emptyText('No Contracts Found')
        )}
      </div>

      {/* Invoices */}
      <div style={{ ...cardStyle, padding: '24px', marginTop: '16px' }}>
        <SectionTitle icon={freeSet.cilMoney}>Invoices</SectionTitle>
        {invoices?.length >= 1 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '14px',
            }}
          >
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #eef1f5',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div className="d-flex justify-content-end" style={{ marginBottom: '8px' }}>
                  <span style={statusBadgeStyle(invoice?.status)}>{invoice?.status || '-'}</span>
                </div>
                <div className="d-flex justify-content-between" style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#8a94a6' }}>Invoice No</span>
                  <span style={{ fontWeight: 600 }}>{invoice?.number || '-'}</span>
                </div>
                <div className="d-flex justify-content-between" style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#8a94a6' }}>Invoice Date</span>
                  <span style={{ fontWeight: 600 }}>{invoice?.invoice_date || '-'}</span>
                </div>
                <div className="d-flex justify-content-between" style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#8a94a6' }}>Invoice Period</span>
                  <span style={{ fontWeight: 600, textAlign: 'right' }}>
                    {(formatdate(invoice?.period_from) || '-') +
                      ' / ' +
                      (formatdate(invoice?.period_to) || '-')}
                  </span>
                </div>
                <div className="d-flex justify-content-between" style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#8a94a6' }}>Owner/Resident</span>
                  <span style={{ fontWeight: 600, textAlign: 'right' }}>
                    {PickOwner(invoice?.unit_contract?.contract_members)}
                  </span>
                </div>
                <div className="d-flex justify-content-between" style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#8a94a6' }}>Amount</span>
                  <span style={{ fontWeight: 600 }}>{invoice?.amount || '-'}</span>
                </div>
                <div className="d-flex justify-content-between" style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#8a94a6' }}>VAT</span>
                  <span style={{ fontWeight: 600 }}>{invoice?.vat_amount || '-'}</span>
                </div>
                <div
                  className="d-flex justify-content-between"
                  style={{
                    marginBottom: '10px',
                    paddingTop: '8px',
                    borderTop: '1px solid #eef1f5',
                  }}
                >
                  <span style={{ color: '#1f2933', fontWeight: 700 }}>Total</span>
                  <span style={{ fontWeight: 700 }}>{invoice?.total_amount || '-'}</span>
                </div>
                <div className="d-flex justify-content-end" style={{ gap: '6px' }}>
                  <CheckPermissions
                    component={<InvoicePayment invoice={invoice} />}
                    keys={['invoice', 'can_mark_as_paid']}
                  />
                  <CheckPermissions
                    component={<InvoiceCancel id={invoice.id} />}
                    keys={['invoice', 'cancel']}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          emptyText('No Invoices Found')
        )}
      </div>
    </div>
  )
}
