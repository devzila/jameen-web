import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Dropdown } from 'react-bootstrap'
import { freeSet } from '@coreui/icons'
import Loading from 'src/components/loading/loading'
import Paginate from '../../../../../components/Pagination'
import CustomDivToggle from 'src/components/CustomDivToggle'
import AddBillable from './AddBillable'
import EditBillable from './EditBillable'
import CIcon from '@coreui/icons-react'
import { BsThreeDots } from 'react-icons/bs'
import { formatdate } from 'src/services/CommonFunctions'
import EditUnitTypes from '../EditUnitTypes'

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

export default function BillableItems() {
  const [billableItems, setBillableItems] = useState([])
  const [errors, setErrors] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { get, response } = useFetch()
  const { propertyId, unittypeID } = useParams()
  const [unittype, setUnittype] = useState({})

  useEffect(() => {
    fetchBillableItems()
    fetchUnittype()
  }, [propertyId, unittypeID])

  async function fetchBillableItems() {
    try {
      const billableItemsData = await get(
        `/v1/admin/premises/properties/${propertyId}/unit_types/${unittypeID}/billable_items`,
      )
      if (response.ok) {
        setBillableItems(billableItemsData.data || [])
        setPagination(billableItemsData.pagination)
        setErrors(false)
      } else {
        setErrors(true)
      }
    } catch (error) {
      setErrors(true)
    } finally {
      setLoading(false)
    }
  }

  async function fetchUnittype() {
    const endpoint = await get(
      `/v1/admin/premises/properties/${propertyId}/unit_types/${unittypeID}`,
    )

    if (response.ok) {
      setUnittype(endpoint.data)
    }
  }

  function handlePageClick(e) {
    setCurrentPage(e.selected + 1)
  }

  function reload_callback() {
    fetchBillableItems()
    fetchUnittype()
  }

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .billable-table tbody tr { transition: background-color .15s ease; }
        .billable-table tbody tr:hover { background-color: #f5fdfe; }

        .billable-pagination ul { margin: 0; align-items: center; gap: 4px; }
        .billable-pagination .btn {
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
        .billable-pagination .btn:hover {
          border-color: ${THEME_COLOR} !important;
          color: ${THEME_COLOR};
        }
        .billable-pagination .custom_background_color,
        .billable-pagination .custom_background_color .btn {
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
            <CIcon icon={freeSet.cilLayers} size="xl" />
          </div>
          <div>
            <h4 className="mb-0 text-capitalize" style={{ fontWeight: 700, color: '#1f2933' }}>
              {unittype?.name || 'Unit Type'}
            </h4>
            <div style={{ color: '#8a94a6', marginTop: '4px' }}>
              {unittype?.use_type || '-'}
              {unittype?.sqft ? ` · ${unittype.sqft} sqft` : ''}
            </div>
          </div>
        </div>
        <EditUnitTypes id={unittypeID} after_submit={reload_callback} />
      </div>

      {/* Unit Type Details */}
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
            Unit Type Information
          </h6>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
          }}
        >
          <InfoTile label="Name" value={unittype?.name} />
          <InfoTile label="Use Type" value={unittype?.use_type} />
          <InfoTile label="Area" value={unittype?.sqft ? `${unittype.sqft} sqft` : '-'} />
          <InfoTile
            label="Maintenance / sqft"
            value={
              unittype?.monthly_maintenance_amount_per_sqft
                ? `₹ ${unittype.monthly_maintenance_amount_per_sqft}`
                : '-'
            }
          />
          <InfoTile label="Description" value={unittype?.description} />
          <InfoTile label="Created At" value={formatdate(unittype?.created_at)} />
          <InfoTile label="Modified On" value={formatdate(unittype?.updated_at)} />
        </div>
      </div>

      {/* Billable Items */}
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
              <CIcon icon={freeSet.cilDollar} size="lg" />
            </div>
            <div>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
                Billable Items
              </h5>
              <small style={{ color: '#8a94a6' }}>
                {pagination?.total_entries ?? billableItems.length} total
              </small>
            </div>
          </div>
          <AddBillable after_submit={reload_callback} unittypeID={unittypeID} />
        </div>

        <div className="table-responsive">
          <table className="table billable-table mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Name</th>
                <th style={headerCellStyle}>Description</th>
                <th style={headerCellStyle}>Billable Type</th>
                <th style={headerCellStyle}>Monthly Amount</th>
                <th style={headerCellStyle}>VAT</th>
                <th style={{ ...headerCellStyle, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {billableItems.map((item) => (
                <tr key={item.id}>
                  <td style={bodyCellStyle}>{item.name || '-'}</td>
                  <td style={bodyCellStyle} className="text-capitalize">
                    {item.description || '-'}
                  </td>
                  <td style={bodyCellStyle} className="text-capitalize">
                    {item.billable_type || '-'}
                  </td>
                  <td style={bodyCellStyle}>{item.monthly_amount ?? '-'}</td>
                  <td style={bodyCellStyle}>
                    {`${item.vat_percent ?? '-'} ${
                      item?.billable_type === 'fixed' ? '' : '%'
                    }`.trim()}
                  </td>
                  <td style={bodyCellStyle}>
                    <div className="d-flex justify-content-center">
                      <Dropdown>
                        <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                          <BsThreeDots />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <EditBillable id={item.id} after_submit={reload_callback} />
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && billableItems.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-secondary fst-italic"
                    style={{ padding: '32px' }}
                  >
                    No billable items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && <Loading />}
          {errors ? toast('Unable to load data') : null}
        </div>

        {pagination?.total_pages > 1 ? (
          <div
            className="billable-pagination d-flex justify-content-center"
            style={{ padding: '16px', borderTop: '1px solid #f2f4f7' }}
          >
            <Paginate
              onPageChange={handlePageClick}
              pageRangeDisplayed={pagination.per_page}
              pageCount={pagination.total_pages}
              forcePage={currentPage - 1}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

BillableItems.propTypes = {
  unittypeID: PropTypes.number,
  show: PropTypes.bool,
  row_data: PropTypes.string,
}
