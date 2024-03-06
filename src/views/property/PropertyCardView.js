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
                      <div className="position-absolute top-0 end-0">
                        <Dropdown key={property.id} className=" text-center">
                          <Dropdown.Toggle as={CustomDivToggle} style={{ cursor: 'pointer' }}>
                            <Dropdown.Menu>
                              <EditProperty propertyId={property.id} />
                              <NavLink
                                style={{
                                  border: 'none',
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
                      <CCardText className=" m-5 text-center">
                        <CRow>
                          <CCol className="position-relative">
                            <img
                              alt="Avatar Image"
                              style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                display: 'flex',
                                margin: '0px auto',
                              }}
                              title="Avatar"
                              className="img-circle img-thumbnail isTooltip d-flex align-items-center"
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
                        <CCardText className=" m-1">
                          <CRow>
                            <CCol md="4" className="text-black">
                              {property?.buildings_count || '-'} Building
                            </CCol>
                            <CCol md="8" className="text-black">
                              {property?.unit_types_count || '-'} unit types
                            </CCol>
                          </CRow>
                        </CCardText>
                        <CCardText className="m-0">
                          <CRow>
                            <CCol md="4" className="text-black">
                              {property?.use_type || '-'}
                            </CCol>
                            <CCol md="8" className="text-black">
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
