import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import useFetch from 'use-http'
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
import { id } from 'date-fns/locale'

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
      setValue('payment_term', endpoint.data.payment_term)
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
          className="tooltip_button d-flex"
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
                    src={
                      property.photo
                        ? property.photo
                        : imageView
                        ? imageView
                        : 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJ1aWxkaW5nc3xlbnwwfHwwfHx8MA%3D%3D'
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
                      {...register('photo')}
                      onChange={(e) => handleFileSelection(e)}
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
  propertyId: PropTypes.number.isRequired,
}
