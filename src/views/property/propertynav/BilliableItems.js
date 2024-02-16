import React, { useState, useEffect } from 'react'
import { CCol, CCard, CListGroupItem, CCardImage, CRow, CCardText, CImage } from '@coreui/react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import logo from '../../../assets/images/avatars/default.png'

export default function BillableItems() {
  const [billableItems, setBillableItems] = useState([])
  const { get } = useFetch()
  const { propertyId, unitTypeId } = useParams()

  useEffect(() => {
    fetchBillableItems()
  }, [propertyId, unitTypeId])
  console.log('Unit Type ID:', unitTypeId)

  async function fetchBillableItems() {
    try {
      const billableItemsData = await get(
        `/v1/admin/premises/properties/${propertyId}/unit_types/${unitTypeId}/billable_items`,
      )
      console.log(billableItemsData)
      if (billableItemsData && billableItemsData.data) {
        setBillableItems(billableItemsData.data)
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
              <img className="rounded-circle w-50 " src={billableItems.avatar || logo} />
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
              <strong>Overview</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            <CRow className="">
              <CCol className="p-2 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Name
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {billableItems?.name || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                City
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {billableItems?.city || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Use Type
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {billableItems?.use_type || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Payment Term
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {billableItems?.payment_term || '-'}
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
                  {billableItems?.invoice_overdue_days || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Invoice No Prefix
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {billableItems?.invoice_no_prefix || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Invoice Day
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {billableItems?.invoice_day || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Created At
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {billableItems?.created_at || '-'}
                </CCardText>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol md="12">
          <CCard className=" p-3 m-3" style={{ border: '0px' }}>
            <CListGroupItem>
              <CIcon
                icon={freeSet.cilLineStyle}
                size="lg"
                className="me-2"
                style={{ color: '#00bfcc' }}
              />
              <strong>billableItems Billing Details</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            <CRow className="">
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Electricity Account No.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {billableItems?.electricity_account_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Water Account No.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {billableItems?.water_account_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Internal Extension No.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {billableItems?.internal_extension_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Last Status Changed
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {billableItems?.year_built || '-'}
                </CCardText>
              </CCol>
            </CRow>
            <CRow></CRow>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
