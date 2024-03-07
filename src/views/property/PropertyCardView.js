import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Col, Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { BsThreeDots } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'
import CustomDivToggle from '../../components/CustomDivToggle'
import EditProperty from './EditProperty'
import ShowProperty from './ShowProperty'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import {
  CCol,
  CCard,
  CListGroupItem,
  CCardImage,
  CRow,
  CCardText,
  CCardBody,
  CCardTitle,
  CCardSubtitle,
  CCardLink,
  CButton,
} from '@coreui/react'

function PropertyCardView({ property }) {
  console.log(property)
  return (
    <>
      <CRow>
        <CCol md="12">
          <CCard className=" p-3  mt-0 border-0 theme_color">
            <CRow>
              {property.map((property) => (
                <CCol key={property.id} md="4">
                  <Link to={`/properties/${property.id}/overview`}>
                    <CCard className="shadow-lg border-0 rounded-2 mb-3 ">
                      <CCardText className="card" style={{ width: '25rem' }}>
                        <CRow>
                          <CCol className="position-relative text-center">
                            <img
                              alt="Avatar Image"
                              style={{
                                width: '100%',
                                height: '250px',
                                borderRadius: '0px',
                                display: 'block',
                                margin: '0 auto',
                              }}
                              title="Avatar"
                              className="img-thumbnail isTooltip"
                              src={
                                property.avatar
                                  ? property.avatar
                                  : 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJ1aWxkaW5nc3xlbnwwfHwwfHx8MA%3D%3D'
                              }
                              data-original-title="Property"
                            />
                          </CCol>
                        </CRow>
                      </CCardText>
                      <div className="position-absolute top-0 end-0">
                        <Dropdown key={property.id} className=" text-center p-3">
                          <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                            <Dropdown.Menu>
                              <EditProperty propertyId={property.id} />
                              <NavLink
                                style={{
                                  border: '2px',
                                  color: '#00bfcc',
                                  marginLeft: '4%',
                                  textDecorationLine: 'none',
                                }}
                                to={`/properties/${property.id}/overview`}
                              >
                                Show
                              </NavLink>
                            </Dropdown.Menu>
                            <BsThreeDots className="float-end" />
                          </Dropdown.Toggle>
                        </Dropdown>
                      </div>

                      <CCardBody className="pt-0">
                        <CRow>
                          <CCol className="d-flex justify-content-end "></CCol>
                        </CRow>
                        <CRow>
                          <CCol md="8" className="text-black">
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
                        <CCardText className=" m-2">
                          <CRow>
                            <CCol md="5" className="text-black">
                              {property?.buildings_count || '-'} Building
                            </CCol>
                            <CCol md="7" className="text-black">
                              {property?.unit_types_count || '-'} unit types
                            </CCol>
                          </CRow>
                        </CCardText>
                        <CCardText className="m-2">
                          <CRow>
                            <CCol md="5" className="text-black">
                              {property?.use_type || '-'}
                            </CCol>
                            <CCol md="7" className="text-black">
                              {property?.payment_term || '-'} payment
                            </CCol>
                          </CRow>
                        </CCardText>
                      </CCardBody>
                    </CCard>
                  </Link>
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
  property: PropTypes.number,
  refresh_data: PropTypes.func.isRequired,
}

export default PropertyCardView
