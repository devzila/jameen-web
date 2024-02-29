import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useFetch from 'use-http'
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
  CImage,
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
          <CCard className=" p-3 mt-3 mt-0 border-0 theme_color">
            <CRow>
              {property.map((property) => (
                <CCol md="4">
                  <CCard className="shadow-lg border-0 rounded-2 mb-3 ">
                    <CCardText className=" m-0">
                      <CRow>
                        <CCol md="4"> </CCol>
                        <CCol md="8">{property?.avatar || '-'}</CCol>
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
                            Payment Term:
                          </CCol>
                          <CCol md="8">{property?.payment_term || '-'}</CCol>
                        </CRow>
                      </CCardText>
                      <div className="d-flex justify-content-end">
                        <EditProperty propertyId={property.id} />
                        <ShowProperty propertyId={property.id} />
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
  property: PropTypes.number,
  refresh_data: PropTypes.func.isRequired,
}

export default PropertyCardView
