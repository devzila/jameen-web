import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import Select from 'react-select'
import PropTypes from 'prop-types'
import defaultbuilding from 'src/assets/images/default-building.png'

import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
} from '@coreui/react'
import { Button, Form, Row, Col } from 'react-bootstrap'
export default function EditProperty(props) {
  const [property, setProperty] = useState({})
  const [useTypeOptions, setUseTypeOptions] = useState([])
  const [paymentTermOptions, setPaymentTermOptions] = useState([])
  const [imageView, setImageView] = useState('')
  const { get, put, response } = useFetch()
  const { propertyId } = props
  const [visible, setVisible] = useState(false)
  const { register, handleSubmit, setValue, control } = useForm()

  const handleFileSelection = (e) => {
    const selectedFile = e.target.files[0]

    if (selectedFile) {
      const reader = new FileReader()

      reader.onload = function (e) {
        const base64Result = e.target.result
        setImageView(base64Result)
      }

      reader.readAsDataURL(selectedFile)
    }
  }

  useEffect(() => {
    fetchProperties()
    loadproperty()
  }, [])

  async function fetchProperties() {
    const api = await get('/v1/admin/options')

    if (response.ok) {
      const propertyUseTypesOptions = Object.entries(api.property_use_types).map((element) => ({
        value: element[0],
        label: element[0],
      }))

      const propertyPaymentTermsOptions = Object.entries(api.property_payment_terms).map(
        ([key, value]) => ({
          value: key,
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        }),
      )
      setPaymentTermOptions(propertyPaymentTermsOptions)
      setUseTypeOptions(propertyUseTypesOptions)
    }
  }

  // Fetch property data
  const loadproperty = async () => {
    const endpoint = await get(`/v1/admin/premises/properties/${propertyId}`)
    if (response.ok) {
      setValue('name', endpoint.data.name)
      setValue('city', endpoint.data.city)
      setValue('use_type', endpoint.data.use_type)
      setValue('unit_counts', endpoint.data.unit_counts)
      setValue('email', endpoint.data.email)
      setValue('phone', endpoint.data.phone)
      setValue('website', endpoint.data.website)
      setValue('address', endpoint.data.address)
      setValue('bank_name', endpoint.data.bank_name)
      setValue('bank_account_no', endpoint.data.bank_account_no)
      setValue('bank_ifsc_code', endpoint.data.bank_ifsc_code)
      setValue('bank_branch', endpoint.data.bank_branch)
      setValue('pan_no', endpoint.data.pan_no)
      setValue('gst_no', endpoint.data.gst_no)
      setValue('tan_no', endpoint.data.tan_no)
      setValue('total_area', endpoint.data.total_area)
      setValue('area_unit', endpoint.data.area_unit)
      setValue('units_count', endpoint.data.units_count)
      setValue('amenities_count', endpoint.data.amenities_count)
      setValue('maintenance_staff_count', endpoint.data.maintenance_staff_count)
      setValue('year_built', endpoint.data.year_built)
      setValue('managed_by', endpoint.data.managed_by)
      setValue('association_registration_no', endpoint.data.association_registration_no)
      setValue('association_type', endpoint.data.association_type)
      setValue('committee_formation_date', endpoint.data.committee_formation_date)
      setValue('next_agm_date', endpoint.data.next_agm_date)
      setValue('notification_email', endpoint.data.notification_email)
      setValue('notification_phone', endpoint.data.notification_phone)
      setValue('state', endpoint.data.state)
      setValue('pin_code', endpoint.data.pin_code)
      setValue('auto_invoice_enabled', endpoint.data.auto_invoice_enabled)
      setValue('auto_reminder_enabled', endpoint.data.auto_reminder_enabled)
      setValue('reminder_days_before_due', endpoint.data.reminder_days_before_due)
      setProperty(endpoint.data)
    } else {
      toast.error(response.data?.message)
    }
  }

  const onSubmit = async (data) => {
    const body = { ...data, photo: { data: imageView } }

    const endpoint = await put(`/v1/admin/premises/properties/${propertyId}`, { property: body })

    if (response.ok) {
      toast('Property Data Edited Successfully')
      setVisible(false)
    } else {
      toast(response?.error)
    }
  }

  return (
    <>
      <div>
        <button
          type="button"
          className="btn custom_theme_button d-flex"
          data-mdb-ripple-init
          onClick={() => setVisible(!visible)}
        >
          Edit
        </button>
        <CModal
          alignment="center"
          size="xl"
          visible={visible}
          backdrop="static"
          onClose={() => setVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="StaticBackdropExampleLabel">Edit Property</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <Row>
                <div className="col text-center">
                  <img
                    alt="Avatar Image"
                    style={{
                      width: '300px',
                      height: '300px',

                      marginTop: '2%',
                      marginLeft: '4%',
                      borderRadius: '50%',
                    }}
                    title="Avatar"
                    className="img-circle img-thumbnail isTooltip  "
                    src={property.photo ? property.photo : imageView ? imageView : defaultbuilding}
                    data-original-title="Usuario"
                  />
                </div>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Avatar Image</label>
                    <Form.Control
                      wr
                      d
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      {...register('photo')}
                      onChange={(e) => handleFileSelection(e)}
                      className="border-0"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col className="pr-1 mt-3" md="6">
                      <Form.Group>
                        <label>Name</label>
                        <Form.Control
                          placeholder="Property Name"
                          type="text"
                          {...register('name')}
                        />
                      </Form.Group>
                    </Col>
                    <Col className="pr-1 mt-3" md="6">
                      <Form.Group>
                        <label>City</label>
                        <Form.Control placeholder="City" type="text" {...register('city')} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1 mt-3" md="6">
                      <Form.Group>
                        <label>Use Type</label>
                        <Controller
                          name="use_type"
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={useTypeOptions}
                              value={useTypeOptions.find((c) => c.value === field.value)}
                              onChange={(val) => field.onChange(val.value)}
                            />
                          )}
                          control={control}
                          placeholder="use Type"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1 mt-3" md="12">
                      <Form.Group>
                        <label>Payment Term</label>
                        <Controller
                          name="payment_term"
                          render={({ field }) => (
                            <Select
                              classNamePrefix="react-select"
                              {...field}
                              options={paymentTermOptions}
                              value={paymentTermOptions.find((c) => c.value === field.value)}
                              onChange={(val) => field.onChange(val.value)}
                            />
                          )}
                          control={control}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="border rounded p-3 mt-3">
                    <h5 className="mb-3">
                      <i className="bi bi-person-lines-fill text-dark me-2"></i>
                      Contract and Communication
                    </h5>
                    <Row>
                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Email</label>
                          <Form.Control placeholder="Email" type="email" {...register('email')} />
                        </Form.Group>
                      </Col>

                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Phone Number</label>
                          <Form.Control
                            placeholder="Phone Number"
                            type="text"
                            {...register('phone')}
                          />
                        </Form.Group>
                      </Col>

                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Website </label>
                          <Form.Control
                            placeholder="Website URL"
                            type="text"
                            {...register('website')}
                          />
                        </Form.Group>
                      </Col>

                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Address</label>
                          <Form.Control
                            placeholder="Address"
                            type="text"
                            {...register('address')}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>State</label>
                          <Form.Control placeholder="State" type="text" {...register('state')} />
                        </Form.Group>
                      </Col>
                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Pin Code</label>
                          <Form.Control
                            placeholder="pin_code"
                            type="text"
                            {...register('pin_code')}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                  {/* Financial & Banking */}
                  <div className="border rounded p-3 mt-3">
                    <h5 className="mb-3">
                      <i className="bi bi-bank2 text-dark me-2"></i>
                      Financial & Banking
                    </h5>
                    <Row>
                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Bank Name</label>
                          <Form.Control
                            placeholder="Bank Name"
                            type="text"
                            {...register('bank_name')}
                          />
                        </Form.Group>
                      </Col>

                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Bank Account Number </label>
                          <Form.Control
                            placeholder="Bank Account Number"
                            type="text"
                            {...register('bank_account_no')}
                          />
                        </Form.Group>
                      </Col>

                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Bank IFSC Code</label>
                          <Form.Control
                            placeholder="Bank IFSC Code"
                            type="text"
                            {...register('bank_ifsc_code')}
                          />
                        </Form.Group>
                      </Col>

                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Bank Branch</label>
                          <Form.Control
                            placeholder="Bank Branch"
                            type="text"
                            {...register('bank_branch')}
                          />
                        </Form.Group>
                      </Col>

                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>PAN Number</label>
                          <Form.Control
                            placeholder="PAN Number"
                            type="text"
                            {...register('pan_no')}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>GST Number</label>
                          <Form.Control
                            placeholder="GST Number"
                            type="text"
                            {...register('gst_no')}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>TAN Number</label>
                          <Form.Control
                            placeholder="TAN Number"
                            type="text"
                            {...register('tan_no')}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                  {/* Property & Infrastructure */}
                  <div className="border rounded p-3 mt-3">
                    <h5 className="mb-3">
                      <i className="bi bi-building-fill text-dark me-2"></i>
                      Property & Infrastructure
                    </h5>
                    <Row>
                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Total Area</label>
                          <Form.Control
                            placeholder="Total Area"
                            type="text"
                            {...register('total_area')}
                          />
                        </Form.Group>
                      </Col>

                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Area Unit </label>
                          <Form.Control
                            placeholder="Area Unit"
                            type="text"
                            {...register('area_unit')}
                          />
                        </Form.Group>
                      </Col>

                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Unit Count</label>
                          <Form.Control
                            placeholder="Unit Count"
                            type="text"
                            {...register('units_count')}
                          />
                        </Form.Group>
                      </Col>

                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Amenities count</label>
                          <Form.Control
                            placeholder="Amenities count"
                            type="text"
                            {...register('amenities_count')}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Maintenancestaff Count </label>
                          <Form.Control
                            placeholder="Maintenancestaff Count"
                            type="text"
                            {...register('maintenance_staff_count')}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Year Built</label>
                          <Form.Control
                            placeholder="Year Built"
                            type="text"
                            {...register('year_built')}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                  {/* Management & Governance */}
                  <div className="border rounded p-3 mt-3">
                    <h5 className="mb-3">
                      <i className="bi bi-people-fill text-dark me-2"></i>
                      Management & Governance
                    </h5>
                    <Row>
                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Managed By</label>
                          <Form.Control
                            placeholder="Managed By"
                            type="text"
                            {...register('managed_by')}
                          />
                        </Form.Group>
                      </Col>

                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Association Registration Number</label>
                          <Form.Control
                            placeholder="Association Registration Number"
                            type="text"
                            {...register('association_registration_no')}
                          />
                        </Form.Group>
                      </Col>

                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Association Type</label>
                          <Form.Control
                            placeholder="Association Type"
                            type="text"
                            {...register('association_type')}
                          />
                        </Form.Group>
                      </Col>

                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Committee Formation Date</label>
                          <Form.Control
                            placeholder="Committee Formation Date"
                            type="text"
                            {...register('committee_formation_date')}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Next AGM Date </label>
                          <Form.Control
                            placeholder="Next AGM Date"
                            type="text"
                            {...register('next_agm_date')}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                  {/* Notification & Preferences */}
                  <div className="border rounded p-3 mt-3">
                    <h5 className="mb-3">
                      <i className="bi bi-bell-fill text-dark me-2"></i>
                      Notification & Preferences
                    </h5>
                    <Row>
                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Notification Email</label>
                          <Form.Control
                            placeholder="Notification Email"
                            type="email"
                            {...register('notification_email')}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Notification Number</label>
                          <Form.Control
                            placeholder="Notification Number"
                            type="text"
                            {...register('notification_phone')}
                          />
                        </Form.Group>
                      </Col>

                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Auto Invoice Enabled</label>
                          <Form.Control
                            placeholder="Auto Invoice Enabled"
                            type="text"
                            {...register('auto_invoice_enabled')}
                          />
                        </Form.Group>
                      </Col>

                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Auto Reminder Enabled</label>
                          <Form.Control
                            placeholder="Auto Reminder Enabled"
                            type="text"
                            {...register('auto_reminder_enabled')}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="pr-1 mt-3" md="6">
                        <Form.Group>
                          <label>Reminder Days Before Due</label>
                          <Form.Control
                            placeholder="Reminder Days Before Due"
                            type="text"
                            {...register('reminder_days_before_due')}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                  {/* Branding & Documents */}
                  <div className="border rounded p-3 mt-3">
                    <h5 className="mb-3">
                      <i className="bi bi-file-earmark-text-fill text-dark me-2"></i>
                      Branding & Documents
                    </h5>
                    <Row>
                      <Col md="6" className="text-center">
                        <img
                          alt="Logo"
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1px solid #ddd',
                          }}
                          className="img-circle img-thumbnail"
                          src={
                            property.photo
                              ? property.photo
                              : imageView
                              ? imageView
                              : defaultbuilding
                          }
                        />
                        <Form.Group className="mt-3">
                          <label>Logo Image</label>
                          <Form.Control
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            {...register('photo')}
                            onChange={(e) => handleFileSelection(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md="6" className="text-center">
                        <img
                          alt="Signature Logo"
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1px solid #ddd',
                          }}
                          className="img-circle img-thumbnail"
                          src={
                            property.signature_image
                              ? property.signature_image
                              : imageView
                              ? imageView
                              : defaultbuilding
                          }
                        />
                        <Form.Group className="mt-3">
                          <label>Signature Image</label>
                          <Form.Control
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            {...register('singature_image')}
                            onChange={(e) => handleFileSelection(e)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  <div className="text-center">
                    <CModalFooter>
                      <Button
                        data-mdb-ripple-init
                        type="submit"
                        className="btn  custom_theme_button"
                      >
                        Submit
                      </Button>
                      <CButton
                        className="custom_grey_button"
                        color="light "
                        onClick={() => setVisible(false)}
                      >
                        Close
                      </CButton>
                    </CModalFooter>
                  </div>
                  <div className="clearfix"></div>
                </Form>
              </Row>
            </CContainer>
          </CModalBody>
        </CModal>
      </div>
    </>
  )
}

EditProperty.propTypes = {
  propertyId: PropTypes.string.isRequired,
}
