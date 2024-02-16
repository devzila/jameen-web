import { CCol, CCard, CListGroupItem, CCardImage, CRow, CCardText, CImage } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'

import { useParams, Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilLineStyle, cilCloudDownload } from '@coreui/icons'
import { freeSet } from '@coreui/icons'
import { formatdate } from 'src/services/dateFormatter'
import logo from '../../../assets/images/avatars/default.png'

export default function Showunit(propsd) {
  const { propertyId, unitId } = useParams()
  const [unit, setUnit] = useState({})
  const [contract_info, setContract_info] = useState({})
  const [member_info, setMember_info] = useState([])

  const { get, response } = useFetch()

  useEffect(() => {
    getUnitData()
  }, [])
  async function getUnitData() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}`)

    setUnit(api.data)
    if (api.data) {
      setContract_info(api.data.running_contracts[0])
      const contractMembers =
        api.data.running_contracts &&
        api.data.running_contracts[0] &&
        api.data.running_contracts[0].contract_members

      setMember_info(contractMembers || [])
    }

    if (response.ok) {
      setUnit(api.data)
    }
  }

  return (
    <>
      <CRow>
        <CCol md="12">
          <CCard className=" p-3 my-3 me-3" style={{ border: '0px' }}>
            <CListGroupItem>
              <CIcon
                icon={freeSet.cilLineStyle}
                size="lg"
                className="me-2"
                style={{ color: '#00bfcc' }}
              />
              <strong>Unit Information</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            <CRow className="">
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Name
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.unit_type?.name || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Use Type
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.unit_type?.use_type || '-'}
                </CCardText>
              </CCol>

              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Description
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.unit_type?.description || '-'}
                </CCardText>
              </CCol>
            </CRow>
            <CRow>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Total Area (sq. ft.)
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.unit_type?.sqft || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Monthly Maintenance/sq. ft.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.unit_type?.monthly_maintenance_amount_per_sqft || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                Last Modified
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {formatdate(unit?.unit_type?.updated_at) || '-'}
                </CCardText>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
