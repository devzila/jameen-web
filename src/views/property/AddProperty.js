import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CListGroupItem } from '@coreui/react'
import avtar from 'src/assets/images/default-building.png'
import 'bootstrap-icons/font/bootstrap-icons.css'
import photo from 'src/assets/images/default-building.png'

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

export default function PropertyForm({ after_submit }) {
  const [visible, setVisible] = useState(false)
  const [imageView, setImageView] = useState('')
  const [useTypeOptions, setUseTypeOptions] = useState([])
  const [paymentTermOptions, setPaymentTermOptions] = useState([])
  const [errors, setErrors] = useState({})
  const [disabled, setDisabled] = useState(false)
  const [property, setProperty] = useState({})
  const { register, handleSubmit, control, watch, reset } = useForm()
  const [signatureImage, setSignatureImage] = useState('')

  const handleSignatureSelection = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSignatureImage(URL.createObjectURL(file))
    }
  }

  const { get, post, response } = useFetch()
  async function fetchProperties() {
    const api = await get('/v1/admin/options')

    if (response.ok) {
      const propertyUseTypesOptions = Object.entries(api.property_use_types).map((element) => ({
        value: element[1],
        label: element[0],
      }))

      const propertyPaymentTermsOptions = Object.entries(api.property_payment_terms).map(
        ([key, value]) => ({
          value: value,
          label: key.charAt(0).toUpperCase() + key.slice(1)?.replace(/_/g, ' '),
        }),
      )

      setPaymentTermOptions(propertyPaymentTermsOptions)
      setUseTypeOptions(propertyUseTypesOptions)
    }
  }

  const avatar_obj = watch('avatar')

  useEffect(() => {
    fetchProperties()
  }, [])

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

  async function onSubmit(data) {
    setDisabled(true)

    const body = {
      ...data,
      avatar: { data: imageView },
    }

    await post('/v1/admin/premises/properties', {
      property: body,
    })

    if (response.ok) {
      toast.success('Property added successfully')
      setVisible(false)
      after_submit()
      reset()
      setImageView('')
      setErrors({})
    } else {
      setErrors(response.data.errors || {})
      toast.error(response.data?.message)
    }

    setDisabled(false)
  }

  return (
    <div>
      <button
        type="button"
        className="btn s-3 custom_theme_button"
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Add Property
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
          <CModalTitle id="StaticBackdropExampleLabel">Add Property Details</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <div className="col text-center">
                  <img
                    alt=""
                    style={{
                      width: '300px',
                      height: '300px',
                      marginTop: '2%',
                      marginLeft: '4%',
                      borderRadius: '50%',
                    }}
                    title="Avatar"
                    className="img-circle img-thumbnail isTooltip"
                    src={avtar}
                    data-original-title="Usuario"
                  />
                </div>
              </Row>

              <Row>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Avatar Image</label>

                    <Form.Control
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      {...register('avatar')}
                      onChange={(e) => handleFileSelection(e)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Name
                      <small className="text-danger"> *{errors?.name}</small>
                    </label>

                    <Form.Control placeholder="Property Name" type="text" {...register('name')} />
                  </Form.Group>
                </Col>

                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Address Line 1<small className="text-danger"> *{errors?.address}</small>
                    </label>

                    <Form.Control
                      placeholder="Address Line 1"
                      type="text"
                      {...register('address')}
                    />
                  </Form.Group>
                </Col>

                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Address Line 2<small className="text-danger"> *{errors?.address_line2}</small>
                    </label>

                    <Form.Control
                      placeholder="Address Line 2"
                      type="text"
                      {...register('address_line2')}
                    />
                  </Form.Group>
                </Col>

                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      City
                      <small className="text-danger"> *{errors?.city}</small>
                    </label>

                    <Form.Control placeholder="City" type="text" {...register('city')} />
                  </Form.Group>
                </Col>

                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      State
                      <small className="text-danger"> *{errors?.state}</small>
                    </label>

                    <Form.Control placeholder="State" type="text" {...register('state')} />
                  </Form.Group>
                </Col>

                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Pin Code
                      <small className="text-danger"> *{errors?.pin_code}</small>
                    </label>

                    <Form.Control placeholder="Pin Code" type="text" {...register('pin_code')} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Invoice Prefix
                      <small className="text-danger"> *{errors?.invoice_no_prefix}</small>
                    </label>

                    <Form.Control
                      placeholder="Invoice Prefix"
                      type="text"
                      {...register('invoice_prefix')}
                    />
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Invoice generates
                      <small className="text-danger"> *{errors?.invoice_day}</small>
                    </label>

                    <Form.Select {...register('invoice_day')}>
                      <option value="">Select Invoice Day</option>

                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Use Type</label>

                    <Controller
                      name="use_type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={useTypeOptions}
                          value={useTypeOptions.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                        />
                      )}
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
                      control={control}
                      render={({ field }) => (
                        <Select
                          classNamePrefix="react-select"
                          {...field}
                          options={paymentTermOptions}
                          value={paymentTermOptions.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* contract and communication */}
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
                      <Form.Control placeholder="Phone Number" type="text" {...register('phone')} />
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
                      <Form.Control placeholder="Address" type="text" {...register('address')} />
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
                      <label>PAN Number</label>
                      <Form.Control placeholder="PAN Number" type="text" {...register('pan_no')} />
                    </Form.Group>
                  </Col>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>GST Number</label>
                      <Form.Control placeholder="GST Number" type="text" {...register('gst_no')} />
                    </Form.Group>
                  </Col>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>TAN Number</label>
                      <Form.Control placeholder="TAN Number" type="text" {...register('tan_no')} />
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
                      <label>Notification Phone No</label>
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
                      src={photo}
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
                    {signatureImage ? (
                      <img
                        alt="Signature"
                        style={{
                          width: '200px',
                          height: '100px',
                          objectFit: 'contain',
                          border: '1px solid #ddd',
                        }}
                        className="img-thumbnail"
                        src={signatureImage}
                      />
                    ) : (
                      <div
                        style={{
                          width: '200px',
                          height: '100px',
                          border: '1px dashed #ccc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto',
                        }}
                      >
                        No Signature Uploaded
                      </div>
                    )}
                    <Form.Group className="mt-3">
                      <label>Signature Image</label>
                      <Form.Control
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        {...register('signature')}
                        onChange={(e) => handleSignatureSelection(e)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              <div className="text-center">
                <CModalFooter>
                  <Button
                    type="submit"
                    className="btn btn-primary btn-block custom_theme_button"
                    disabled={disabled}
                  >
                    Submit
                  </Button>

                  <CButton className="custom_grey_button" onClick={() => setVisible(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </div>
            </Form>

            <div className="clearfix"></div>
          </CContainer>
        </CModalBody>
      </CModal>
    </div>
  )
}

PropertyForm.propTypes = {
  after_submit: PropTypes.func,
}
