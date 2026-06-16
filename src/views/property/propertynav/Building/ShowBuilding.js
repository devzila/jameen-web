import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useParams, NavLink } from 'react-router-dom'
import { CTooltip } from '@coreui/react'
import Loading from 'src/components/loading/loading'
import Paginate from '../../../../components/Pagination'
import { formatdate, status_color } from '../../../../services/CommonFunctions'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import PropTypes from 'prop-types'

const THEME_COLOR = '#00bfcc'

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
      <div style={{ fontWeight: 600, color: '#1f2933' }}>{value || '-'}</div>
    </div>
  )
}

InfoTile.propTypes = {
  label: PropTypes.node,
  value: PropTypes.node,
}

export default function ShowBuilding() {
  const [building, setBuilding] = useState(null)
  const [units, setUnits] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)

  const { propertyId, buildingId } = useParams()

  const { get } = useFetch()

  useEffect(() => {
    fetchBuilding()
  }, [buildingId])

  async function fetchBuilding() {
    setLoading(true)

    try {
      const buildingResponse = await get(
        `/v1/admin/premises/properties/${propertyId}/buildings/${buildingId}`,
      )

      if (buildingResponse?.data) {
        setBuilding(buildingResponse.data)
      }

      const unitsResponse = await get(
        `/v1/admin/premises/properties/${propertyId}/buildings/${buildingId}/units`,
      )
      if (unitsResponse?.data) {
        setUnits(unitsResponse.data)
        setPagination(unitsResponse.pagination)
      } else {
        setUnits([])
      }
    } catch (error) {
      console.error('API Error:', error)
    } finally {
      setLoading(false)
    }
  }

  function handlePageClick(e) {
    console.log(e.selected)
  }

  function getUnitTooltipContent(unit) {
    const statusLabel = unit.running_contracts?.length > 0 ? 'Alloted' : 'Not Alloted'

    return (
      <div style={{ textAlign: 'left' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ padding: '2px 6px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Unit Name
              </td>
              <td style={{ padding: '2px 6px' }}>{unit.unit_no || '-'}</td>
            </tr>
            <tr>
              <td style={{ padding: '2px 6px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Unit Type
              </td>
              <td style={{ padding: '2px 6px' }}>{unit.unit_type?.name || '-'}</td>
            </tr>
            <tr>
              <td style={{ padding: '2px 6px', fontWeight: 600, whiteSpace: 'nowrap' }}>Status</td>
              <td style={{ padding: '2px 6px' }}>{statusLabel}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  if (loading) return <Loading />

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .building-units-table tbody tr { transition: background-color .15s ease; }
        .building-units-table tbody tr:hover { background-color: #f5fdfe; }

        .building-units-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .building-units-pagination .btn {
          box-shadow: none !important;
          border: 1px solid #eef1f5 !important;
          border-radius: 8px !important;
          background: #fff;
          color: #495057;
          min-width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
          margin: 0 !important;
          transition: all .15s ease;
        }
        .building-units-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .building-units-pagination .custom_background_color,
        .building-units-pagination .custom_background_color .btn {
          background: ${THEME_COLOR} !important;
          border-color: ${THEME_COLOR} !important;
          color: #fff !important;
        }
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
            <CIcon icon={freeSet.cilBuilding} size="xl" />
          </div>
          <div>
            <h4 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
              {building?.name || 'Building Details'}
            </h4>
            <div style={{ color: '#8a94a6', marginTop: '4px' }}>
              {units.length} unit{units.length === 1 ? '' : 's'}
            </div>
          </div>
        </div>

        <NavLink
          to={`/properties/${propertyId}/buildings/${buildingId}/edit`}
          className="btn custom_theme_button"
          style={{ textDecoration: 'none' }}
        >
          Edit
        </NavLink>
      </div>

      {/* Building Details */}
      <div style={{ ...cardStyle, padding: '24px', marginTop: '16px' }}>
        <div className="d-flex align-items-center mb-3" style={{ gap: '10px' }}>
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
            <CIcon icon={freeSet.cilLineStyle} />
          </div>
          <h6 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
            Building Information
          </h6>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
          }}
        >
          <InfoTile label="Description" value={building?.description} />
          <InfoTile
            label="Created At"
            value={building?.created_at ? formatdate(building.created_at) : '-'}
          />
        </div>
      </div>

      {/* Units */}
      <div style={{ ...cardStyle, marginTop: '16px' }}>
        <div style={{ padding: '20px 24px' }}>
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
              <CIcon icon={freeSet.cilHome} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Units
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {pagination?.total_entries ?? units.length} total
              </small>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table building-units-table mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>#</th>
                <th style={headerCellStyle}>Unit No</th>
                <th style={headerCellStyle}>Status</th>
                <th style={headerCellStyle}>Bedrooms</th>
                <th style={headerCellStyle}>Bathrooms</th>
                <th style={headerCellStyle}>Year Built</th>
                <th style={headerCellStyle}>Unit Type</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit, index) => (
                <tr key={unit.id}>
                  <td style={bodyCellStyle}>{index + 1}</td>
                  <td style={bodyCellStyle}>
                    <CTooltip
                      content={getUnitTooltipContent(unit)}
                      placement="top"
                      trigger={['hover']}
                      style={{ maxWidth: '500px', whiteSpace: 'normal' }}
                    >
                      <span style={{ color: THEME_COLOR, fontWeight: 600, cursor: 'default' }}>
                        {unit.unit_no}
                      </span>
                    </CTooltip>
                  </td>
                  <td style={bodyCellStyle}>
                    <span style={statusBadgeStyle(unit.status)}>{unit.status || '-'}</span>
                  </td>
                  <td style={bodyCellStyle}>{unit.bedrooms_number || '-'}</td>
                  <td style={bodyCellStyle}>{unit.bathrooms_number || '-'}</td>
                  <td style={bodyCellStyle}>{unit.year_built || '-'}</td>
                  <td style={bodyCellStyle}>{unit.unit_type?.name || '-'}</td>
                </tr>
              ))}
              {units.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No units found for this building
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination?.total_pages > 1 ? (
          <div
            className="building-units-pagination d-flex justify-content-center"
            style={{ padding: '16px', borderTop: '1px solid #f2f4f7' }}
          >
            <Paginate
              onPageChange={handlePageClick}
              pageRangeDisplayed={pagination.per_page}
              pageCount={pagination.total_pages}
              forcePage={pagination.current_page - 1}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
