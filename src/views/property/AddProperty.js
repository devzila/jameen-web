import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'
import PropTypes from 'prop-types'

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

  const { register, handleSubmit, control, reset } = useForm()
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
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        }),
      )
      setPaymentTermOptions(propertyPaymentTermsOptions)
      setUseTypeOptions(propertyUseTypesOptions)
    }
  }

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
    const body = { ...data, photo: { data: imageView } }

    const apiResponse = await post(`/v1/admin/premises/properties`, { property: body })

    console.log(response)

    if (response.ok) {
      toast('Property added successfully')
      setVisible(!visible)
      after_submit()
      reset()
      setImageView('')
    } else {
      toast(apiResponse.data?.message)
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn s-3 custom_theme_button "
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
                    alt="Avatar Image"
                    style={{
                      width: '300px',
                      height: '300px',
                      objectFit: 'cover',
                      marginTop: '2%',
                      marginLeft: '4%',
                      borderRadius: '50%',
                    }}
                    title="Avatar"
                    className="img-circle img-thumbnail isTooltip  "
                    src={
                      imageView ? imageView : 'https://bootdey.com/img/Content/avatar/avatar7.png'
                    }
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
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Name</label>
                    <Form.Control
                      required
                      placeholder="Full Name"
                      type="text"
                      {...register('name', { required: ' Name is required.' })}
                    ></Form.Control>
                  </Form.Group>
                </Col>

                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>City</label>
                    <Form.Control
                      placeholder="City"
                      type="text"
                      {...register('city')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Address</label>
                    <Form.Control
                      required
                      placeholder="Address"
                      type="text"
                      {...register('address')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="12">
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

              <div className="text-center">
                <CModalFooter>
                  <Button
                    data-mdb-ripple-init
                    type="submit"
                    className="btn  btn-primary btn-block custom_theme_button"
                  >
                    Submit
                  </Button>
                  <CButton
                    className="custom_grey_button"
                    color="secondary "
                    style={{ border: '0px', color: 'white' }}
                    onClick={() => setVisible(false)}
                  >
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
