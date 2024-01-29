import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
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
import { toast } from 'react-toastify'

export default function EditResidents(props) {
  const [resident, setResident] = useState({})
  const [properties_data, setProperties_data] = useState([])
  const [visible, setVisible] = useState(false)
  const [imageView, setImageView] = useState('')

  const { register, handleSubmit, setValue, watch, control } = useForm()
  const { get, put, response } = useFetch()

  const { id } = props

  //base64
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

  const gender = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ]

  useEffect(() => {
    loadInitialProperties()
    loadResident()
  }, [])

  const loadInitialProperties = async () => {
    let endpoint = `/v1/admin/premises/properties`

    const initialProperties = await get(endpoint)
    if (response.ok) {
      setProperties_data(trimProperties(initialProperties.data))
    } else {
      toast("Can't load properties data")
    }
  }

  let properties_array = []
  function trimProperties(properties_obj) {
    properties_obj.forEach((element) => {
      properties_array.push({ value: element.id, label: element.name })
    })
    return properties_array
  }
  const loadResident = async () => {
    const endpoint = await get(`/v1/admin/members/${id}`)

    if (response.ok) {
      setResident(endpoint.data)
      setValue('first_name', endpoint.data.first_name)
      setValue('last_name', endpoint.data.last_name)
      setValue('email', endpoint.data.email)
      setValue('phone_number', endpoint.data.phone_number)
      setValue('username', endpoint.data.username)
      setValue('password', endpoint.data.first_name)
      setValue('gender', endpoint.data.gender)
      setValue('dob', endpoint.data.dob)
      setValue('property_id', endpoint.data.property_id)
    } else {
      toast(response?.data.message)
    }
  }
  const onSubmit = async (data) => {
    const body = { ...data, avatar: { data: imageView } }
    const endpoint = await put(`/v1/admin/members/${id}`, { member: body })

    if (response.ok) {
      toast('Resident Data Edited Successfully')
      setVisible(false)
    } else {
      toast(response?.error)
    }
  }

  return (
    <div>
      <button
        style={{
          backgroundColor: 'white',
          marginLeft: '4px',
          width: '90%',
          border: 'none',
          color: '#00bfcc',
        }}
        type="button"
        className="btn btn-tertiary "
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
          <CModalTitle id="StaticBackdropExampleLabel">Edit Resident</CModalTitle>
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
                  src={imageView ? imageView : 'https://bootdey.com/img/Content/avatar/avatar7.png'}
                  data-original-title="Usuario"
                />
              </div>
            </Row>
            <Form onSubmit={handleSubmit(onSubmit)}>
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
                    <label>First Name</label>
                    <Form.Control
                      placeholder="First Name"
                      type="text"
                      {...register('first_name')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Last Name</label>
                    <Form.Control
                      placeholder="Last Name"
                      type="text"
                      {...register('last_name')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Email</label>
                    <Form.Control
                      placeholder="abc@example.com"
                      type="text"
                      {...register('email')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Phone No</label>
                    <Form.Control
                      placeholder="Phone Number"
                      type="text"
                      {...register('phone_number')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-3 mt-3" md="6">
                  <Form.Group>
                    <label>Username</label>
                    <Form.Control
                      placeholder="UserName"
                      type="text"
                      {...register('username')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Password</label>
                    <Form.Control
                      placeholder="Password"
                      type="password"
                      {...register('password')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Gender</label>
                    <Controller
                      name="gender"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={gender}
                          value={gender.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                        />
                      )}
                      control={control}
                      placeholder="Role"
                    />
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>D.O.B</label>
                    <Form.Control
                      placeholder="Date of Birth"
                      type="date"
                      {...register('dob')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Assigned Properties</label>

                    <Controller
                      name="property_id"
                      render={({ field }) => (
                        <Select
                          s
                          type="text"
                          className="basic-multi-select"
                          classNamePrefix="select"
                          {...field}
                          options={properties_data}
                          value={properties_data.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                        />
                      )}
                      control={control}
                      placeholder="Assigned Properties"
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
          </CContainer>
        </CModalBody>
      </CModal>
    </div>
  )
}

EditResidents.propTypes = {
  id: PropTypes.number.isRequired,
}
