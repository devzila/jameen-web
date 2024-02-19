import { CCol, CCard, CListGroupItem, CCardImage, CRow, CCardText, CImage } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'

import { useParams, Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilLineStyle, cilCloudDownload } from '@coreui/icons'
import { freeSet } from '@coreui/icons'
import { formatdate } from 'src/services/dateFormatter'
import logo from '../../../assets/images/avatars/default.png'

export default function OverviewContent(propsd) {
  const { propertyId } = useParams()
  const [property, setProperty] = useState({})
  const [contract_info, setContract_info] = useState({})
  const [member_info, setMember_info] = useState([])

  const { get, response } = useFetch()

  useEffect(() => {
    getPropertyData()
  }, [])
  async function getPropertyData() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}`)

    if (api.data && api.data.running_contracts) {
      setProperty(api.data)
      setContract_info(api.data.running_contracts[0])
      const contractMembers =
        api.data.running_contracts[0] && api.data.running_contracts[0].contract_members

      setMember_info(contractMembers || [])
    } else {
      console.log('No running contracts found')
    }

    if (response.ok) {
      setProperty(api.data)
    }
  }

  return (
    <>
      <CRow>
        <CCol md="4">
          <CCard className=" p-5  m-3 border-0  " style={{ backgroundColor: '#00bfcc' }}>
            <div className="d-flex align-items-center justify-content-center h-100 ">
              <img className="rounded-circle w-50 " src={property.avatar || logo} />
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
                  {property?.name || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                City
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {property?.city || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Use Type
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {property?.use_type || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Payment Term
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {property?.payment_term || '-'}
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
                  {property?.invoice_overdue_days || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Invoice No Prefix
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {property?.invoice_no_prefix || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Invoice Day
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {property?.invoice_day || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Created At
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {property?.created_at || '-'}
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
              <strong>property Billing Details</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            <CRow className="">
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Electricity Account No.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {property?.electricity_account_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Water Account No.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {property?.water_account_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Internal Extension No.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {property?.internal_extension_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Last Status Changed
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {property?.year_built || '-'}
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