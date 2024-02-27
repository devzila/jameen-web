import React, { useState, useEffect } from 'react'
import { CCol, CCard, CListGroupItem, CCardImage, CRow, CCardText, CImage } from '@coreui/react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import logo from '../../../assets/images/avatars/default.png'

export default function Buildings() {
  const [buildings, setBuildings] = useState([])
  const { get } = useFetch()
  const { propertyId } = useParams()

  useEffect(() => {
    fetchBuildings()
  }, [propertyId])

  async function fetchBuildings() {
    try {
      const buildingsData = await get(`/v1/admin/premises/properties/${propertyId}/buildings`)
      console.log(buildingsData)
      if (buildingsData && buildingsData.data) {
        setBuildings(buildingsData.data[0])
      }
    } catch (error) {
      console.error('Error fetching billable items:', error)
    }
  }


  return (
    <>
      <CRow>
        <CCol md="4">
          <CCard className=" p-5  m-3 border-0  " style={{ backgroundColor: '#00bfcc' }}>
            <div className="d-flex align-items-center justify-content-center h-100 ">
              <img className="rounded-circle w-50 " src={buildings.avatar || logo} />
            </div>
          </CCard>
        </CCol>
        <CCol md="8">
          <CCard className=" p-5 my-3 me-3" style={{ border: '0px' }}>
            <CListGroupItem>
              <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2 theme_color" />
              <strong>buildings</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            <CRow className="">
              <CCol className="p-3 mt-0 fw-light theme_color">
                Id
                <CCardText className="fw-normal text-black">{buildings?.id || '-'}</CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Name
                <CCardText className="fw-normal text-black">{buildings?.name || '-'}</CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Description
                <CCardText className="fw-normal text-black">
                  {buildings?.description || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Created At
                <CCardText className="fw-normal text-black">
                  {buildings?.created_at || '-'}
                </CCardText>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
