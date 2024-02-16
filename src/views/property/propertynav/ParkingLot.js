import React, { useState, useEffect } from 'react'
import { CCol, CCard, CListGroupItem, CCardImage, CRow, CCardText, CImage } from '@coreui/react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import logo from '../../../assets/images/avatars/default.png'

export default function ParkingLot() {
  const [parkingLot, setParkingLot] = useState([])
  const { get } = useFetch()
  const { propertyId, unitTypeId } = useParams()

  useEffect(() => {
    fetchParkingLot()
  }, [propertyId, unitTypeId])
  console.log('Unit Type ID:', unitTypeId)

  async function fetchParkingLot() {
    try {
      const parkingLotData = await get(
        `/v1/admin/premises/properties/${propertyId}/ParkingLot`,
      )
      console.log(parkingLotData)
      if (parkingLotData && parkingLotData.data) {
        setParkingLot(parkingLotData.data)
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
              <img className="rounded-circle w-50 " src={parkingLot.avatar || logo} />
            </div>
          </CCard>
        </CCol>
        <CCol md="8">
          <CCard className=" p-3 my-3 me-3" style={{ border: '0px' }}>
            <CListGroupItem>
              <CIcon
                icon={freeSet.cilLineStyle}
                size="lg"
                className="me-2"
                style={{ color: '#00bfcc' }}
              />
              <strong>Parking Lot</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            <CRow className="">
              <CCol className="p-2 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Name
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {parkingLot?.name || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                City
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {parkingLot?.city || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Use Type
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {parkingLot?.use_type || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Payment Term
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {parkingLot?.payment_term || '-'}
                </CCardText>
              </CCol>
            </CRow>
            <CRow>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Overdue Days
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {parkingLot?.invoice_overdue_days || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Invoice No Prefix
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {parkingLot?.invoice_no_prefix || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Invoice Day
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {parkingLot?.invoice_day || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Created At
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {parkingLot?.created_at || '-'}
                </CCardText>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
