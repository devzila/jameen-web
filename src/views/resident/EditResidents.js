import React, { useState } from 'react'
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

export default function EditResidents({ id, after_submit }) {
  const [resident, setResident] = useState({})
  const [visible, setVisible] = useState(false)
  const [imageView, setImageView] = useState('')
  const [identityProofDoc, setIdentityProof] = useState(null)

  const { register, handleSubmit, setValue, control, reset } = useForm()

  const { get, put, response } = useFetch()

  const gender = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ]

  // Avatar Preview
  const handleFileSelection = (e) => {
    const selectedFile = e.target.files[0]

    if (selectedFile) {
      const reader = new FileReader()

      reader.onload = function (e) {
        setImageView(e.target.result)
      }

      reader.readAsDataURL(selectedFile)
    }
  }

  // Identity Proof Upload
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

      setIdentityProof(selectedFile)
    }
  }

  // Load Resident
  const loadResident = async () => {
    try {
      const endpoint = await get(`/v1/admin/members/${id}`)

      if (response.ok && endpoint?.data) {
        const residentData = endpoint.data

        setResident(residentData)

        setValue('first_name', residentData.first_name || '')
        setValue('last_name', residentData.last_name || '')
        setValue('email', residentData.email || '')
        setValue('phone_number', residentData.phone_number || '')
        setValue('gender', residentData.gender || '')
        setValue('dob', residentData.dob ? residentData.dob.split('T')[0] : '')
      }
    } catch (error) {
      console.log(error)
      toast('Unable to load resident')
    }
  }

  // Submit
  const onSubmit = async (data) => {
    const formData = new FormData()

    formData.append('member[first_name]', data.first_name || '')
    formData.append('member[last_name]', data.last_name || '')
    formData.append('member[email]', data.email || '')
    formData.append('member[phone_number]', data.phone_number || '')
    formData.append('member[password]', data.password || '')
    formData.append('member[gender]', data.gender || '')
    formData.append('member[dob]', data.dob || '')

    // avatar
    if (imageView) {
      formData.append('member[avatar]', imageView)
    }

    // identity proof
    if (identityProofDoc) {
      formData.append('member[identity_proof_doc]', identityProofDoc)
    }

    await put(`/v1/admin/members/${id}`, formData)

    if (response.ok) {
      toast('Resident Data Edited Successfully')

      setVisible(false)

      reset()

      setImageView('')

      setIdentityProof(null)

      if (after_submit) {
        after_submit()
      }
    } else {
      toast(response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn custom_theme_button"
        onClick={() => {
          setVisible(true)

          if (id) {
            loadResident()
          }
        }}
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
                  alt="Avatar"
                  style={{
                    width: '300px',
                    height: '300px',
                    marginTop: '2%',
                    marginLeft: '4%',
                    borderRadius: '50%',
                  }}
                  title="Avatar"
                  className="img-circle img-thumbnail isTooltip"
                  src={
                    imageView
                      ? imageView
                      : resident?.avatar
                      ? resident.avatar
                      : 'https://bootdey.com/img/Content/avatar/avatar7.png'
                  }
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
                    />
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
                    />
                  </Form.Group>
                </Col>

                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Last Name</label>

                    <Form.Control placeholder="Last Name" type="text" {...register('last_name')} />
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
                    />
                  </Form.Group>
                </Col>

                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Password</label>

                    <Form.Control
                      placeholder="Password"
                      type="password"
                      {...register('password')}
                    />
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
                    />
                  </Form.Group>
                </Col>

                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>D.O.B</label>

                    <Form.Control type="date" {...register('dob')} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>Gender</label>

                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={gender}
                          value={gender.find((c) => c.value === field.value)}
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
                        <a href={resident.identity_proof_doc} target="_blank" rel="noreferrer">
                          View Existing Identity Proof
                        </a>
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center">
                <CModalFooter>
                  <Button type="submit" className="btn custom_theme_button">
                    Submit
                  </Button>

                  <CButton
                    className="custom_grey_button"
                    color="light"
                    onClick={() => {
                      setVisible(false)

                      reset()

                      setImageView('')

                      setIdentityProof(null)
                    }}
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
  after_submit: PropTypes.func,
}
