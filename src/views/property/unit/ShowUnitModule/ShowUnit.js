import { CCol, CCard, CListGroupItem, CRow, CCardText, CCardBody, CButton } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'

import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { formatdate, status_color } from 'src/services/CommonFunctions'
import PickOwner from '../UnitFunctions/PickOwner'
import InvoicePayment from 'src/views/finance/InvoicePayment'
import InvoiceCancel from 'src/views/finance/InvoiceCancel'

export default function Showunit() {
  const { propertyId, unitId } = useParams()

  const [unit, setUnit] = useState({})

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
      console.log(invoices)
    }
  }

  async function getUnitData() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}/units/${unitId}`)
    console.log(api.data)

    setUnit(api.data)
    if (api.data) {
    }

    if (response.ok) {
      setUnit(api.data)
    }
  }

  return (
    <>
      <CCard className="   my-3 border-0 ">
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

        <CCol md="12" className="m-0">
          <CCard className=" p-3 mt-3 mt-0 border-0 ">
            <CListGroupItem>
              <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
              <strong className="text-black">Contract Info.</strong>
              <hr className="text-secondary" />
            </CListGroupItem>
            <CRow>
              {unit?.running_contracts?.length >= 1 ? (
                unit.running_contracts.map((contract) => (
                  <CCol md="4" key={contract.id}>
                    <CCard className="shadow-lg border-0 rounded-2 mb-3 ">
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
              invoices.map((invoice) => (
                <CCol key={invoice.id} md="4">
                  <CCard className="shadow-lg border-0 rounded-2 mb-3 ">
                    <CCardBody className="pt-0">
                      <CRow>
                        <CCol className="d-flex justify-content-end mt-2">
                          <button
                            className=" text-center border-0 p-1  mx-2 rounded-0 text-white "
                            style={{
                              backgroundColor: `${status_color(invoice?.status)}`,

                              width: '110px',
                            }}
                          >
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
              ))
            ) : (
              <p className="text-center  fst-italic">No Invoices Found</p>
            )}
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
