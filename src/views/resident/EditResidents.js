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
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null)
  const [identityProof, setIdentityProof] = useState(null)

  const { register, handleSubmit, setValue, watch, control } = useForm()
  const extractFileName = (value) => {
    if (!value) return ''
    const parts = String(value).split('/')
    return parts[parts.length - 1] || String(value)
  }
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
        setSelectedAvatarFile(selectedFile)
      }

      reader.readAsDataURL(selectedFile)
    }
  }
  const handleIdentityProof = (e) => {
    const selectedFile = e.target.files[0]

    if (selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']

      if (!allowedTypes.includes(selectedFile.type)) {
        toast('Only JPG, PNG and PDF files are allowed')
        return
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        toast('File size should be less than 5MB')
        return
      }

      const reader = new FileReader()

      reader.onload = function (e) {
        setIdentityProof({
          data: e.target.result,
          name: selectedFile.name,
          type: selectedFile.type,
        })
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
      if (endpoint.data.avatar) {
        setImageView(endpoint.data.avatar)
      }
      setIdentityProof(null)
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
    const { avatar, ...rest } = data
    const body = {
      ...rest,
    }
    if (identityProof?.data) {
      body.identity_proof_doc = identityProof
    }

    if (selectedAvatarFile && imageView) {
      body.avatar = { data: imageView }
    }

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
        type="button"
        className="btn custom_theme_button"
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
                  src={
                    imageView
                      ? imageView
                      : resident?.avatar
                      ? resident.avatar
                      : 'https://bootdey.com/img/Content/avatar/avatar7.png'
                  }
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
                    <label>Phone No</label>
                    <Form.Control
                      placeholder="Phone Number"
                      type="text"
                      {...register('phone_number')}
                    ></Form.Control>
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
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Identity Proof (Optional)</label>

                    <Form.Control
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      {...register('identity_proof_doc')}
                      onChange={(e) => handleIdentityProof(e)}
                    />

                    <small className="text-muted">Upload JPG, PNG or PDF file</small>

                    {resident?.identity_proof_doc && (
                      <div className="mt-2">
                        <strong>Existing File:</strong>{' '}
                        <a href={resident.identity_proof_doc} target="_blank" rel="noreferrer">
                          {resident.identity_proof_doc_name ||
                            extractFileName(resident.identity_proof_doc) ||
                            'View Document'}
                        </a>
                      </div>
                    )}
                    {identityProof?.name && (
                      <div className="mt-1 text-success">Selected File: {identityProof.name}</div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-center">
                <CModalFooter>
                  <Button data-mdb-ripple-init type="submit" className="btn  custom_theme_button">
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
