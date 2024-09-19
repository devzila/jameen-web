import { CCol, CCard, CListGroupItem, CRow, CCardText, CImage } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import logo from '../../../assets/images/avatars/default.png'
import { formatdate } from 'src/services/CommonFunctions'
import { toast } from 'react-toastify'

export default function ResOverview() {
  const { residentId } = useParams()

  const [resident_data, setResident_data] = useState({})
  const { get, response } = useFetch()

  useEffect(() => {
    loadResident()
  }, [])
  const loadResident = async () => {
    const endpoint = await get(`/v1/admin/members/${residentId}`)
    if (response.ok) {
      setResident_data(endpoint.data)
    } else {
      toast(response?.data.message)
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
          <CCard className="p-3  my-3 border-0">
            <CListGroupItem>
              <CIcon
                icon={freeSet.cilLineStyle}
                size="lg"
                className="me-2"
                style={{ color: '#00bfcc' }}
              />
              <strong>Resident Data</strong>
              <hr style={{ color: '#C8C2C0' }} />
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
              <CCol className="p-3 mt-0 fw-light theme_color">
                Username
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.username || '-'}
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
              <CCol className="p-3 mt-0 fw-light theme_color text-nowrap col-lg-3 col-sm-6">
                Phone No.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.phone_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color  col-lg-3 col-sm-6">
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

      <CRow>
        <CCol md="2" sm="12">
          <CCard className="p-3 my-3 border-0">
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
        <CCol md="10" sm="12">
          <CCard className=" p-3 my-3 border-0">
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
            <CRow className="">
              <CCol className="p-3 mt-0 fw-light theme_color">
                VAT No.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.property?.vat_no || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Invoice Prefix
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.property?.invoice_no_prefix || '-'}
                </CCardText>
              </CCol>

              <CCol className="p-3 mt-0 fw-light theme_color">
                Email
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.email || '-'}
                </CCardText>
              </CCol>
            </CRow>
            <CRow>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Username
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.username || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Phone No.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.phone_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                D.O.B.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {formatdate(resident_data?.dob) || '-'}
                </CCardText>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol md="12" sm="12">
          <CCard className=" p-3 my-3 border-0">
            <CListGroupItem>
              <CIcon
                icon={freeSet.cilLineStyle}
                size="lg"
                className="me-2"
                style={{ color: '#00bfcc' }}
              />
              <strong>Property Info.</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            <CRow className="">
              <CCol className="p-3 mt-0 fw-light theme_color">
                Name
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.property?.name || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                City
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.property?.city || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Address
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.property?.address || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Use Type
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.property?.use_type || '-'}
                </CCardText>
              </CCol>
            </CRow>
            <CRow></CRow>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol md="12">
          <CCard className=" p-3 my-3 border-0">
            <CListGroupItem>
              <CIcon
                icon={freeSet.cilLineStyle}
                size="lg"
                className="me-2"
                style={{ color: '#00bfcc' }}
              />
              <strong>Invoice</strong>
              <hr style={{ color: '#C8C2C0' }} />
            </CListGroupItem>
            <CRow className="">
              <CCol className="p-3 mt-0 fw-light theme_color">
                Electricity Account No.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.electricity_account_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Water Account No.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.water_account_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Internal Extension No.
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.internal_extension_number || '-'}
                </CCardText>
              </CCol>
              <CCol className="p-3 mt-0 fw-light theme_color">
                Last Status Changed
                <CCardText
                  className="fw-normal"
                  style={{ color: 'black', textTransform: 'capitalize' }}
                >
                  {resident_data?.year_built || '-'}
                </CCardText>
              </CCol>
            </CRow>
            <CRow></CRow>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
