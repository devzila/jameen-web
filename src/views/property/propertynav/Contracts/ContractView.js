import { CCol, CCard, CListGroupItem, CRow, CCardText, CTable } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { formatdate } from '../../../../services/CommonFunctions'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

export default function ContractView() {
  const { propertyId, contractId } = useParams()
  const { get, response, loading, error } = useFetch()
  const [contract, setContractData] = useState({})

  useEffect(() => {
    loadInitialContractData()
  }, [])

  async function loadInitialContractData() {
    const endpoint = `/v1/admin/premises/properties/${propertyId}/contracts/${contractId}`
    const initialContractData = await get(endpoint)
    console.log(initialContractData)
    if (response.ok) {
      setContractData(initialContractData.data)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <CCard className="my-3 border-0">
      <CRow>
        <CCol md="8">
          <CCard className="p-3 my-3 border-0 theme_color">
            <CListGroupItem>
              <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2" />
              <strong className="text-black">Contract Details</strong>
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
        <CCol md="12" className="m-0">
          <CCard className="p-3 my-3 border-0 theme_color">
            <CListGroupItem>
              <CIcon icon={freeSet.cilPeople} size="lg" className="me-2" />
              <strong className="text-black">Members</strong>
              <hr className="text-secondary" />
            </CListGroupItem>
            <CTable  responsive="sm">
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
                    <td>{member.member_type.replace(/_/g, ' ') || '-'}</td>
                    <td>{member.member.first_name || '-'}</td>
                    <td>{member.member.last_name || '-'}</td>
                    <td>{member.member.username || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </CTable>
          </CCard>
        </CCol>
        <CRow>
          <CCol md="12">
            <CCard className=" p-3 my-3 mt-2 border-0 theme_color">
              <CListGroupItem>
                <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
                <strong className="text-black">Documents</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
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
              <CRow></CRow>
            </CCard>
          </CCol>
        </CRow>
      </CRow>
    </CCard>
  )
}
