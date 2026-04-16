import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Link } from 'react-router-dom'
import { CCol, CCard, CRow, CCardText, CCardBody } from '@coreui/react'
import defaultimage from 'src/assets/images/default-building.png'

function PropertyCardView({ property }) {
  return (
    <>
      <CRow>
        <CCol md="12">
          <CCard className="p-3 mt-0 border-0 rounded-0 theme_color">
            <CRow>
              {property.map((property) => (
                <CCol key={property.id} md="3">
                  <CCard className="shadow-sm border-0 rounded-2 mb-3">
                    <div className="card">
                      <Link to={`/properties/${property.id}/overview`}>
                        <CRow>
                          <CCol className="position-relative text-center">
                            <img
                              alt="Avatar Image"
                              style={{
                                width: '100%',
                                height: '220px',
                                borderRadius: '0px',
                                display: 'block',
                                margin: '0 auto',
                                objectFit: 'cover',
                              }}
                              title="Avatar"
                              className="isTooltip"
                              src={property.photo ? property.photo : defaultimage}
                              data-original-title="Property"
                            />
                          </CCol>
                        </CRow>
                      </Link>
                    </div>

                    <CCardBody className="pt-2">
                      <CRow>
                        <CCol className="d-flex justify-content-end "></CCol>
                      </CRow>
                      <CRow>
                        <CCol md="8" className="text-black text-nowrap text-capitalize">
                          {property?.name || '-'}
                          <br></br>
                          <CCol className="text-secondary">
                            {property?.address || '-'}
                            <span className="mx-1"></span>
                            {property?.city}
                          </CCol>
                        </CCol>
                      </CRow>
                      <br></br>
                      <div className="m-2">
                        <CRow>
                          <CCol md="5" className="text-black ">
                            <NavLink to={`/properties/${property.id}/Buildings`}>
                              {property?.buildings_count || '-'} Building
                            </NavLink>
                          </CCol>
                          <CCol md="7" className="text-black">
                            <NavLink to={`/properties/${property.id}/unit-types`}>
                              {property?.unit_types_count || '-'} Unit types
                            </NavLink>
                          </CCol>
                        </CRow>
                      </div>
                      <div className="m-2">
                        <CRow>
                          <CCol md="5" className="text-black text-capitalize">
                            {property?.use_type || '-'}
                          </CCol>
                          <CCol md="7" className="text-black text-capitalize">
                            {property?.payment_term.replace(/_/g, ' ') || '-'} Payment
                          </CCol>
                        </CRow>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

PropertyCardView.propTypes = {
  property: PropTypes.array.isRequired,
}

export default PropertyCardView
