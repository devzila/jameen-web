import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'

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

export default function PropertyForm() {
  const [visible, setVisible] = useState(false)
  const [imageView, setImageView] = useState('')
  const [useTypeOptions, setUseTypeOptions] = useState([])
  const [paymentTermOptions, setPaymentTermOptions] = useState([])

  const { register, handleSubmit, control, reset } = useForm()
  const { get, post, response } = useFetch()

  let properties_array = []
  function trimProperties(properties) {
    properties.forEach((element) => {
      properties_array.push({ value: element.id, label: element.name })
    })
    return properties_array
  }

  async function fetchProperties() {
    try {
      const api = await get('/v1/admin/options')
      console.log('API Response:', api)

      if (response.ok) {
        const propertyUseTypesOptions = Object.entries(api.data.property_use_types).map(
          ([key, value]) => ({
            value: value,
            label: key.charAt(0).toUpperCase() + key.slice(1),
          }),
        )

        const propertyPaymentTermsOptions = Object.entries(api.data.property_payment_terms).map(
          ([key, value]) => ({
            value: value,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
          }),
        )

        setUseTypeOptions(propertyUseTypesOptions)
        setPaymentTermOptions(propertyPaymentTermsOptions)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
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
    const assigned_properties_data =
      data?.property_ids?.length > 0 ? data.property_ids.map((element) => element.value) : []

    const body = { ...data, property_ids: assigned_properties_data, avatar: { data: imageView } }

    const apiResponse = await post(`/v1/admin/premises/properties`, { unit: body })

    if (apiResponse.ok) {
      toast('Unit added successfully')
      reset()
      setImageView('')
      setVisible(!visible)
    } else {
      toast(apiResponse.data?.message)
    }
  }

  return (
    <div>
      <button
        style={{ backgroundColor: '#00bfcc', color: 'white', marginLeft: '4px' }}
        color="#00bfcc"
        type="button"
        className="btn s-3"
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
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Name</label>
                    <Form.Control type="text" {...register('name')}></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>City</label>
                    <Form.Control type="text" {...register('city')}></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Use Type</label>
                    <Controller
                      name="useType"
                      render={({ field }) => (
                        <Select
                          isMulti
                          className="basic-multi-select"
                          classNamePrefix="select"
                          {...field}
                          options={useTypeOptions}
                        />
                      )}
                      control={control}
                    />
                  </Form.Group>
                </Col>

                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Unit Count</label>
                    <Form.Control type="text" {...register('unitCount')}></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Payment Term</label>
                    <Controller
                      name="paymentTerm"
                      render={({ field }) => (
                        <Select
                          isMulti
                          className="basic-multi-select"
                          classNamePrefix="select"
                          {...field}
                          options={paymentTermOptions}
                        />
                      )}
                      control={control}
                    />
                  </Form.Group>
                </Col>

                {/* Add more property fields as needed */}
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
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
              <div className="text-center">
                <CModalFooter>
                  <Button
                    data-mdb-ripple-init
                    type="submit"
                    className="btn  btn-primary btn-block"
                    style={{
                      marginTop: '5px',
                      color: 'white',
                      backgroundColor: '#00bfcc',
                      border: '0px',
                    }}
                  >
                    Submit
                  </Button>
                  <CButton
                    color="secondary"
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
