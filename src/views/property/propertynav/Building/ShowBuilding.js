import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useParams, NavLink } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CBadge, CButton, CTooltip } from '@coreui/react'
import Loading from 'src/components/loading/loading'
import Paginate from '../../../../components/Pagination'
import { formatdate } from '../../../../services/CommonFunctions'

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
      // BUILDING DETAILS API
      const buildingResponse = await get(
        `/v1/admin/premises/properties/${propertyId}/buildings/${buildingId}`,
      )

      console.log('Building Response:', buildingResponse)

      if (buildingResponse?.data) {
        setBuilding(buildingResponse.data)
      }

      // UNITS API
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
    <section className="mt-3">
      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h3>{building?.name || 'Building Details'}</h3>
            <div className="d-flex align-items-center gap-2">
              <NavLink to={`/properties/${propertyId}/buildings/${buildingId}/edit`}>
                <CButton color="sky" sixe="lg">
                  Edit
                </CButton>
              </NavLink>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          {/* BUILDING DETAILS */}
          <CRow className="mb-4">
            <CCol md="6">
              <strong>Description</strong>

              <p>{building?.description || '-'}</p>
            </CCol>

            <CCol md="6">
              <strong>Created At</strong>

              <p>{building?.created_at ? formatdate(building.created_at) : '-'}</p>
            </CCol>
          </CRow>

          <hr />

          {/* UNITS LIST */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Units </h4>
          </div>

          {units.length === 0 ? (
            <div className="alert alert-info">No units found for this building.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Unit No</th>
                    <th>Status</th>
                    <th>Bedrooms</th>
                    <th>Bathrooms</th>
                    <th>Year Built</th>
                    <th>Unit Type</th>
                  </tr>
                </thead>

                <tbody>
                  {units.map((unit, index) => (
                    <tr key={unit.id}>
                      <td>{index + 1}</td>

                      <td>
                        <CTooltip
                          content={getUnitTooltipContent(unit)}
                          placement="top"
                          trigger={['hover']}
                          style={{ maxWidth: '500px', whiteSpace: 'normal' }}
                        >
                          <span className="btn btn-link p-0">{unit.unit_no}</span>
                        </CTooltip>
                      </td>

                      <td>
                        <CBadge
                          color={
                            unit.status === 'vacant'
                              ? 'danger'
                              : unit.status === 'occupied'
                              ? 'success'
                              : 'warning'
                          }
                        >
                          {unit.status || '-'}
                        </CBadge>
                      </td>

                      <td>{unit.bedrooms_number || '-'}</td>

                      <td>{unit.bathrooms_number || '-'}</td>

                      <td>{unit.year_built || '-'}</td>

                      <td>{unit.unit_type?.name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          {pagination?.total_pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Paginate
                onPageChange={handlePageClick}
                pageRangeDisplayed={pagination.per_page}
                pageCount={pagination.total_pages}
                forcePage={pagination.current_page - 1}
              />
            </div>
          )}
        </CCardBody>
      </CCard>
    </section>
  )
}
