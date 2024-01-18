import React, { useState, useEffect } from 'react'
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

export default function AddResidents() {
  const [visible, setVisible] = useState(false)
  const [properties_data, setProperties_data] = useState([])
  const [imageView, setImageView] = useState('')

  const { register, handleSubmit, control, watch, setValue } = useForm()
  const { get, post, response } = useFetch()

  const gender = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ]
  //image

  const avatar_obj = watch('avatar')

  const image_url = imageView ? imageView : 'https://bootdey.com/img/Content/avatar/avatar7.png'

  useEffect(() => {
    loadInitialProperties()
  }, [])

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
  // Properties fetch

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

  //Post Data
  async function onSubmit(data) {
    console.log(data)
    const image_val = data.avatar[0] ?? ''
    const form_data = { ...data, avatar: { data: imageView } }
    console.log(form_data)

    await post(`/v1/admin/residents`, { resident: form_data })

    if (response.ok) {
      toast('Resident added Successfully')
      setVisible(!visible)
    } else {
      toast(response.data?.message || response.statusText || 'Internet Not Working')
    }
  }

  return (
    <div>
      <button
        style={{ backgroundColor: '#00bfcc', color: 'white', marginLeft: '4px' }}
        color="#00bfcc"
        type="button"
        className="btn flex s-3"
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Add Resident
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
          <CModalTitle id="StaticBackdropExampleLabel">Add Resident </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
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
                title=""
                className="img-circle img-thumbnail isTooltip  "
                src={imageView ? imageView : 'https://bootdey.com/img/Content/avatar/avatar7.png'}
                data-original-title="Usuario"
              />
            </div>
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
                          value={gender.find((c) => c.value === field.value)}
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
            <div className="clearfix"></div>
          </CContainer>
        </CModalBody>
      </CModal>
    </div>
  )
}
