import { CCol, CCard, CListGroupItem, CRow, CCardText, CContainer, CButton } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'

import { useParams, Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { formatdate } from 'src/services/CommonFunctions'
import EditProperty from '../EditProperty'
import DeleteProperty from '../DeleteProperty'
import defaultbuilding from 'src/assets/images/default-building.png'
import CheckPermissions from 'src/permissions/CheckPermissions'

export default function OverviewContent(propsd) {
  const { propertyId } = useParams()
  const [property, setProperty] = useState({})
  const [contract_info, setContract_info] = useState({})
  const [member_info, setMember_info] = useState([])

  const { get, response } = useFetch()

  useEffect(() => {
    getPropertyData()
  }, [])
  async function getPropertyData() {
    let api = await get(`/v1/admin/premises/properties/${propertyId}`)

    if (api.data && api.data.running_contracts) {
      setProperty(api.data)
      setContract_info(api.data.running_contracts[0])
      const contractMembers =
        api.data.running_contracts[0] && api.data.running_contracts[0].contract_members

      setMember_info(contractMembers || [])
    } else {
    }

    if (response.ok) {
      setProperty(api.data)
    }
  }
  const handleDelete = async () => {}

  return (
    <>
      <CContainer fluid>
        <CRow>
          <CCol className="mt-3" md="4">
            <CCard
              className=" shadow-lg border-0 rounded-2 mb-4  p-0 my-3 "
              style={{ backgroundColor: '#00bfcc' }}
            >
              <div className="d-flex align-items-center justify-content-center">
                <img
                  style={{
                    width: '100%',
                    height: '233px',
                    borderRadius: '4px',
                    display: 'block',
                    margin: '0 auto',
                    objectFit: 'cover',
                  }}
                  src={property.photo || defaultbuilding}
                />
              </div>
            </CCard>
          </CCol>
          <CCol className="mt-3" md="8">
            <CCard className=" p-3 my-3 mb-3   border-0 theme_color">
              <CListGroupItem>
                <div className="d-flex justify-content-between">
                  <div>
                    <CIcon icon={freeSet.cilLineStyle} size="lg" className="me-2" />
                    <strong className="text-black">Overview</strong>
                  </div>
                  <div className="d-flex justify-content-end mb-2">
                    <CheckPermissions
                      component={
                        <>
                          <EditProperty propertyId={propertyId} />
                          <DeleteProperty propertyId={propertyId} />
                        </>
                      }
                      keys={['property', 'manage']}
                    />
                  </div>
                </div>
                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow className="">
                <CCol className="p-2 mt-0 fw-light">
                  Name
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.name || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  City
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.city || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Use Type
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.use_type || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Payment Term
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.payment_term?.replace('_', ' ') || '-'}
                  </CCardText>
                </CCol>
              </CRow>
              <CRow>
                <CCol className="p-2 mt-0 fw-light">
                  Overdue Days
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.invoice_overdue_days || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Invoice No Prefix
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.invoice_no_prefix || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Invoice Day
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.invoice_day || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Created At
                  <CCardText className="fw-normal text-black text-capitalize">
                    {formatdate(property?.created_at)}
                  </CCardText>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
        {/*Contact & Communication*/}
        <CRow>
          <CCol md="12">
            <CCard className=" p-3 my-3 mt-2 border-0 theme_color">
              <CListGroupItem>
                <CIcon icon={freeSet.cilContact} size="lg" className="me-2 theme_color" />
                <strong className="text-black">Contact & Communication</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow className="">
                <CCol className="p-2 mt-0 fw-light">
                  Email
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.email || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Phone
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.phone || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  website
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.website || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Address
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.address || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  State
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.state || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  PIN Code
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.pin_code || '-'}
                  </CCardText>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>

        {/* Financial & Banking */}
        <CRow>
          <CCol md="12">
            <CCard className=" p-3 my-3 mt-2 border-0 theme_color">
              <CListGroupItem>
                <CIcon icon={freeSet.cilWallet} size="lg" className="me-2 theme_color" />
                <strong className="text-black">Financial & Banking</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow className="">
                <CCol className="p-2 mt-0 fw-light">
                  Bank_Name
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.bank_name || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Bank Account No
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.bank_account_no || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Bank IFSC Code
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.bank_ifsc_code || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Bank Branch
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.bank_branch || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  PAN Number
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.pan_no || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  GST Number
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.gst_no || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  TAN Number
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.tan_no || '-'}
                  </CCardText>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>

        {/* Property & Infrastructure */}
        <CRow>
          <CCol md="12">
            <CCard className=" p-3 my-3 mt-2 border-0 theme_color">
              <CListGroupItem>
                <CIcon icon={freeSet.cilBuilding} size="lg" className="me-2 theme_color" />
                <strong className="text-black">Property & Infrastructure</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow className="">
                <CCol className="p-2 mt-0 fw-light">
                  Total Area
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.total_area || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Area Unit
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.area_unit || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Unit Count
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.units_count || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Amenities count
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.amenities_count || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Maintenancestaff Count
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.maintenance_staff_count || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Year Built
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.year_built || '-'}
                  </CCardText>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>

        {/* Management & Governance */}
        <CRow>
          <CCol md="12">
            <CCard className=" p-3 my-3 mt-2 border-0 theme_color">
              <CListGroupItem>
                <CIcon icon={freeSet.cilSettings} size="lg" className="me-2 theme_color" />
                <strong className="text-black">Management & Governance</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow className="">
                <CCol className="p-2 mt-0 fw-light">
                  Managed By
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.managed_by || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Association Registration No
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.association_registration_no || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Association Type
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.association_type || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Committee Formation Date
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.committee_formation_date || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Next AGM Date
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.next_agm_date || '-'}
                  </CCardText>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>

        {/* Notification & Preferences */}
        <CRow>
          <CCol md="12">
            <CCard className=" p-3 my-3 mt-2 border-0 theme_color">
              <CListGroupItem>
                <CIcon icon={freeSet.cilBell} size="lg" className="me-2 theme_color" />
                <strong className="text-black">Notification & Preferences</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow className="">
                <CCol className="p-2 mt-0 fw-light">
                  Notification Email
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.notification_email || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Notification Phone
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.notification_phone || '-'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Auto Invoice Enabled
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.auto_invoice_enabled ? 'Yes' : 'No'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Auto Reminder Enabled
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.auto_reminder_enabled ? 'Yes' : 'No'}
                  </CCardText>
                </CCol>
                <CCol className="p-2 mt-0 fw-light">
                  Reminder Days Before Due
                  <CCardText className="fw-normal text-black text-capitalize">
                    {property?.reminder_days_before_due || '-'}
                  </CCardText>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>

        {/*Branding & Documents*/}
        <CRow>
          <CCol md="12">
            <CCard className=" p-3 my-3 mt-2 border-0 theme_color">
              <CListGroupItem>
                <CIcon icon={freeSet.cilDescription} size="lg" className="me-2 theme_color" />
                <strong className="text-black">Branding & Documents</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow className="p-2">
                <CCol className="p-2 mt-0 fw-light d-flex flex-column align-items-center">
                  Logo
                  <img
                    className="fw-normal text-black text-capitalize"
                    src={property.photo || defaultbuilding}
                    alt="Logo"
                    style={{ width: '100px', height: '100px', objectFit: 'circle' }}
                  />
                </CCol>
                <CCol className="p-2 mt-0 fw-light d-flex flex-column align-items-center">
                  Signature Image
                  {property?.signature_image ? (
                    <img
                      className="fw-normal text-black text-capitalize"
                      src={property.signature_image}
                      alt="Signature"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <span className="text-muted">No Image Found</span>
                  )}
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}
