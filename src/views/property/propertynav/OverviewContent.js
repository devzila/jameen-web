import { CCol, CCard, CListGroupItem, CRow, CCardText, CContainer, CButton } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'

import { useParams, Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { formatdate } from 'src/services/CommonFunctions'
import EditProperty from '../EditProperty'
import DeleteProperty from '../DeleteProperty'

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
    }

    if (response.ok) {
      setProperty(api.data)
    }
  }
  const handleDelete = async () => {}

  return (
    <>
      <CContainer>
        <CRow>
          <CCol className="mt-3" md="4">
            <CCard
              className=" shadow-lg border-0 rounded-2 mb-4  p-0 my-3 "
              style={{ backgroundColor: '#00bfcc' }}
            >
              <div className="d-flex align-items-center justify-content-center">
                <img
                  style={{
                    width: '100%',
                    height: '255px',
                    borderRadius: '0px',
                    display: 'block',
                    margin: '0 auto',
                    objectFit: 'cover',
                  }}
                  src={
                    property.photo ||
                    'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJ1aWxkaW5nc3xlbnwwfHwwfHx8MA%3D%3D'
                  }
                />
              </div>
            </CCard>
          </CCol>
          <CCol className="mt-3" md="8">
            <CCard className=" p-3 my-3 mb-3   border-0 theme_color">
              <CListGroupItem>
                <div className="d-flex justify-content-between">
                  <div>
                    <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2" />
                    <strong className="text-black">Overview</strong>
                  </div>
                  <div className="d-flex justify-content-end mb-2">
                    <EditProperty propertyId={propertyId} />
                    <DeleteProperty propertyId={propertyId} />
                  </div>
                </div>
                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow className="">
                <CCol className="p-2 mt-0 fw-light">
                  Name
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.name || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  City
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.city || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Use Type
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.use_type || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Payment Term
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.payment_term || '-'}
                  </CCardText>
                </CCol>
              </CRow>
              <CRow>
                <CCol className="p-2 mt-0 fw-light">
                  Overdue Days
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.invoice_overdue_days || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Invoice No Prefix
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.invoice_no_prefix || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Invoice Day
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.invoice_day || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Created At
                  <CCardText className="fw-normal text-black text-capitalize">
                    {formatdate(property?.created_at)}
                  </CCardText>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>

        <CRow>
          <CCol md="12">
            <CCard className=" p-3 my-3 mt-2 border-0 theme_color">
              <CListGroupItem>
                <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
                <strong className="text-black">Billing Info.</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow className="">
                <CCol className="p-2 mt-0 fw-light">
                  Electricity Account No.
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.electricity_account_number || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Water Account No.
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.water_account_number || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Internal Extension No.
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.internal_extension_number || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Last Status Changed
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.year_built || '-'}
                  </CCardText>
                </CCol>
              </CRow>
              <CRow></CRow>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}
