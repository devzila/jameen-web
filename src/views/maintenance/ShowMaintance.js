import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import useFetch from 'use-http'
import { formatdate, status_color } from 'src/services/CommonFunctions'
import { NavLink, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Loading from 'src/components/loading/loading'
import MaintenanceComments from './Components/MaintenanceComments'

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

function SectionTitle({ icon, children }) {
  return (
    <div className="d-flex align-items-center" style={{ gap: '10px', marginBottom: '16px' }}>
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
  )
}

SectionTitle.propTypes = {
  icon: PropTypes.array,
  children: PropTypes.node,
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

export default function ShowMaintance() {
  const { propertyId, maintenanceid } = useParams()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const { get, response } = useFetch()

  useEffect(() => {
    showMaintanceRequests()
  }, [maintenanceid])

  async function showMaintanceRequests() {
    setLoading(true)
    const api = await get(`/v1/admin/maintenance/requests/${maintenanceid}`)
    if (response.ok) {
      setData(api.data || {})
    }
    setLoading(false)
  }

  const backPath = propertyId
    ? `/properties/${propertyId}/maintenance-requests`
    : '/maintenance-request'

  if (loading && !data?.id) {
    return (
      <div style={{ padding: '20px' }}>
        <Loading />
      </div>
    )
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
            <CIcon icon={freeSet.cilTask} size="xl" />
          </div>
          <div>
            <div className="d-flex align-items-center flex-wrap" style={{ gap: '10px' }}>
              <h4 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                {data?.title || 'Maintenance Request'}
              </h4>
              {data?.status ? (
                <span style={statusBadgeStyle(data.status)}>{data.status.replace(/_/g, ' ')}</span>
              ) : null}
            </div>
            <div style={{ color: '#8a94a6', marginTop: '4px' }}>
              {data?.category?.name || 'Request'}
              {data?.property?.name ? ` · ${data.property.name}` : ''}
            </div>
          </div>
        </div>

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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
          marginTop: '16px',
        }}
      >
        {/* Property Details */}
        <div style={{ ...cardStyle, padding: '24px' }}>
          <SectionTitle icon={freeSet.cilBuilding}>Property Details</SectionTitle>
          <div style={tileGridStyle}>
            <InfoTile label="Property" value={data?.property?.name} />
            <InfoTile label="Unit No" value={data?.maintainable?.unit_no} />
            <InfoTile
              label="Last Status Changed"
              value={
                data?.maintainable?.last_status_changed_date
                  ? formatdate(data.maintainable.last_status_changed_date)
                  : '-'
              }
            />
            <InfoTile label="Owner" value={data?.property?.use_type} />
            <InfoTile
              label="Available Date"
              value={data?.available_date ? formatdate(data.available_date) : data?.available_date}
            />
            <InfoTile label="Available Time" value={data?.avialable_time} />
          </div>
        </div>

        {/* Request Details */}
        <div style={{ ...cardStyle, padding: '24px' }}>
          <SectionTitle icon={freeSet.cilLineStyle}>Request Details</SectionTitle>
          <div style={tileGridStyle}>
            <InfoTile label="Category" value={data?.category?.name} />
            <InfoTile label="Priority" value={data?.category?.priority} />
            <InfoTile label="Assigned User" value={data?.assigned_user?.name || 'Unassigned'} />
            <InfoTile
              label="Created At"
              value={data?.created_at ? formatdate(data.created_at) : '-'}
            />
            <InfoTile label="Completion Date" value={data?.completion_date || '-'} />
          </div>
          <div
            style={{
              marginTop: '14px',
              background: '#f8fafc',
              border: '1px solid #eef1f5',
              borderRadius: '12px',
              padding: '16px',
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
              Description
            </div>
            <div style={{ color: '#1f2933', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {data?.description || (
                <span className="text-secondary fst-italic">No description provided</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Log */}
      <div style={{ ...cardStyle, padding: '24px', marginTop: '16px' }}>
        <SectionTitle icon={freeSet.cilLibrary}>Ticket Log</SectionTitle>
        <div style={tileGridStyle}>
          <InfoTile label="Created By" value={data?.property?.name} />
          <InfoTile label="Assigned By" value={data?.year_built} />
          <InfoTile label="Closed By" value={data?.data_type?.name} />
        </div>
      </div>

      <MaintenanceComments />
    </div>
  )
}
