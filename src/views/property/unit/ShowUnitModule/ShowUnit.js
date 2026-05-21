import { CCol, CCard, CListGroupItem, CRow, CCardText, CCardBody, CAvatar } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { NavLink, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

import { formatdate, status_color } from 'src/services/CommonFunctions'

import PickOwner from '../UnitFunctions/PickOwner'
import InvoicePayment from 'src/views/finance/InvoicePayment'
import InvoiceCancel from 'src/views/finance/InvoiceCancel'
import Edit from '../EditUnit'
import Delete from '../DeleteUnit'
import AllocateUnit from '../AllocateUnit'
import MovingInUnit from '../MovingInUnit'
import AddParking from './AllotParking'
import CheckPermissions from 'src/permissions/CheckPermissions'

import avtar from 'src/assets/images/default-building.png'

export default function Showunit() {
  const { propertyId, unitId } = useParams()

  const [unit, setUnit] = useState({})
  const [invoices, setInvoices] = useState([])
  const [parkingData, setParkingData] = useState([])
  const [residents, setResidents] = useState([])

  const { get, response } = useFetch()

  useEffect(() => {
    getUnitData()
    getUnitInvoices()
    getParkingData()
    getResidents()
  }, [])

  async function getUnitData() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}`)

    console.log('Unit API => ', api)

    if (response.ok) {
      setUnit(api.data || {})
    }
  }

  async function getUnitInvoices() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}/invoices`)

    if (response.ok) {
      setInvoices(api.data || [])
    }
  }

  async function getParkingData() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}/parkings`)

    if (response.ok) {
      setParkingData(api.data || [])
    }
  }

  async function getResidents() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}/residents`)

    console.log('Residents API => ', api)

    if (response.ok) {
      setResidents(api.data || [])
    }
  }

  const refresh_data = () => {
    getUnitData()
    getUnitInvoices()
    getResidents()
  }
  const calculateAge = (dob) => {
    if (!dob) return '-'

    const birthDate = new Date(dob)
    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()

    const monthDifference = today.getMonth() - birthDate.getMonth()

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }
  return (
    <>
      {/* UNIT INFORMATION */}

      <CCard className="my-2 border-0">
        <CRow>
          <CCol md="12">
            <CCard className="px-3 pt-0 my-3 border-0 theme_color">
              <CListGroupItem>
                <div className="d-flex w-100 justify-content-between">
                  <div>
                    <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2" />

                    <strong className="text-black">Unit Information</strong>
                  </div>

                  <div className="d-flex">
                    <CheckPermissions
                      component={<Edit unitId={unitId} after_submit={refresh_data} />}
                      keys={['unit', 'create']}
                    />

                    {unit.status === 'unallotted' ? (
                      <CheckPermissions
                        component={
                          <>
                            <AllocateUnit
                              unitId={unitId}
                              unitNo={unit.unit_no}
                              after_submit={refresh_data}
                            />

                            <Delete unitId={unitId} after_submit={refresh_data} />
                          </>
                        }
                        keys={['operation', 'manage_allotment']}
                      />
                    ) : null}

                    {unit.status === 'vacant' ? (
                      <CheckPermissions
                        component={
                          <MovingInUnit
                            unitId={unitId}
                            unitNo={unit.unit_no}
                            after_submit={refresh_data}
                          />
                        }
                        keys={['operation', 'manage_moving_in']}
                      />
                    ) : null}
                  </div>
                </div>

                <hr className="text-secondary" />
              </CListGroupItem>

              <CRow>
                <CCol className="p-3 fw-light">
                  Name
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.property?.name || '-'}
                  </CCardText>
                </CCol>

                <CCol className="p-3 fw-light">
                  Year Built
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.year_built || '-'}
                  </CCardText>
                </CCol>

                <CCol className="p-3 fw-light">
                  Unit Type
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.unit_type?.name || '-'}
                  </CCardText>
                </CCol>

                <CCol className="p-3 fw-light">
                  Use Type
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.unit_type?.use_type || '-'}
                  </CCardText>
                </CCol>

                <CCol className="p-3 fw-light">
                  Description
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.unit_type?.description || '-'}
                  </CCardText>
                </CCol>
              </CRow>

              <CRow>
                <CCol className="p-3 fw-light">
                  Bedroom Number
                  <CCardText className="fw-normal text-black">
                    {unit?.bedrooms_number || '-'}
                  </CCardText>
                </CCol>

                <CCol className="p-3 fw-light">
                  Bathroom Number
                  <CCardText className="fw-normal text-black">
                    {unit?.bathrooms_number || '-'}
                  </CCardText>
                </CCol>

                <CCol className="p-3 fw-light">
                  Total Area (sq. ft.)
                  <CCardText className="fw-normal text-black">
                    {unit?.unit_type?.sqft || '-'}
                  </CCardText>
                </CCol>

                <CCol className="p-3 fw-light">
                  Monthly Maintenance/sq. ft.
                  <CCardText className="fw-normal text-black">
                    {unit?.unit_type?.monthly_maintenance_amount_per_sqft || '-'}
                  </CCardText>
                </CCol>

                <CCol className="p-3 fw-light">
                  Last Modified
                  <CCardText className="fw-normal text-black">
                    {formatdate(unit?.unit_type?.updated_at) || '-'}
                  </CCardText>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </CCard>

      {/* OWNERS & RESIDENTS */}

      <CRow>
        <CCol md="12">
          <CCard className="p-3 mt-3 border-0">
            <CListGroupItem>
              <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
              <strong className="text-black">Owners & Residents</strong>
              <hr className="text-secondary" />
            </CListGroupItem>

            <CRow>
              {residents?.length > 0 ? (
                residents.map((member, index) => (
                  <CCol md="4" key={index}>
                    <CCard className="shadow-sm border-0 rounded-3 mb-3">
                      <CCardBody>
                        <div className="d-flex align-items-center mb-3">
                          <CAvatar src={member?.avatar || avtar} size="xl" className="me-3" />
                          <div>
                            <h6 className="mb-0 text-capitalize">
                              {member?.first_name || member?.last_name
                                ? `${member?.first_name || ''} ${member?.last_name || ''}`
                                : '-'}
                            </h6>
                          </div>
                        </div>

                        <CCardText className="mb-1">
                          <strong>Age:</strong> {calculateAge(member?.dob)}
                        </CCardText>

                        <CCardText className="mb-1 text-capitalize">
                          <strong>Gender:</strong> {member?.gender || '-'}
                        </CCardText>

                        <div className="mb-1">
                          <strong>Join Date:</strong>
                          {formatdate(member?.join_date) || '-'}
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))
              ) : (
                <p className="text-center fst-italic">No Owner/Resident Data Found</p>
              )}
            </CRow>
          </CCard>
        </CCol>
      </CRow>

      {/* PARKING INFO */}

      <CRow>
        <CCol md="12" className="m-0">
          <CCard className="p-3 mt-1 border-0">
            <CListGroupItem>
              <div className="d-flex w-100 justify-content-between">
                <div>
                  <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
                  <strong className="text-black">Parking Info.</strong>
                </div>

                <div className="d-flex">
                  <AddParking unitId={unitId} after_submit={getParkingData} />
                </div>
              </div>

              <hr className="text-secondary" />
            </CListGroupItem>

            <CRow>
              {parkingData?.length > 0 ? (
                parkingData.map((parking) => (
                  <CRow key={parking.id}>
                    <CCol className="p-3 fw-light">
                      Parking No.
                      <CCardText className="fw-normal text-black">
                        {parking?.parking_number || '-'}
                      </CCardText>
                    </CCol>

                    <CCol className="p-3 fw-light">
                      Vehicles
                      <CCardText className="fw-normal text-black">
                        {parking?.bedrooms_number || '-'}
                      </CCardText>
                    </CCol>

                    <CCol className="p-3 fw-light">
                      Created At
                      <CCardText className="fw-normal text-black">
                        {formatdate(parking.created_at) || '-'}
                      </CCardText>
                    </CCol>
                  </CRow>
                ))
              ) : (
                <p className="text-center fst-italic">No Parking Data Found</p>
              )}
            </CRow>
          </CCard>
        </CCol>
      </CRow>

      {/* CONTRACT INFO */}

      <CRow>
        <CCol md="12" className="m-0">
          <CCard className="p-3 mt-3 border-0">
            <CListGroupItem>
              <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
              <strong className="text-black">Contract Info.</strong>
              <hr className="text-secondary" />
            </CListGroupItem>

            <CRow>
              {unit?.running_contracts?.length >= 1 ? (
                unit.running_contracts.map((contract) => (
                  <CCol md="4" key={contract.id}>
                    <NavLink to={`contract/${contract.id}`}>
                      <CCard className="shadow-sm border-0 rounded-2 mb-3">
                        <CCardBody className="pt-0 mt-1">
                          <CRow>
                            <CCol md="12" className="theme_color">
                              Contract
                            </CCol>
                          </CRow>

                          <CRow>
                            <CCol>Type :</CCol>

                            <CCol className="text-capitalize">
                              {contract.contract_type?.replace('_', ' ') || '-'}
                            </CCol>
                          </CRow>

                          <CCardText className="m-0">
                            <CRow>
                              <CCol>Duration:</CCol>

                              <CCol>
                                {formatdate(contract.start_date) || '-'} -
                                {formatdate(contract.end_date) || 'Present'}
                              </CCol>
                            </CRow>
                          </CCardText>
                        </CCardBody>
                      </CCard>
                    </NavLink>
                  </CCol>
                ))
              ) : (
                <p className="text-center fst-italic">No Contracts Found</p>
              )}
            </CRow>
          </CCard>
        </CCol>
      </CRow>

      {/* INVOICES */}

      <CRow>
        <CCol md="12">
          <CCard className="p-3 mt-3 border-0">
            <CListGroupItem>
              <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
              <strong className="text-black">Invoices</strong>
              <hr className="text-secondary" />
            </CListGroupItem>
            {invoices?.length >= 1 ? (
              <CRow>
                {invoices.map((invoice) => (
                  <CCol key={invoice.id} md="4">
                    <CCard className="shadow-sm border-0 rounded-2 mb-3">
                      <CCardBody className="pt-0">
                        <CRow>
                          <CCol className="d-flex justify-content-end mt-2">
                            <button className={`request-${status_color(invoice?.status)}`}>
                              {invoice?.status || '-'}
                            </button>
                          </CCol>
                        </CRow>

                        <CRow>
                          <CCol>Invoice No :</CCol>

                          <CCol>{invoice?.number || '-'}</CCol>
                        </CRow>

                        <CCardText className="m-0">
                          <CRow>
                            <CCol>Invoice Date :</CCol>

                            <CCol>{invoice?.invoice_date || '-'}</CCol>
                          </CRow>
                        </CCardText>

                        <CCardText className="m-0">
                          <CRow>
                            <CCol>Invoice Period :</CCol>

                            <CCol>
                              {(formatdate(invoice?.period_from) || '-') +
                                '/' +
                                (formatdate(invoice?.period_to) || '-')}
                            </CCol>
                          </CRow>
                        </CCardText>

                        <CCardText className="m-0">
                          <CRow>
                            <CCol className="d-flex align-items-center">Owner/Resident:</CCol>
                            <CCol className="p-0 m-0">
                              {PickOwner(invoice?.unit_contract?.contract_members)}
                            </CCol>
                          </CRow>
                        </CCardText>

                        <CCardText className="m-0">
                          <CRow>
                            <CCol>Amount:</CCol>

                            <CCol>{invoice?.amount || '-'}</CCol>
                          </CRow>
                        </CCardText>

                        <CCardText className="m-0">
                          <CRow>
                            <CCol>VAT:</CCol>

                            <CCol>{invoice?.vat_amount || '-'}</CCol>
                          </CRow>
                        </CCardText>

                        <CCardText className="m-0">
                          <CRow>
                            <CCol>Total</CCol>

                            <CCol>{invoice?.total_amount || '-'}</CCol>
                          </CRow>
                        </CCardText>

                        <div className="d-flex justify-content-end">
                          <CheckPermissions
                            component={<InvoicePayment invoice={invoice} />}
                            keys={['invoice', 'can_mark_as_paid']}
                          />

                          <CheckPermissions
                            component={<InvoiceCancel id={invoice.id} />}
                            keys={['invoice', 'cancel']}
                          />
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            ) : (
              <p className="text-center fst-italic">No Invoices Found</p>
            )}
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
