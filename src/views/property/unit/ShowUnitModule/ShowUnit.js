import { CCol, CCard, CListGroupItem, CRow, CCardText, CCardBody, CButton } from '@coreui/react'
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

export default function Showunit() {
  const { propertyId, unitId } = useParams()

  const [unit, setUnit] = useState({})
  const [invoices, setInvoices] = useState({})
  const [parkingData, setParkingData] = useState({})
  const { get, response } = useFetch()

  useEffect(() => {
    getUnitData()
    getUnitInvoices()
    getParkingData()
  }, [])

  async function getUnitInvoices() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}/invoices`)

    if (response.ok) {
      setInvoices(api.data)
    }
  }

  async function getUnitData() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}`)
    console.log(api)
    if (response.ok) {
      setUnit(api.data)
    }
  }

  async function getParkingData() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}/parkings`)
    if (response.ok) {
      setParkingData(api.data)
    }
  }
  const refresh_data = () => {
    getUnitData()
    getUnitInvoices()
  }

  return (
    <>
      <CCard className="my-2 border-0 ">
        <CRow>
          <CCol md="12">
            <CCard className=" px-3 pt-0  my-3 border-0 theme_color">
              <CListGroupItem>
                <div className="d-flex w-100 justify-content-between">
                  <div>
                    <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2" />
                    <strong className="text-black">Unit Information</strong>
                  </div>
                  <div className="d-flex">
                    <Edit unitId={unitId} after_submit={refresh_data} />

                    {unit.status === 'unallotted' ? (
                      <>
                        <AllocateUnit
                          unitId={unitId}
                          unitNo={unit.unit_no}
                          after_submit={refresh_data}
                        />
                        <Delete unitId={unitId} after_submit={refresh_data} />
                      </>
                    ) : null}
                    {unit.status === 'vacant' ? (
                      <MovingInUnit
                        unitId={unitId}
                        unitNo={unit.unit_no}
                        after_submit={refresh_data}
                      />
                    ) : null}
                  </div>
                </div>

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
                  Year Built
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.year_built || '-'}
                  </CCardText>
                </CCol>

                <CCol className="p-3 mt-0 fw-light">
                  Unit Type
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
                  Bedroom Number
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.bedrooms_number || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-3 mt-0 fw-light">
                  Bathroom Number
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.bathrooms_number || '-'}
                  </CCardText>
                </CCol>

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
              <CRow className="">
                <CCol className="p-3 mt-0 fw-light">
                  Electricity Account No.
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.electricity_account_number || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-3 mt-0 fw-light">
                  Water Account No.
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.water_account_number || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-3 mt-0 fw-light">
                  Internal Extension No.
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.internal_extension_number || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-3 mt-0 fw-light">
                  Last Status Changed
                  <CCardText className="fw-normal text-black text-capitalize">
                    {unit?.year_built || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-3 mt-0 fw-light"></CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </CCard>

      <CRow>
        <CCol md="12" className="m-0">
          <CCard className=" p-3 mt-1 border-0 ">
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
              {parkingData?.length ? (
                parkingData.map((parking) => (
                  <CRow key={parking.id} className="">
                    <CCol className="p-3 mt-0 fw-light">
                      Parking No.
                      <CCardText className="fw-normal text-black text-capitalize">
                        {parking?.parking_number || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-3 mt-0 fw-light">
                      Vehicles
                      <CCardText className="fw-normal text-black text-capitalize">
                        {parking?.bedrooms_number || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-3 mt-0 fw-light">
                      Created At
                      <CCardText className="fw-normal text-black text-capitalize">
                        {formatdate(parking.created_at) || '-'}
                      </CCardText>
                    </CCol>
                  </CRow>
                ))
              ) : (
                <p className="text-center  fst-italic">No Parking Data Found</p>
              )}
            </CRow>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol md="12" className="m-0">
          <CCard className="p-3 mt-3 border-0 ">
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
                      <CCard className="shadow-sm border-0 rounded-2 mb-3 ">
                        <CCardBody className="pt-0 mt-1">
                          <CRow>
                            <CCol md="12" className="theme_color">
                              Contract
                            </CCol>
                          </CRow>
                          <CRow>
                            <CCol> Type :</CCol>
                            <CCol className="text-capitalize">
                              {contract.contract_type.replace('_', ' ') || '-'}
                            </CCol>
                          </CRow>

                          <CCardText className=" m-0">
                            <CRow>
                              <CCol>Duration:</CCol>
                              <CCol>
                                {formatdate(contract.start_date) || '-'}
                                {formatdate(contract.end_date) || ' - Present'}
                              </CCol>
                            </CRow>
                          </CCardText>

                          <CCardText className="m-0">
                            <CRow>
                              <CCol md="12" className="theme_color">
                                Contract Members
                              </CCol>
                            </CRow>
                          </CCardText>

                          {contract.contract_members ? (
                            contract.contract_members.map((members, index) => (
                              <CCardText key={index} className="m-0  ps-1">
                                <CRow>
                                  <CCol>
                                    {index + 1 + '.'} {members.member.name + ' ' || '-'}
                                    <sub className="text-secondary">
                                      {members.member_type.replace('_', ' ') || '-'}{' '}
                                    </sub>
                                  </CCol>
                                </CRow>
                              </CCardText>
                            ))
                          ) : (
                            <p className="text-center  fst-italic">No Contract Members Found</p>
                          )}

                          <CCardText className=" m-0">
                            <CRow>
                              <CCol>Notes : </CCol>
                              <CCol className="text-wrap ">
                                <abbr
                                  style={{ cursor: 'pointer' }}
                                  className="text-decoration-none "
                                  data-toggle="tooltip"
                                  title={contract.notes || null}
                                >
                                  {contract.notes.slice(0, 15) + '...' || '-'}
                                </abbr>
                              </CCol>
                            </CRow>
                          </CCardText>
                        </CCardBody>
                      </CCard>
                    </NavLink>
                  </CCol>
                ))
              ) : (
                <p className="text-center  fst-italic">No Contracts Found</p>
              )}
            </CRow>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol md="12">
          <CCard className=" p-3 mt-3 mt-0 border-0 ">
            <CListGroupItem>
              <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
              <strong className="text-black">Invoices</strong>
              <hr className="text-secondary" />
            </CListGroupItem>

            {invoices?.length >= 1 ? (
              <CRow>
                {invoices.map((invoice) => (
                  <CCol key={invoice.id} md="4">
                    <CCard className="shadow-sm border-0 rounded-2 mb-3 ">
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

                        <CCardText className=" m-0">
                          <CRow>
                            <CCol>Invoice Date :</CCol>
                            <CCol>{invoice?.invoice_date || '-'}</CCol>
                          </CRow>
                        </CCardText>

                        <CCardText className="m-0">
                          <CRow>
                            <CCol> Invoice Period : </CCol>
                            <CCol>
                              {(formatdate(invoice?.period_from) || '-') +
                                '/' +
                                (formatdate(invoice?.period_to) || '-')}
                            </CCol>
                          </CRow>
                        </CCardText>
                        <CCardText className=" m-0">
                          <CRow>
                            <CCol className="d-flex align-items-center">Owner/Resident:</CCol>
                            <CCol className="p-0 m-0">
                              {PickOwner(invoice?.unit_contract?.contract_members || '-')}
                            </CCol>
                          </CRow>
                        </CCardText>
                        <CCardText className="m-0">
                          <CRow>
                            <CCol> Amount: </CCol>
                            <CCol>{invoice?.amount || '-'}</CCol>
                          </CRow>
                        </CCardText>
                        <CCardText className="m-0">
                          <CRow>
                            <CCol> VAT: </CCol>
                            <CCol>{invoice?.vat_amount || '-'}</CCol>
                          </CRow>
                        </CCardText>

                        <CCardText className="m-0">
                          <CRow>
                            <CCol> Total </CCol>
                            <CCol>{invoice?.total_amount || '-'}</CCol>
                          </CRow>
                        </CCardText>
                        <div className="d-flex justify-content-end">
                          <InvoicePayment invoice={invoice} />
                          <InvoiceCancel id={invoice.id} />
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            ) : (
              <p className="text-center  fst-italic">No Invoices Found</p>
            )}
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
