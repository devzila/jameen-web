import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useParams, NavLink } from 'react-router-dom'

import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react'

import Loading from 'src/components/loading/loading'
import { formatdate } from '../../../../services/CommonFunctions'

export default function ShowBuilding() {
  const [building, setBuilding] = useState(null)
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)

  const { propertyId, buildingId } = useParams()

  const { get } = useFetch()

  useEffect(() => {
    fetchBuilding()
  }, [buildingId])

  async function fetchBuilding() {
    setLoading(true)

    try {
      // BUILDING API
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

      console.log('Units Response:', unitsResponse)

      if (unitsResponse?.data) {
        setUnits(unitsResponse.data)
      } else {
        setUnits([])
      }
    } catch (error) {
      console.error('API Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <section className="mt-3">
      <CCard>
        <CCardHeader>
          <h3>{building?.name || 'Building Details'}</h3>
        </CCardHeader>

        <CCardBody>
          <CRow className="mb-4">
            <CCol md="6">
              <strong>Description:</strong>

              <p>{building?.description || '-'}</p>
            </CCol>

            <CCol md="6">
              <strong>Created At:</strong>

              <p>{building?.created_at ? formatdate(building.created_at) : '-'}</p>
            </CCol>
          </CRow>
          <hr />

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Units</h4>
            <span className="badge bg-primary">Total Units: {units.length}</span>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Floor</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {units.length > 0 ? (
                  units.map((unit) => (
                    <tr key={unit.id}>
                      <td>
                        <NavLink to={`/property/units/${unit.id}`}>{unit.name}</NavLink>
                      </td>

                      <td>{unit.floor || '-'}</td>

                      <td>{unit.unit_type || '-'}</td>

                      <td>{unit.status || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No Units Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CCardBody>
      </CCard>
    </section>
  )
}
