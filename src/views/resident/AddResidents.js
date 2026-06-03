import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from 'react-select'
import defaultAvatar from '../../assets/images/avatars/default.png'

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
import { cleanAvatar } from 'src/services/CommonFunctions'
import PropTypes from 'prop-types'

export default function AddResidents({ after_submit, residentData = {} }) {
  const [visible, setVisible] = useState(false)
  const [properties_data, setProperties_data] = useState([])
  const [errors, setErrors] = useState({})

  const [imageView, setImageView] = useState('')
  const [identityProofDoc, setIdentityProof] = useState(null)
  const [existingIdentityProof, setExistingIdentityProof] = useState('')

  const { register, handleSubmit, control, watch, setValue, reset } = useForm()
  const extractFileName = (value) => {
    if (!value) return ''
    const parts = String(value).split('/')
    return parts[parts.length - 1] || String(value)
  }
  const existingIdentityProofName =
    residentData?.identity_proof_doc_name ||
    residentData?.data?.identity_proof_doc_name ||
    extractFileName(existingIdentityProof) ||
    'View Identity Proof'
  const { get, post, response } = useFetch()

  const gender = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ]
  //image

  const avatar_obj = watch('avatar')
  useEffect(() => {
    if (residentData?.identity_proof_doc) {
      setExistingIdentityProof(residentData.identity_proof_doc)
    } else if (residentData?.data?.identity_proof_doc) {
      setExistingIdentityProof(residentData.data.identity_proof_doc)
    }

    loadInitialProperties()
  }, [residentData])

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

  function trimProperties(properties_obj) {
    return properties_obj.map((element) => ({
      value: element.id,
      label: element.name,
    }))
  }

  //Post Data
  const onSubmit = async (data) => {
    const formData = new FormData()

    formData.append('member[first_name]', data.first_name)
    formData.append('member[last_name]', data.last_name)
    formData.append('member[email]', data.email)
    formData.append('member[phone_number]', data.phone_number)
    formData.append('member[password]', data.password)
    formData.append('member[gender]', data.gender)
    formData.append('member[dob]', data.dob)

    // avatar base64
    if (imageView) {
      formData.append('member[avatar]', imageView)
    }

    // identity proof file
    if (identityProofDoc) {
      formData.append('member[identity_proof_doc]', identityProofDoc)
    }

    const result = await post('/v1/admin/members', formData)

    if (response.ok) {
      toast('Resident Added Successfully')

      reset()
      setImageView('')
      setIdentityProof(null)
      setVisible(false)

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
        className="s-3 custom_theme_button"
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
                title="Avatar"
                className="img-circle img-thumbnail isTooltip  "
                src={imageView ? imageView : 'https://bootdey.com/img/Content/avatar/avatar7.png'}
                data-original-title="Usuario"
              />
            </div>
            <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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
                      autoComplete="off"
                      {...register('email')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="6">
                  <Form.Group>
                    <label>
                      Password
                      <small className="text-danger"> *{errors ? errors.password : null} </small>
                    </label>
                    <Form.Control
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
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

                    {existingIdentityProof && (
                      <div className="mt-2">
                        <strong>Current Document:</strong>{' '}
                        <a href={existingIdentityProof} target="_blank" rel="noopener noreferrer">
                          {existingIdentityProofName}
                        </a>
                      </div>
                    )}
                    {identityProofDoc?.name && (
                      <div className="mt-1 text-success">
                        Selected File: {identityProofDoc.name}
                      </div>
                    )}
                    <small className="text-muted">Upload JPEG, PNG or PDF file</small>
                    <br></br>
                  </Form.Group>
                </Col>
              </Row>
              <br></br>
              <br></br>
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
                    color="secondary custom_grey_button"
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
AddResidents.propTypes = {
  after_submit: PropTypes.func,
  residentData: PropTypes.object,
}
