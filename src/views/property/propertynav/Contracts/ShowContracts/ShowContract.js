import { CCol, CCard, CListGroupItem, CRow, CCardText, CTable } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { formatdate } from '../../../../../services/CommonFunctions'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Invoices from './Invoice'
import defaultAvatar from '../../../../../assets/images/avatars/default.png'
import MovingInUnit from 'src/views/property/unit/MovingInUnit'
import ContractDocuments from './ContractDocuments'

export default function ShowContract() {
  const { propertyId, contractId } = useParams()
  const { get, response, loading, error } = useFetch()
  const [contract, setContractData] = useState({})

  const params = useParams()

  const for_moving_in = params['*'].split('/')[0] == 'moving-in'

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

  return (
    <>
      <CCard className="my-3 border-0 ">
        <CRow>
          <CCol md="12">
            <CCard className="p-3 border-0 theme_color">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <CListGroupItem>
                  <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2" />
                  <strong className="text-black">Contract Details</strong>
                </CListGroupItem>
                <div>
                  {contract?.unit?.status === 'vacant' ? (
                    <MovingInUnit
                      unitId={contract?.unit?.id}
                      unitNo={contract?.unit?.unit_no}
                      after_submit={loadInitialContractData}
                    />
                  ) : null}
                </div>
              </div>
              <hr className="text-secondary p-0 m-0" />
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
                    {contract?.contract_type?.replace('_', ' ') || '-'}
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
          <CCard className="p-3 border-0 theme_color">
            <CListGroupItem>
              <CIcon icon={freeSet.cilPeople} size="lg" className="me-2" />
              <strong className="text-black">Members</strong>
              <hr className="text-secondary p-0 mt-1" />
            </CListGroupItem>
            <CTable responsive="sm" className="table table-striped mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Member Type</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                {contract?.contract_members?.map((member, index) => (
                  <tr key={index}>
                    <td>
                      {member?.member?.first_name ? <img width="23px" src={defaultAvatar} /> : null}
                      {member.member.first_name + ' ' + member.member.last_name || '-'}
                    </td>
                    <td className="text-capitalize">
                      {member.member_type.replace(/_/g, ' ') || '-'}
                    </td>
                    <td>{member.member.username || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </CTable>
          </CCard>
        </CCol>
      </CCard>
      <ContractDocuments />
      {for_moving_in ? (
        ''
      ) : (
        <CCard className="my-3 border-0">
          <Invoices after_submit={loadInitialContractData} contract={contract} />
        </CCard>
      )}
    </>
  )
}
