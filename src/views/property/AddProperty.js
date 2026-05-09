import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'
import PropTypes from 'prop-types'
import avtar from 'src/assets/images/images.jpeg'

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

  const { register, handleSubmit, control, watch, reset } = useForm()

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
