import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button, Col, Dropdown } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { BsThreeDots } from 'react-icons/bs'
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
                                : 'https://bootdey.com/img/Content/avatar/avatar7.png'
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
                        <CCol md="4">Name:</CCol>
                        <CCol md="8">{property?.name || '-'}</CCol>
                      </CRow>

                      <CCardText className=" m-0">
                        <CRow>
                          <CCol md="4"> City :</CCol>
                          <CCol md="8">{property?.city || '-'}</CCol>
                        </CRow>
                      </CCardText>

                      <CCardText className="m-0">
                        <CRow>
                          <CCol md="4"> Use Type : </CCol>
                          <CCol md="8">{property?.use_type || '-'}</CCol>
                        </CRow>
                      </CCardText>
                      <CCardText className=" m-0">
                        <CRow>
                          <CCol md="4" className="d-flex align-items-center">
                            Payment:
                          </CCol>
                          <CCol md="8">{property?.payment_term || '-'}</CCol>
                        </CRow>
                      </CCardText>
                      <CCardText className=" m-0">
                        <CRow>
                          <CCol md="4" className="d-flex align-items-center">
                            Build Count:
                          </CCol>
                          <CCol md="8">{property?.buildings_count || '-'}</CCol>
                        </CRow>
                      </CCardText>
                      <CCardText className=" m-0">
                        <CRow>
                          <CCol md="4" className="d-flex align-items-center">
                            Unit-Type Count:
                          </CCol>
                          <CCol md="8">{property?.unit_types_count || '-'}</CCol>
                        </CRow>
                      </CCardText>
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
  property: PropTypes.number,
  refresh_data: PropTypes.func.isRequired,
}

export default PropertyCardView
