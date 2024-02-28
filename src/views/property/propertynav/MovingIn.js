import React, { useState, useEffect } from 'react'
import { CCol, CCard, CListGroupItem, CCardImage, CRow, CCardText, CImage } from '@coreui/react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import logo from '../../../assets/images/avatars/default.png'

export default function MovingIn() {
  const [movingIn, setMovingIn] = useState([])
  const { get } = useFetch()
  const { propertyId, unitTypeId } = useParams()

  useEffect(() => {
    fetchMovingIn()
  }, [propertyId, unitTypeId])

  async function fetchMovingIn() {
    try {
      const movingInData = await get(`/v1/admin/premises/properties/${propertyId}/Movingin`)
      console.log(movingInData)
      if (movingInData && movingInData.data) {
        setMovingIn(movingInData.data)
      }
    } catch (error) {
      console.error('Error fetching billable items:', error)
    }
  }

  return (
    <>
      <CRow>
        <CCol md="4">
          <CCard className=" p-5  m-3 border-0  " style={{ backgroundColor: '#00bfcc' }}>
            <div className="d-flex align-items-center justify-content-center h-100 ">
              <img className="rounded-circle w-50 " src={movingIn.avatar || logo} />
            </div>
          </CCard>
        </CCol>
        <CCol md="8">
          <CCard className=" p-3 my-3 me-3" style={{ border: '0px' }}>
            <CListGroupItem>
              <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
              <strong>MovingIn</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            <CRow className="">
              <CCol className="p-2 mt-0 fw-light theme_color">
                Name
                <CCardText className="fw-normal text-black">{movingIn?.name || '-'}</CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                City
                <CCardText className="fw-normal text-black">{movingIn?.city || '-'}</CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Use Type
                <CCardText className="fw-normal text-black">{movingIn?.use_type || '-'}</CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Payment Term
                <CCardText className="fw-normal text-black">
                  {movingIn?.payment_term || '-'}
                </CCardText>
              </CCol>
            </CRow>
            <CRow>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Overdue Days
                <CCardText className="fw-normal text-black">
                  {movingIn?.invoice_overdue_days || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Invoice No Prefix
                <CCardText className="fw-normal text-black">
                  {movingIn?.invoice_no_prefix || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Invoice Day
                <CCardText className="fw-normal text-black">
                  {movingIn?.invoice_day || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Created At
                <CCardText className="fw-normal text-black">
                  {movingIn?.created_at || '-'}
                </CCardText>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
