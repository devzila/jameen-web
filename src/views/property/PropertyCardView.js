import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, Link } from 'react-router-dom'
import { CCol, CCard, CRow, CCardBody } from '@coreui/react'
import defaultimage from 'src/assets/images/default-building.png'

function PropertyCardView({ property }) {
  return (
    <>
      <CRow>
        <CCol md="12">
          <CCard className="p-3 mt-0 border-0 rounded-3 bg-light">
            <CRow>
              {property.map((property) => (
                <CCol key={property.id} lg="3" md="4" sm="6" xs="12">
                  <CCard
                    className="shadow-sm border-0 rounded-4 mb-4 overflow-hidden h-100"
                    style={{
                      transition: '0.3s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <Link
                      to={`/properties/${property.id}/overview`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="position-relative">
                        <img
                          alt="Property"
                          src={property.photo || defaultimage}
                          style={{
                            width: '100%',
                            height: '220px',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    </Link>

                    <CCardBody className="p-3">
                      {/* Property Name */}
                      <div className="mb-2">
                        <h5 className="fw-bold text-dark text-capitalize mb-1">
                          {property?.name || '-'}
                        </h5>

                        {/* Address */}
                        <div className="text-secondary small">
                          <div className="mb-1 text-truncate">
                            <i className="fa fa-map-marker-alt me-1"></i>
                            {property?.address || '-'}
                          </div>

                          <div className="d-flex flex-wrap align-items-center gap-1 text-capitalize">
                            <span>{property?.city || '-'}</span>

                            {property?.state && (
                              <>
                                <span>,</span>
                                <span>{property?.state}</span>
                              </>
                            )}

                            {property?.pin_code && (
                              <>
                                <span>-</span>
                                <span>{property?.pin_code}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Counts */}
                      <div className="border-top border-bottom py-2 my-3">
                        <CRow>
                          <CCol xs="6">
                            <NavLink
                              to={`/properties/${property.id}/Buildings`}
                              className="text-decoration-none"
                            >
                              <div className="fw-semibold text-dark">
                                {property?.buildings_count || '0'}
                              </div>
                              <small className="text-muted">Buildings</small>
                            </NavLink>
                          </CCol>

                          <CCol xs="6">
                            <NavLink
                              to={`/properties/${property.id}/unit-types`}
                              className="text-decoration-none"
                            >
                              <div className="fw-semibold text-dark">
                                {property?.unit_types_count || '0'}
                              </div>
                              <small className="text-muted">Unit Types</small>
                            </NavLink>
                          </CCol>
                        </CRow>
                      </div>

                      {/* Property Details */}
                      <CRow className="align-items-center">
                        <CCol xs="6">
                          <div className="text-capitalize">
                            <small className="text-muted d-block">Use Type</small>
                            <span className="fw-semibold text-dark">
                              {property?.use_type || '-'}
                            </span>
                          </div>
                        </CCol>

                        <CCol xs="6">
                          <div className="text-capitalize">
                            <small className="text-muted d-block">Payment</small>
                            <span className="fw-semibold text-dark">
                              {property?.payment_term
                                ? property.payment_term.replace(/_/g, ' ')
                                : '-'}
                            </span>
                          </div>
                        </CCol>
                      </CRow>
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
