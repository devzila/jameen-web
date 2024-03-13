import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Form, Row, Col } from 'react-bootstrap'
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

export default function EditAssets({ after_submit, id }) {
  const { register, handleSubmit, control, setValue } = useForm()
  const { get, put, response, api } = useFetch()

  const { propertyId } = useParams()
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    loadAsset()
  }, [])

  async function loadAsset() {
    const endpoint = await get(`/v1/admin/premises/properties/${propertyId}/assets/${id}`)
    console.log(response.ok)
    if (response.ok) {
      console.log(endpoint)
      setValue('name', endpoint.data.name)
      setValue('description', endpoint.data.description)
      setValue('asset_type', endpoint.data.asset_type)
    }
  }

  async function onSubmit(data) {
    const apiResponse = await put(`/v1/admin/premises/properties/${propertyId}/assets/${id}`, {
      asset: data,
    })
    if (response.ok) {
      navigate(`/properties/${propertyId}/assets`)

      setVisible(!visible)
      after_submit()
      toast.success('Asset Created Succesfully')
    } else {
      setErrors(response.data.errors)
      toast.error(response.data?.message)
    }
  }

  function handleClose() {
    setVisible(false)
    setErrors({})
  }

  const asset_options = [
    { label: 'Equipment', value: 'equipment' },
    { label: 'Common Area', value: 'common_area' },
  ]

  return (
    <>
      <button
        type="button"
        className="tooltip_button"
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
        onClose={handleClose}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Add Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col className="pr-3 mt-3" md="12">
                  <Form.Group>
                    <label>Name</label>
                    <Form.Control
                      required
                      placeholder="Name"
                      type="text"
                      {...register('name')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Description</label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Description"
                      {...register('description')}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1 mt-3" md="12">
                  <Form.Group>
                    <label>Asset Type</label>

                    <Controller
                      name="asset_type"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={asset_options}
                          value={asset_options.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val.value)}
                        />
                      )}
                      control={control}
                      placeholder="Role"
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
                    color="secondary"
                    style={{ border: '0px', color: 'white' }}
                    onClick={handleClose}
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
    </>
  )
}

EditAssets.propTypes = {
  after_submit: PropTypes.func,
  id: PropTypes.number,
}
