import { CCol, CCard, CListGroupItem, CRow, CTooltip } from '@coreui/react'
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

function ResidentDataField({ label, value, valueClassName = '' }) {
  return (
    <div className="h-100 d-flex flex-column">
      <div className="small theme_color text-uppercase mb-1" style={{ letterSpacing: '0.02em' }}>
        {label}
      </div>
      <div className={`fw-normal text-black mb-0 ${valueClassName}`}>{value || '-'}</div>
    </div>
  )
}

ResidentDataField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueClassName: PropTypes.string,
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

              <hr className="text-secondary mt-1 mb-2 p-0" />
            </CListGroupItem>
            <div className="px-2 pb-3">
              <CRow className="g-3">
                <CCol xs={6} md={4}>
                  <ResidentDataField
                    label="First Name"
                    value={resident_data?.first_name}
                    valueClassName="text-capitalize"
                  />
                </CCol>
                <CCol xs={6} md={4}>
                  <ResidentDataField
                    label="Last Name"
                    value={resident_data?.last_name}
                    valueClassName="text-capitalize"
                  />
                </CCol>
                <CCol xs={6} md={4}>
                  <ResidentDataField
                    label="Gender"
                    value={resident_data?.gender}
                    valueClassName="text-capitalize"
                  />
                </CCol>
                <CCol xs={12} md={4}>
                  <ResidentDataField label="Email" value={resident_data?.email} />
                </CCol>
                <CCol xs={6} md={4}>
                  <ResidentDataField label="Phone No." value={resident_data?.phone_number} />
                </CCol>
                <CCol xs={6} md={4}>
                  <ResidentDataField label="D.O.B." value={formatdate(resident_data?.dob)} />
                </CCol>
              </CRow>
            </div>
          </CCard>
        </CCol>
      </CRow>

      <CRow classname="g-3">
        <CCol md="8" sm="12">
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
            <div className="px-2 pb-3">
              <CRow className="g-3">
                <CCol xs={12}>
                  <ResidentDataField
                    label="Last Changes"
                    value={formatdate(resident_data?.updated_at)}
                  />
                </CCol>
                <CCol xs={12}>
                  <ResidentDataField
                    label="Created On"
                    value={formatdate(resident_data?.created_at)}
                  />
                </CCol>
              </CRow>
            </div>
          </CCard>
        </CCol>
      </CRow>

      <CRow classname="g-3 mt-3">
        <CCol md="4">
          <CCard className="p-3 border-0 shadow-sm">
            <CListGroupItem>
              <CIcon
                icon={freeSet.cilLineStyle}
                size="lg"
                className="me-2"
                style={{ color: '#00bfcc' }}
              />
              <strong>Identity Document</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            <div className="px-2 pb-3">
              <CRow className="g-3">
                <CCol xs={12}>
                  <ResidentDataField label="ID Type" value={resident_data?.id_type} />
                </CCol>
                <CCol xs={12}>
                  <ResidentDataField label="ID Number" value={resident_data?.id_number} />
                </CCol>
              </CRow>
            </div>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
