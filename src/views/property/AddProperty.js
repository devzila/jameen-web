import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Card, Form, Container, Row, Col } from 'react-bootstrap'
import Select from 'react-select'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CContainer,
} from '@coreui/react'

function AddProperty() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm()

  const { propertyId } = useParams()
  const [visible, setVisible] = useState(false)
  const { get, post, response, api } = useFetch()
  const [propertyData, setpropertyData] = useState({})
  const navigate = useNavigate()
  const [properties_data, setProperties_data] = useState([])

  useEffect(() => {
    const inputs = document.querySelectorAll('.form-group input')
    inputs.forEach((input) => {
      input.addEventListener('focus', () => {
        input.classList.add('active')
      })
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.classList.remove('active')
        }
      })
    })
  }, [])

  function trimProperties(properties) {
    if (properties && properties.data) {
      return properties.data.map((e) => ({
        value: e.id,
        label: e.name,
      }))
    } else {
      return []
    }
  }

  async function fetchProperties() {
    const api = await get(`/v1/admin/premises/properties`)
    if (response.ok) {
      setProperties_data(trimProperties(api))
    }
  }
  useEffect(() => {
    fetchProperties()
  }, [])

  async function onSubmit(data) {
    const apiResponse = await post(`/v1/admin/premises/properties`, {
      unit: data,
    })
    if (apiResponse.ok) {
      navigate(`properties`)
      toast('Unit added successfully')
    } else {
      toast(response.data?.message)
    }
  }

  return (
    <div>
      <button
        style={{ backgroundColor: '#00bfcc', color: 'white', marginLeft: '4px' }}
        color="#00bfcc"
        type="button"
        className="btn  s-3"
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
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Name</label>
                    <Form.Control
                      defaultValue={propertyData.name}
                      type="integer"
                      {...register('unit_no')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>City</label>

                    <Form.Control
                      defaultValue={propertyData.city}
                      type="integer"
                      {...register('bedrooms_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Use Type</label>
                    <Form.Control
                      defaultValue={propertyData.use_type}
                      type="integer"
                      {...register('bathrooms_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Unit Count</label>

                    <Form.Control
                      defaultValue={propertyData.unit_count}
                      type="integer"
                      {...register('year_built')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Payment Term</label>

                    <Controller
                      name="unit_type_id"
                      render={({ field }) => (
                        <Select
                          type="text"
                          className="basic-multi-select"
                          classNamePrefix="select"
                          {...field}
                          value={properties_data.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                          options={properties_data}
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

export default AddProperty
