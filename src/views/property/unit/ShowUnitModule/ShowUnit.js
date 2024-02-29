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
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'

import { useParams, Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilLineStyle, cilCloudDownload } from '@coreui/icons'
import { freeSet } from '@coreui/icons'
import { formatdate, status_color } from 'src/services/CommonFunctions'
import logo from '../../../../assets/images/avatars/default.png'
import PickOwner from '../UnitFunctions/PickOwner'

export default function Showunit() {
  const { propertyId, unitId } = useParams()

  const [unit, setUnit] = useState({})
  const [contract_info, setContract_info] = useState({})
  const [member_info, setMember_info] = useState([])

  const [invoices, setInvoices] = useState({})
  const { get, response } = useFetch()

  useEffect(() => {
    getUnitData()
    getUnitInvoices()
  }, [])

  async function getUnitInvoices() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}/invoices`)
    console.log(api.data)

    if (response.ok) {
      setInvoices(api.data)
    }
  }

  async function getUnitData() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}`)
    console.log(api.data.id)

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
      <CCard className=" p-3  my-3 border-0 ">
        <CRow>
          <CCol md="4">
            <CCard className=" p-3  my-3 border-0 theme_color">
              <CListGroupItem>
                <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2" />
                <strong className="text-black">Property Details</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow className="">
                <CCol className="p-3 mt-0 fw-light">
                  Name
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.property?.name || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-3 mt-0 fw-light">
                  Bedroom Number
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.bedrooms_number || '-'}
                  </CCardText>
                </CCol>
              </CRow>
              <CRow>
                <CCol className="mt-0 fw-light">
                  Bathroom Number
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.bathrooms_number || '-'}
                  </CCardText>
                </CCol>
                <CCol className=" mt-0 fw-light">
                  Year Built
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.year_built || '-'}
                  </CCardText>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
          <CCol md="8">
            <CCard className=" p-3 my-3 border-0 theme_color">
              <CListGroupItem>
                <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2" />
                <strong className="text-black">Unit Information</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow className="">
                <CCol className="p-3 mt-0 fw-light">
                  Name
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.unit_type?.name || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-3 mt-0 fw-light">
                  Use Type
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.unit_type?.use_type || '-'}
                  </CCardText>
                </CCol>

                <CCol className="p-3 mt-0 fw-light">
                  Description
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.unit_type?.description || '-'}
                  </CCardText>
                </CCol>
              </CRow>
              <CRow>
                <CCol className="p-3 mt-0 fw-light">
                  Total Area (sq. ft.)
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.unit_type?.sqft || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-3 mt-0 fw-light">
                  Monthly Maintenance/sq. ft.
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.unit_type?.monthly_maintenance_amount_per_sqft || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-3 mt-0 fw-light">
                  Last Modified
                  <CCardText className="fw-normal text-black text-capitalize">
                    {formatdate(unit?.unit_type?.updated_at) || '-'}
                  </CCardText>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </CCard>

      <CRow>
        {/* <CCol md="12">
          <CCard className=" p-4 mt-1 border-0 theme_color">
            <CListGroupItem>
              <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2" />
              <strong className="text-black">Building Details</strong>
              <hr className="text-secondary" />
            </CListGroupItem>
            <CRow className="">
              <CCol className="p-3 mt-0 fw-light">
                Name
                <CCardText className="fw-normal text-black text-capitalize">
                  {unit?.building?.name || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light">
                Description
                <CCardText className="fw-normal text-black text-capitalize">
                  {unit?.building?.description || '-'}
                </CCardText>
              </CCol>

              <CCol className="p-3 mt-0 fw-light">
                Bathroom Number
                <CCardText className="fw-normal text-black text-capitalize">
                  {unit?.bathrooms_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light">
                Year Built
                <CCardText className="fw-normal text-black text-capitalize">
                  {unit?.year_built || '-'}
                </CCardText>
              </CCol>
            </CRow>
          </CCard>
        </CCol> */}

        {member_info && member_info[0] ? (
          <CCol md="12">
            <CCard className=" p-3 mt-3 border-0 theme_color">
              {/* <CListGroupItem>
                <CIcon icon={freeSet.cilUser} size="lg" className="me-2" />
                <strong className="text-black">Contract Members</strong>
                <hr className="text-secondary" />
              </CListGroupItem> */}
              {contract_info ? (
                <CRow>
                  <CCol md="12">
                    <CCard className="  border-0 theme_color">
                      <CListGroupItem>
                        <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2" />
                        <strong className="text-black">Contract Info.</strong>
                        <hr className="text-secondary" />
                      </CListGroupItem>
                      <CRow className="">
                        <CCol className="p-3 mt-0 fw-light">
                          Contract Type
                          <CCardText className="fw-normal text-black text-capitalize">
                            {contract_info.contract_type || '-'}
                          </CCardText>
                        </CCol>
                        <CCol className="p-3 mt-0 fw-light">
                          Notes
                          <CCardText className="fw-normal text-black text-capitalize">
                            {contract_info?.notes || '-'}
                          </CCardText>
                        </CCol>
                        <CCol className="p-3 mt-0 fw-light">
                          Start Date
                          <CCardText className="fw-normal text-black text-capitalize">
                            {contract_info?.start_date || '-'}
                          </CCardText>
                        </CCol>
                        <CCol className="p-3 mt-0 fw-light">
                          End Date
                          <CCardText className="fw-normal text-black text-capitalize">
                            {contract_info?.end_date || '-'}
                          </CCardText>
                        </CCol>
                      </CRow>
                      <CRow></CRow>
                    </CCard>
                  </CCol>
                </CRow>
              ) : null}

              {member_info.map((member_) => (
                <CRow key={member_.member.id} className="">
                  <CCol className="p-3 mt-0 fw-light ">
                    Name
                    <CCardText className="fw-normal text-black text-capitalize">
                      <img
                        src={member_?.member.avatar || logo}
                        alt="Profile"
                        className="rounded-circle "
                        style={{ width: '25px', height: '25px' }}
                      />
                      {' ' + member_?.member.name || '-'}
                    </CCardText>
                  </CCol>
                  <CCol className="p-3 mt-0 fw-light">
                    Type
                    <CCardText className="fw-normal text-black text-capitalize">
                      {member_?.member_type.replace('_', ' ') || '-'}
                    </CCardText>
                  </CCol>
                  <CCol className="p-3 mt-0 fw-light">
                    Username
                    <CCardText className="fw-normal text-black text-capitalize">
                      {member_?.member.username}
                    </CCardText>
                  </CCol>
                </CRow>
              ))}

              <CRow></CRow>
            </CCard>
          </CCol>
        ) : null}
      </CRow>

      <CRow>
        <CCol md="12">
          <CCard className=" p-3 mt-3 mt-0 border-0 ">
            <CListGroupItem>
              <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
              <strong className="text-black">Invoices</strong>
              <hr className="text-secondary" />
            </CListGroupItem>
            <CCol md="4">
              <CCard className="shadow-lg border-0 rounded-2 mb-3 ">
                <CCardBody className="pt-0">
                  <CRow>
                    <CCol className="d-flex justify-content-end mt-2">
                      <button
                        className=" text-center border-0 p-1  mx-2 rounded-0 text-white "
                        style={{
                          backgroundColor: `${status_color(invoices[0]?.status)}`,

                          width: '110px',
                        }}
                      >
                        {invoices[0]?.status || '-'}
                      </button>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md="4">Invoice No :</CCol>
                    <CCol md="8">{invoices[0]?.number || '-'}</CCol>
                  </CRow>

                  <CCardText className=" m-0">
                    <CRow>
                      <CCol md="4">Invoice Date :</CCol>
                      <CCol md="8">{invoices[0]?.invoice_date || '-'}</CCol>
                    </CRow>
                  </CCardText>

                  <CCardText className="m-0">
                    <CRow>
                      <CCol md="4"> Invoice Period : </CCol>
                      <CCol md="8">
                        {(invoices[0]?.period_from || '-') + '/' + (invoices[0]?.period_to || '-')}
                      </CCol>
                    </CRow>
                  </CCardText>
                  <CCardText className=" m-0">
                    <CRow>
                      <CCol md="4" className="d-flex align-items-center">
                        Owner/Resident:
                      </CCol>
                      <CCol md="8">
                        {/* {invoices[0].runPickOwner(invoices[0]?.unit_contract) || '-'} */}
                      </CCol>
                    </CRow>
                  </CCardText>
                  <CCardText className="m-0">
                    <CRow>
                      <CCol md="4"> Amount: </CCol>
                      <CCol md="8">{invoices[0]?.amount || '-'}</CCol>
                    </CRow>
                  </CCardText>
                  <CCardText className="m-0">
                    <CRow>
                      <CCol md="4"> VAT: </CCol>
                      <CCol md="8">{invoices[0]?.vat_amount || '-'}</CCol>
                    </CRow>
                  </CCardText>

                  <CCardText className="m-0">
                    <CRow>
                      <CCol md="4"> Total </CCol>
                      <CCol md="8">{invoices[0]?.total_amount || '-'}</CCol>
                    </CRow>
                  </CCardText>
                  <div className="d-flex justify-content-end">
                    <CButton className="btn-light custom_theme_button">Pay</CButton>
                    <CButton className="btn-light custom_grey_button mx-2">Decline</CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
