import { CCol, CCard, CListGroupItem, CRow, CCardText, CTable } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { formatdate } from '../../../../services/CommonFunctions'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Invoices from '../Invoices'
import ManualInvoice from './ManualInvoice'

export default function ShowContract() {
  const { propertyId, contractId } = useParams()
  const { get, response, loading, error } = useFetch()
  const [contract, setContractData] = useState({})

  useEffect(() => {
    loadInitialContractData()
  }, [])

  async function loadInitialContractData() {
    const endpoint = `/v1/admin/premises/properties/${propertyId}/contracts/${contractId}`
    const initialContractData = await get(endpoint)
    if (response.ok) {
      setContractData(initialContractData.data)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <>
      <CCard className="my-3 border-0 ">
        <CRow>
          <CCol md="12">
            <CCard className="p-3 my-3 border-0 theme_color">
              <CListGroupItem>
                <div className="d-flex w-100 justify-content-between">
                  <div>
                    <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2" />
                    <strong className="text-black">Contract Details</strong>
                  </div>
                  <div className="d-flex">
                    {contract.contract_type == 'allotment' ? (
                      <ManualInvoice after_submit={loadInitialContractData} />
                    ) : null}
                  </div>
                </div>

                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow className="">
                <CCol className="p-3 mt-0 fw-light">
                  Unit No
                  <CCardText className="fw-normal text-black text-capitalize">
                    {contract?.unit?.unit_no || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-3 mt-0 fw-light">
                  Contract Type
                  <CCardText className="fw-normal text-black text-capitalize">
                    {contract.contract_type || '-'}
                  </CCardText>
                </CCol>
              </CRow>
              <CRow>
                <CCol className="mt-0 fw-light">
                  Period
                  <CCardText className="fw-normal text-black text-capitalize">
                    {formatdate(contract.start_date) || '-'} to{' '}
                    {formatdate(contract.end_date) || 'present Day'}{' '}
                  </CCardText>
                </CCol>
                <CCol className=" mt-0 fw-light">
                  Notes
                  <CCardText className="fw-normal text-black text-capitalize">
                    {contract.notes || '-'}
                  </CCardText>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </CCard>
      <CCard className="border-0">
        <CCol md="12" className="m-0">
          <CCard className="p-3 my-3 border-0 theme_color">
            <CListGroupItem>
              <CIcon icon={freeSet.cilPeople} size="lg" className="me-2" />
              <strong className="text-black">Members</strong>
              <hr className="text-secondary" />
            </CListGroupItem>
            <CTable responsive="sm" className="table table-striped mb-0">
              <thead>
                <tr>
                  <th>Member Type</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                {contract?.contract_members?.map((member, index) => (
                  <tr key={index}>
                    <td className="text-capitalize">
                      {member.member_type.replace(/_/g, ' ') || '-'}
                    </td>
                    <td>{member.member.first_name || '-'}</td>
                    <td>{member.member.last_name || '-'}</td>
                    <td>{member.member.username || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </CTable>
          </CCard>
        </CCol>
      </CCard>

      <CCard className="mt-3 border-0">
        <CRow>
          <CCol md="12">
            <CCard className=" p-3 my-3 mt-2 border-0 ">
              <CListGroupItem>
                <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
                <strong className="text-black">Documents</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
              {undefined?.length ? (
                <CRow className="">
                  <CCol className="p-3 mt-0 fw-light">
                    <CCardText className="fw-normal text-black text-capitalize">
                      {contract?.electricity_account_number || '-'}
                    </CCardText>
                  </CCol>
                  <CCol className="p-3 mt-0 fw-light">
                    <CCardText className="fw-normal text-black text-capitalize">
                      {contract?.water_account_number || '-'}
                    </CCardText>
                  </CCol>
                  <CCol className="p-3 mt-0 fw-light">
                    <CCardText className="fw-normal text-black text-capitalize">
                      {contract?.internal_extension_number || '-'}
                    </CCardText>
                  </CCol>
                  <CCol className="p-3 mt-0 fw-light">
                    <CCardText className="fw-normal text-black text-capitalize">
                      {contract?.year_built || '-'}
                    </CCardText>
                  </CCol>
                </CRow>
              ) : (
                <p className="text-center fst-italic text-secondary bg-white p-3">
                  No Documents Found
                </p>
              )}
            </CCard>
          </CCol>
        </CRow>
      </CCard>
      <CCard className="mt-3 border-0">
        <Invoices />
      </CCard>
    </>
  )
}
