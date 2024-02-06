import { CCol, CCard, CListGroupItem, CCardImage, CRow, CCardText, CImage } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'

import { useParams, Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilLineStyle, cilCloudDownload } from '@coreui/icons'
import { freeSet } from '@coreui/icons'
import { formatdate } from 'src/services/dateFormatter'
import logo from '../../../../assets/images/avatars/default.png'

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
    console.log(api)

    setUnit(api.data)
    if (api.data) {
      setContract_info(api.data.running_contracts[0])
      const contractMembers =
        api.data.running_contracts &&
        api.data.running_contracts[0] &&
        api.data.running_contracts[0].contract_members

      setMember_info(contractMembers || [])
    }
    console.log(member_info)

    if (response.ok) {
      setUnit(api.data)
    }
  }
  console.log(unit)

  return (
    <>
      <CRow>
        <CCol md="4">
          <CCard className=" p-4 mx-3 my-3" style={{ border: '0px' }}>
            <CListGroupItem>
              <CIcon
                icon={freeSet.cilLineStyle}
                size="lg"
                className="me-2"
                style={{ color: '#00bfcc' }}
              />
              <strong>Property Details</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            <CRow className="">
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Name
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.property?.name || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Bedroom Number
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.bedrooms_number || '-'}
                </CCardText>
              </CCol>
            </CRow>
            <CRow>
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Bathroom Number
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.bathrooms_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Year Built
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.year_built || '-'}
                </CCardText>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
        <CCol md="6"></CCol>
      </CRow>
      <CRow>
        <CCol md="4">
          <CCard className=" p-4 m-3" style={{ border: '0px' }}>
            <CListGroupItem>
              <CIcon
                icon={freeSet.cilLineStyle}
                size="lg"
                className="me-2"
                style={{ color: '#00bfcc' }}
              />
              <strong>Building Details</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            <CRow className="">
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Name
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.building?.name || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Description
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.building?.description || '-'}
                </CCardText>
              </CCol>
            </CRow>
            <CRow>
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Bathroom Number
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.bathrooms_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Year Built
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.year_built || '-'}
                </CCardText>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
        <CCol md="8">
          <CCard className=" p-4 my-3 me-3" style={{ border: '0px' }}>
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
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Name
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.unit_type?.name || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Use Type
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.unit_type?.use_type || '-'}
                </CCardText>
              </CCol>

              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
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
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Total Area (sq. ft.)
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.unit_type?.sqft || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Monthly Maintenance/sq. ft.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.unit_type?.monthly_maintenance_amount_per_sqft || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
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

      {contract_info ? (
        <CRow>
          <CCol md="12">
            <CCard className=" p-4 m-3" style={{ border: '0px' }}>
              <CListGroupItem>
                <CIcon
                  icon={freeSet.cilLineStyle}
                  size="lg"
                  className="me-2"
                  style={{ color: '#00bfcc' }}
                />
                <strong>Contract Info.</strong>
                <hr style={{ color: '#C8C2C0' }} />
              </CListGroupItem>
              <CRow className="">
                <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                  Contract Type
                  <CCardText
                    className="fw-normal"
                    style={{ color: 'black', textTransform: 'capitalize' }}
                  >
                    {contract_info.contract_type || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                  Notes
                  <CCardText
                    className="fw-normal"
                    style={{ color: 'black', textTransform: 'capitalize' }}
                  >
                    {contract_info?.notes || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                  Start Date
                  <CCardText
                    className="fw-normal"
                    style={{ color: 'black', textTransform: 'capitalize' }}
                  >
                    {contract_info?.start_date || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                  End Date
                  <CCardText
                    className="fw-normal"
                    style={{ color: 'black', textTransform: 'capitalize' }}
                  >
                    {contract_info?.end_date || '-'}
                  </CCardText>
                </CCol>
              </CRow>
              <CRow></CRow>
            </CCard>
          </CCol>
        </CRow>
      ) : null}

      <CRow>
        <CCol md="12">
          <CCard className=" p-4 m-3" style={{ border: '0px' }}>
            <CListGroupItem>
              <CIcon
                icon={freeSet.cilUser}
                size="lg"
                className="me-2"
                style={{ color: '#00bfcc' }}
              />
              <strong>Contract Members</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            {member_info.map((member_) => (
              <CRow key={member_.member.id} className="">
                <CCol className="p-4 mt-3 fw-light " style={{ color: '#00bfcc' }}>
                  Name
                  <CCardText
                    className="fw-normal"
                    style={{ color: 'black', textTransform: 'capitalize' }}
                  >
                    <img
                      src={member_?.member.avatar || logo}
                      alt="Profile"
                      className="rounded-circle "
                      style={{ width: '25px', height: '25px' }}
                    />
                    {' ' + member_?.member.name || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                  Type
                  <CCardText
                    className="fw-normal"
                    style={{ color: 'black', textTransform: 'capitalize' }}
                  >
                    {member_?.member_type.replace('_', ' ') || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                  Username
                  <CCardText className="fw-normal" style={{ color: 'black' }}>
                    {member_?.member.username}
                  </CCardText>
                </CCol>
              </CRow>
            ))}

            <CRow></CRow>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol md="12">
          <CCard className=" p-4 m-3" style={{ border: '0px' }}>
            <CListGroupItem>
              <CIcon
                icon={freeSet.cilLineStyle}
                size="lg"
                className="me-2"
                style={{ color: '#00bfcc' }}
              />
              <strong>Documents</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            {unit?.running_contracts?.[0]?.documents?.map((document) => (
              <CRow key={document.id} className="">
                <CCol className="p-4 mt-3 fw-light " style={{ color: '#00bfcc' }}>
                  Name
                  <CCardText
                    className="fw-normal"
                    style={{ color: 'black', textTransform: 'capitalize' }}
                  >
                    {document.name || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                  Description
                  <CCardText
                    className="fw-normal"
                    style={{ color: 'black', textTransform: 'capitalize' }}
                  >
                    {document?.description || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                  View
                  <CCardText className="fw-normal ms-1" style={{ color: 'black' }}>
                    <CIcon
                      icon={freeSet.cilNotes}
                      size="xl"
                      onClick={() => window.open(document?.file, '_blank')}
                    />
                  </CCardText>
                </CCol>
                <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                  Download
                  <CCardText className="fw-normal ms-1" style={{ color: 'black' }}>
                    <Link to="#" target="_self" download>
                      <CIcon icon={freeSet.cilCloudDownload} size="xl" />
                    </Link>
                  </CCardText>
                </CCol>
              </CRow>
            ))}
            <CRow></CRow>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol md="12">
          <CCard className=" p-4 m-3" style={{ border: '0px' }}>
            <CListGroupItem>
              <CIcon
                icon={freeSet.cilLineStyle}
                size="lg"
                className="me-2"
                style={{ color: '#00bfcc' }}
              />
              <strong>Unit Billing Details</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            <CRow className="">
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Electricity Account No.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.electricity_account_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Water Account No.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.water_account_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Internal Extension No.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.internal_extension_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-4 mt-3 fw-light" style={{ color: '#00bfcc' }}>
                Last Status Changed
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {unit?.year_built || '-'}
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
