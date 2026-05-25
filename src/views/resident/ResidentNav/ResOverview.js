import { CCol, CCard, CListGroupItem, CRow, CCardText, CTooltip } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import useFetch from 'use-http'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import logo from '../../../assets/images/avatars/default.png'
import { formatdate } from 'src/services/CommonFunctions'
import { toast } from 'react-toastify'
import EditResidents from '../EditResidents'
import CheckPermissions from 'src/permissions/CheckPermissions'

const NOTES_PREVIEW_LENGTH = 40

function resolvePropertyName(contract) {
  const unit = contract?.unit
  const building = unit?.building

  return (
    building?.property_name ||
    building?.property?.name ||
    unit?.property?.name ||
    unit?.property_name ||
    contract?.property?.name ||
    contract?.property_name ||
    '-'
  )
}

function formatUnitLocation(contract) {
  const unit = contract?.unit
  const building = unit?.building
  const unitNo = unit?.unit_no ?? '-'
  const buildingName = building?.name ?? '-'
  const propertyName = resolvePropertyName(contract)
  return `${unitNo}, ${buildingName} (${propertyName})`
}

function formatContractType(contractType) {
  if (!contractType) {
    return '-'
  }
  return String(contractType).replace(/_/g, ' ')
}

function formatContractEndDate(endDate) {
  if (!endDate) {
    return 'Running'
  }
  return formatdate(endDate) || '-'
}

function ContractNotesCell({ notes }) {
  const text = notes?.trim() || '-'
  if (text === '-' || text.length <= NOTES_PREVIEW_LENGTH) {
    return <span>{text}</span>
  }

  const preview = `${text.slice(0, NOTES_PREVIEW_LENGTH)}...`

  return (
    <CTooltip content={text} placement="top" trigger={['hover', 'focus']}>
      <span
        className="d-inline-block text-truncate"
        style={{ maxWidth: '220px', cursor: 'default' }}
        tabIndex={0}
      >
        {preview}
      </span>
    </CTooltip>
  )
}

ContractNotesCell.propTypes = {
  notes: PropTypes.string,
}

export default function ResOverview() {
  const { residentId } = useParams()

  const [resident_data, setResident_data] = useState({})
  const [contracts, setContracts] = useState([])
  const { get, response } = useFetch()

  useEffect(() => {
    loadResident()
    loadContracts()
  }, [residentId])

  const loadResident = async () => {
    const api = await get(`/v1/admin/members/${residentId}`)
    if (response.ok) {
      setResident_data(api?.data ?? api)
    } else {
      toast(api?.message || response?.data?.message)
    }
  }

  async function loadContracts() {
    const api = await get(`/v1/admin/members/${residentId}/contracts`)
    if (response.ok) {
      const list = api?.data ?? api
      setContracts(Array.isArray(list) ? list : [])
    } else {
      setContracts([])
      toast(api?.message || response?.data?.message || 'Unable to load contracts.')
    }
  }

  return (
    <>
      <CRow className="bg-white mt-2 m-1 p-1 rounded-2 border-0">
        <CCol md="4" sm="6">
          <CCard className="p-5 my-3 border-0 text-center" style={{ backgroundColor: '#00bfcc' }}>
            <div className="">
              <img className="rounded-circle w-50 " src={resident_data.avatar || logo} />
            </div>
          </CCard>
        </CCol>
        <CCol className="col">
          <CCard className="px-3 py-1 my-3 border-0">
            <CListGroupItem>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <CIcon
                    icon={freeSet.cilLineStyle}
                    size="lg"
                    className="me-2"
                    style={{ color: '#00bfcc' }}
                  />
                  <strong>Resident Data</strong>
                </div>
                <div>
                  <CheckPermissions
                    component={<EditResidents id={residentId} />}
                    keys={['resident', 'update']}
                  />
                </div>
              </div>

              <hr className="text-secondary mt-1 p-0" />
            </CListGroupItem>
            <CRow className="">
              <CCol className="p-3 mt-0 fw-light theme_color">
                First Name
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.first_name || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Last Name
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.last_name || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Gender
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.gender || '-'}
                </CCardText>
              </CCol>
            </CRow>
            <CRow>
              <CCol className="p-3 mt-0 fw-light theme_color col-lg-3 col-sm-3">
                Email
                <CCardText
                  className="fw-normal text-nowrap"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.email || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color  col-lg-3 col-sm-3">
                Phone No.
                <CCardText
                  className="fw-normal text-nowrap"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.phone_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color  col-lg-3 col-sm-3">
                D.O.B.
                <CCardText
                  className="fw-normal "
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {formatdate(resident_data?.dob) || '-'}
                </CCardText>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
      </CRow>

      <CRow classname="g-3">
        <CCol md="8" sm="12">
          <CCard className="p-3 mb-3 border-0">
            <CListGroupItem>
              <CIcon
                icon={freeSet.cilLineStyle}
                size="lg"
                className="me-2"
                style={{ color: '#00bfcc' }}
              />
              <strong>Billing Info. </strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
          </CCard>
          <CCard className="p-3  mb-3 border-0 ">
            <CListGroupItem>
              <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
              <strong className="text-black">Contract Info.</strong>
              <hr className="text-secondary" />
            </CListGroupItem>
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th className="py-3 border-0">Unit / Building / Property</th>
                    <th className="py-3 border-0">Start date</th>
                    <th className="py-3 border-0">Contract type</th>
                    <th className="py-3 border-0">End date</th>
                    <th className="py-3 border-0">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.length >= 1 ? (
                    contracts.map((contract) => (
                      <tr key={contract.id}>
                        <td className="pt-3 text-capitalize">{formatUnitLocation(contract)}</td>
                        <td className="pt-3">{formatdate(contract.start_date) || '-'}</td>
                        <td className="pt-3 text-capitalize">
                          {formatContractType(contract.contract_type)}
                        </td>
                        <td className="pt-3">{formatContractEndDate(contract.end_date)}</td>
                        <td className="pt-3">
                          <ContractNotesCell notes={contract.notes} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center fst-italic py-4">
                        No Contracts Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CCard>
        </CCol>
        <CCol md="4">
          <CCard className="p-3 border-0 shadow-sm h-100">
            <CListGroupItem>
              <CIcon
                icon={freeSet.cilLineStyle}
                size="lg"
                className="me-2"
                style={{ color: '#00bfcc' }}
              />
              <strong>Resident Log</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            <CRow className="">
              <CCol className="p-2 px-2 mt-0 fw-light theme_color">
                ⊙ Last Changes
                <CCardText
                  className="fw-normal ps-3"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {formatdate(resident_data?.updated_at) || '-'}
                </CCardText>
                |
              </CCol>
            </CRow>

            <CRow>
              <CCol className="p-2 mt-0 px-2 fw-light theme_color">
                ⊙ Created On
                <CCardText
                  className="fw-normal ms-3"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {formatdate(resident_data?.created_at) || '-'}
                </CCardText>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
