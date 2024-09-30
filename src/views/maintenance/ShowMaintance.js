import { CCol, CCard, CListGroupItem, CRow, CCardText, CCardBody, CButton } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'

import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import MaintenanceComments from './Components/MaintenanceComments'

export default function ShowMaintance() {
  const { maintenanceid } = useParams()

  const [data, setData] = useState({})
  const [loading, setLoading] = useState({})
  const { get, response } = useFetch()

  useEffect(() => {
    showMaintanceRequests()
  }, [])
  async function showMaintanceRequests() {
    let api = await get(`/v1/admin/maintenance/requests/${maintenanceid}`)
    if (response.ok) {
      setData(api.data)
    }
  }

  return (
    <>
      <b>Overview </b>
      <CRow>
        <CCol md="4">
          <CCard className=" p-3 my-3 border-0 theme_color">
            <div className="d-flex w-100 ">
              <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2" />
              <strong className="text-black">Property Details</strong>
            </div>

            <hr className="text-secondary" />
            <CRow className="">
              <CCol className="p-3 mt-0 fw-light">
                Property
                <CCardText className="fw-normal text-black text-capitalize">
                  {data?.property?.name || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light">
                Unit No.
                <CCardText className="fw-normal text-black text-capitalize">
                  {data?.year_built || '-'}
                </CCardText>
              </CCol>
            </CRow>

            <CRow className="">
              <CCol className="p-3 mt-0 fw-light">
                Tenant
                <CCardText className="fw-normal text-black text-capitalize">
                  {data?.data_type?.name || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light">
                Owner
                <CCardText className="fw-normal text-black text-capitalize">
                  {data?.data_type?.use_type || '-'}
                </CCardText>
              </CCol>
            </CRow>
            <CRow className="">
              <CCol className="p-3 mt-0 fw-light">
                Available Date
                <CCardText className="fw-normal text-black text-capitalize">
                  {data?.data_type?.description || '-'}
                </CCardText>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
        <CCol md="8">
          <CCard className=" p-3  my-3 border-0 theme_color">
            <div className="d-flex w-100 ">
              <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2" />
              <strong className="text-black">Request Details</strong>
            </div>

            <hr className="text-secondary" />
            <CRow className="">
              <CCol className="p-3 mt-0 fw-light">
                Title
                <CCardText className="fw-normal text-black text-capitalize">
                  {data?.title || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light">
                Description
                <CCardText className="fw-normal text-black text-capitalize">
                  {data?.description || '-'}
                </CCardText>
              </CCol>
            </CRow>

            <CRow className="">
              <CCol className="p-3 mt-0 fw-light">
                Category
                <CCardText className="fw-normal text-black text-capitalize">
                  {data?.category?.name || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light">
                Status
                <CCardText className="fw-normal text-black text-capitalize">
                  {data?.status || '-'}
                </CCardText>
              </CCol>
            </CRow>
            <CRow className="">
              <CCol className="p-3 mt-0 fw-light">
                Assigned User
                <CCardText className="fw-normal text-black text-capitalize">
                  {data?.assigned_user || '-'}
                </CCardText>
              </CCol>
            </CRow>
          </CCard>
        </CCol>

        <CCol md="4">
          <CCard className=" p-3 my-2 border-0 theme_color">
            <div className="d-flex w-100 ">
              <CIcon icon={freeSet.cilLibrary} size="lg" className="me-2" />
              <strong className="text-black">Ticket Log</strong>
            </div>

            <hr className="text-secondary" />
            <CRow className="">
              <CCol className="p-3 mt-0 fw-light">
                Created By
                <CCardText className="fw-normal text-black text-capitalize">
                  {data?.property?.name || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light">
                Assigned By
                <CCardText className="fw-normal text-black text-capitalize">
                  {data?.year_built || '-'}
                </CCardText>
              </CCol>
            </CRow>

            <CRow className="">
              <CCol className="p-3 mt-0 fw-light">
                Closed By
                <CCardText className="fw-normal text-black text-capitalize">
                  {data?.data_type?.name || '-'}
                </CCardText>
              </CCol>
            </CRow>
          </CCard>
        </CCol>

        <CCol md="8">
          <MaintenanceComments />
        </CCol>
      </CRow>
    </>
  )
}
