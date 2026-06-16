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

  const cardStyle = {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,.05)',
  }

  const badgeStyle = {
    background: '#eef2ff',
    color: '#2563eb',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 600,
  }

  const heroStyle = {
    borderRadius: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,.05)',
    padding: '30px',
    gap: '20px',
    backgroundColor: '#fff',
    ...(property?.photo
      ? {
          backgroundImage: `linear-gradient(to right, #ffffff 22%, rgba(255,255,255,0.75) 48%, rgba(255,255,255,0.15) 100%), url(${property.photo})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right',
          backgroundSize: 'cover',
        }
      : {}),
  }

  const propertyStats = property?.property_stats || {}
  const pendingDuesAmount = Number(propertyStats?.pending_dues?.amount ?? 0)

  const stats = [
    { label: 'Total Units', value: propertyStats?.unit_count ?? 0 },
    { label: 'Occupied Units', value: propertyStats?.occupied_unit_count ?? 0 },
    {
      label: 'Pending Dues',
      value: `₹${pendingDuesAmount.toLocaleString('en-IN')}`,
    },
    {
      label: 'Open Complaints',
      value: propertyStats?.maintenance_requests?.open_count ?? 0,
    },
  ]

  const health = [
    { label: 'Occupancy Rate', value: `${propertyStats?.occupancy_rate ?? 0}%` },
    { label: 'Vacant Units', value: propertyStats?.vacant_unit_count ?? 0 },
    { label: 'Unallotted Units', value: propertyStats?.unallotted_unit_count ?? 0 },
    {
      label: 'Maintenance Tasks',
      value: propertyStats?.maintenance_requests?.open_count ?? 0,
    },
  ]

  return (
    <>
      <CContainer fluid>
        {/* HERO */}
        <div
          className="mt-3 d-flex justify-content-between align-items-center flex-wrap"
          style={heroStyle}
        >
          <div className="property-info">
            <h1 style={{ fontSize: '32px', marginBottom: '10px' }} className="text-capitalize">
              {property?.name || '-'}
            </h1>
            <div style={{ color: '#6b7280', marginBottom: '12px' }}>
              📍 {property?.city || 'Location not set'} • Created {formatdate(property?.created_at)}
            </div>
            <div className="d-flex flex-wrap" style={{ gap: '10px' }}>
              {property?.use_type && (
                <span style={badgeStyle} className="text-capitalize">
                  {property.use_type}
                </span>
              )}
              {property?.payment_term && (
                <span style={badgeStyle} className="text-capitalize">
                  {property.payment_term.replace(/_/g, ' ')} Billing
                </span>
              )}
            </div>
          </div>

          <div className="d-flex align-items-center" style={{ gap: '10px' }}>
            <CheckPermissions
              component={
                <>
                  <EditProperty propertyId={propertyId} after_submit={getPropertyData} />
                  <DeleteProperty propertyId={propertyId} />
                </>
              }
              keys={['property', 'manage']}
            />
          </div>
        </div>

        {/* KPI STATS */}
        <div
          className="mt-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
          }}
        >
          {stats.map((stat) => (
            <div key={stat.label} style={{ ...cardStyle, padding: '24px' }}>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>{stat.label}</div>
              <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
        {/* DETAILS + PROPERTY HEALTH */}
        <CRow className="mt-3 gx-3">
          {/* LEFT COLUMN (~70%) */}
          <CCol xs={12} lg={8}>
            {/*Contact & Communication*/}
            <CRow>
              <CCol md="12">
                <CCard className="p-3 border-0 theme_color" style={{ borderRadius: '16px' }}>
                  <CListGroupItem>
                    <CIcon icon={freeSet.cilContact} size="lg" className="me-2 theme_color" />
                    <strong className="text-black">Contact & Communication</strong>
                    <hr className="text-secondary" />
                  </CListGroupItem>
                  <CRow className="">
                    <CCol className="p-2 mt-0 field-label">
                      Email
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.email || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      Phone
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.phone || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      website
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.website || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      Address
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.address || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      State
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.state || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
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
            <CRow className="mt-3">
              <CCol md="12">
                <CCard className="p-3 border-0 theme_color" style={{ borderRadius: '16px' }}>
                  <CListGroupItem>
                    <CIcon icon={freeSet.cilWallet} size="lg" className="me-2 theme_color" />
                    <strong className="text-black">Financial & Banking</strong>
                    <hr className="text-secondary" />
                  </CListGroupItem>
                  <CRow className="">
                    <CCol className="p-2 mt-0 field-label">
                      Bank_Name
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.bank_name || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      Bank Account No
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.bank_account_no || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      Bank IFSC Code
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.bank_ifsc_code || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      Bank Branch
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.bank_branch || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      PAN Number
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.pan_no || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      GST Number
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.gst_no || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
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
            <CRow className="mt-3">
              <CCol md="12">
                <CCard className="p-3 border-0 theme_color" style={{ borderRadius: '16px' }}>
                  <CListGroupItem>
                    <CIcon icon={freeSet.cilBuilding} size="lg" className="me-2 theme_color" />
                    <strong className="text-black">Property & Infrastructure</strong>
                    <hr className="text-secondary" />
                  </CListGroupItem>
                  <CRow className="">
                    <CCol className="p-2 mt-0 field-label">
                      Total Area
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.total_area || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      Area Unit
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.area_unit || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      Unit Count
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.units_count || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      Amenities count
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.amenities_count || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      Maintenancestaff Count
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.maintenance_staff_count || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
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
            <CRow className="mt-3">
              <CCol md="12">
                <CCard className="p-3 border-0 theme_color" style={{ borderRadius: '16px' }}>
                  <CListGroupItem>
                    <CIcon icon={freeSet.cilSettings} size="lg" className="me-2 theme_color" />
                    <strong className="text-black">Management & Governance</strong>
                    <hr className="text-secondary" />
                  </CListGroupItem>
                  <CRow className="">
                    <CCol className="p-2 mt-0 field-label">
                      Managed By
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.managed_by || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      Association Registration No
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.association_registration_no || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      Association Type
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.association_type || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      Committee Formation Date
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.committee_formation_date || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
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
            <CRow className="mt-3">
              <CCol md="12">
                <CCard className="p-3 border-0 theme_color" style={{ borderRadius: '16px' }}>
                  <CListGroupItem>
                    <CIcon icon={freeSet.cilBell} size="lg" className="me-2 theme_color" />
                    <strong className="text-black">Notification & Preferences</strong>
                    <hr className="text-secondary" />
                  </CListGroupItem>
                  <CRow className="">
                    <CCol className="p-2 mt-0 field-label">
                      Notification Email
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.notification_email || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      Notification Phone
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.notification_phone || '-'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      Auto Invoice Enabled
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.auto_invoice_enabled ? 'Yes' : 'No'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
                      Auto Reminder Enabled
                      <CCardText className="fw-normal text-black text-capitalize">
                        {property?.auto_reminder_enabled ? 'Yes' : 'No'}
                      </CCardText>
                    </CCol>
                    <CCol className="p-2 mt-0 field-label">
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
            <CRow className="mt-3">
              <CCol md="12">
                <CCard className="p-3 border-0 theme_color" style={{ borderRadius: '16px' }}>
                  <CListGroupItem>
                    <CIcon icon={freeSet.cilDescription} size="lg" className="me-2 theme_color" />
                    <strong className="text-black">Branding & Documents</strong>
                    <hr className="text-secondary" />
                  </CListGroupItem>
                  <CRow className="p-2">
                    <CCol className="p-2 mt-0 field-label d-flex flex-column align-items-center">
                      Logo
                      <img
                        className="fw-normal text-black text-capitalize"
                        src={property.photo || defaultbuilding}
                        alt="Logo"
                        style={{ width: '100px', height: '100px', objectFit: 'circle' }}
                      />
                    </CCol>
                    <CCol className="p-2 mt-0 field-label d-flex flex-column align-items-center">
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
          </CCol>

          {/* RIGHT COLUMN (~30%) - Property Health */}
          <CCol xs={12} lg={4} className="mt-3 mt-lg-0">
            <CCard className="p-3 border-0 theme_color" style={{ borderRadius: '16px' }}>
              <CListGroupItem>
                <CIcon icon={freeSet.cilHeart} size="lg" className="me-2 theme_color" />
                <strong className="text-black">Property Health</strong>
                <hr className="text-secondary" />
              </CListGroupItem>
              <CRow className="g-3 p-2">
                {health.map((item) => (
                  <CCol xs={6} key={item.label}>
                    <div
                      style={{
                        background: '#f8fafc',
                        padding: '18px',
                        borderRadius: '12px',
                        height: '100%',
                      }}
                    >
                      <div style={{ color: '#6b7280', fontSize: '14px' }}>{item.label}</div>
                      <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '6px' }}>
                        {item.value}
                      </div>
                    </div>
                  </CCol>
                ))}
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}
