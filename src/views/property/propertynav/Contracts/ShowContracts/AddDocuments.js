import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Button, Form, Row, Col } from 'react-bootstrap'
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

import { cilDelete, cilNoteAdd } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useParams } from 'react-router-dom'

export default function AddDocuments({ after_submit }) {
  const [visible, setVisible] = useState(false)

  const [roles_data, setRoles_data] = useState([])
  const [temp_base64, setTemp_base64] = useState([])

  const { register, handleSubmit, setValue, control, reset } = useForm()
  const { get, patch, response } = useFetch()
  const { propertyId, contractId } = useParams()
  useEffect(() => {
    fetchRoles()
    append()
  }, [])

  //initially append
  useEffect(() => {
    setValue('documents_attributes', [{ name: '', description: '', file: { data: '' } }])
  }, [setValue])

  //dynamic form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'documents_attributes',
  })

  async function onSubmit(data) {
    //resident array
    const assigned_resident_data =
      data?.resident_ids?.length > 0 ? data.resident_ids.map((element) => element.value) : []

    //filestobase64
    temp_base64.map((x, index) => setValue(`documents_attributes.${index}.file.data`, x))

    data.documents_attributes.map((element, index) => (element.file.data = temp_base64[index]))

    const body = { ...data, resident_ids: assigned_resident_data }

    await patch(`/v1/admin/premises/properties/${propertyId}/allotment${contractId}`, {
      allotment: body,
    })

    if (response.ok) {
      toast('user added Successfully')
      after_submit()
      reset()
      setVisible(!visible)
    } else {
      toast(response.data?.message)
    }
  }

  async function fetchRoles() {
    const api = await get('/v1/admin/roles')
    if (response.ok) {
      setRoles_data(api.data)
    }
  }

  //base64
  const handleFileSelection = (e, index) => {
    const selectedFile = e.target.files[0]

    if (selectedFile) {
      const reader = new FileReader()

      reader.onload = function (e) {
        const temp_array64 = Array.from(temp_base64)
        const base64Result = e.target.result
        temp_array64[index] = base64Result
        setTemp_base64(temp_array64)

        // setValue(`documents_attributes.${index}.file.data`, base64Result)
      }

      reader.readAsDataURL(selectedFile)
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn flex s-3 custom_theme_button"
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Add Document
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
          <CModalTitle id="StaticBackdropExampleLabel">Add Documents </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {fields.map((field, index) => (
                <Row key={field.id}>
                  <b className="mt-4"> </b>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <b>Document Name</b>
                      <Form.Control
                        required
                        placeholder=" Name"
                        type="text"
                        {...register(`documents_attributes.${index}.name`)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>

                  <Col className="pr-1 mt-3 mb-2" md="6">
                    <Form.Group>
                      <label>
                        <b>Document</b>
                      </label>
                      <Form.Control
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        {...register(`documents_attributes.${index}.file.data`)}
                        onChange={(e) => handleFileSelection(e, index)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Description</label>
                      <Form.Control
                        placeholder="Description"
                        type="text"
                        {...register(`documents_attributes.${index}.description`)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    {fields.length > 1 && (
                      <Col className="justify-content-center mt-2" md="4">
                        <CIcon
                          className="mt-3"
                          onClick={() => remove(index)}
                          icon={cilDelete}
                          size="xl"
                          style={{ '--ci-primary-color': 'red' }}
                        />
                      </Col>
                    )}
                  </Col>
                </Row>
              ))}
              <Col className="m-3 d-flex justify-content-center">
                <CButton
                  className="btn custom-add-more"
                  onClick={() => append({ name: '', description: '', file: { data: '' } })}
                >
                  <CIcon className="mt-1" icon={cilNoteAdd} />
                  ADD More
                </CButton>
              </Col>
              <div className="text-center">
                <CModalFooter>
                  <Button
                    data-mdb-ripple-init
                    type="submit"
                    className="btn custom_theme_button btn-primary btn-block"
                  >
                    Submit
                  </Button>
                  <CButton
                    className="custom_grey_button"
                    color="secondary"
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

AddDocuments.propTypes = {
  after_submit: PropTypes.func,
}
