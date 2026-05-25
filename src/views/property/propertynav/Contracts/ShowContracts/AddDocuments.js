import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import { useForm, useFieldArray } from 'react-hook-form'
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

export default function AddDocuments({ after_submit, moving_in }) {
  const [visible, setVisible] = useState(false)
  const [temp_base64, setTemp_base64] = useState([])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      document: [{ name: '', description: '', file: { data: '' } }],
    },
  })

  const { post, response } = useFetch()
  const { propertyId, contractId } = useParams()

  // Dynamic form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'document',
  })

  // Base64 conversion
  const handleFileSelection = (e, index) => {
    const selectedFile = e.target.files[0]

    if (selectedFile) {
      const reader = new FileReader()

      reader.onload = function (e) {
        const temp_array64 = [...temp_base64]
        temp_array64[index] = e.target.result
        setTemp_base64(temp_array64)
      }

      reader.readAsDataURL(selectedFile)
    }
  }

  async function onSubmit(data) {
    // Manual validation
    if (!data.document[0].name?.trim()) {
      toast.error('Document name is required')
      return
    }

    // Attach base64 data
    data.document = data.document.map((element, index) => ({
      ...element,
      file: {
        data: temp_base64[index] || '',
      },
    }))

    await post(
      `/v1/admin/premises/properties/${propertyId}/${
        moving_in ? 'moving_in' : 'allotments'
      }/${contractId}/documents`,
      {
        document: data.document[0],
      },
    )

    if (response.ok) {
      toast.success('Document added Successfully')
      after_submit()
      reset({
        document: [{ name: '', description: '', file: { data: '' } }],
      })
      setTemp_base64([])
      setVisible(false)
    } else {
      toast.error(response.data?.message || 'Something went wrong')
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn flex s-3 custom_theme_button"
        onClick={() => setVisible(true)}
      >
        Add Document
      </button>

      <CModal
        alignment="center"
        size="xl"
        visible={visible}
        backdrop="static"
        onClose={() => setVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Add Documents</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CContainer>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {fields.map((field, index) => (
                <Row key={field.id}>
                  {/* Document Name */}
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <b>Document Name *</b>

                      <Form.Control
                        placeholder="Name"
                        type="text"
                        {...register(`document.${index}.name`, {
                          required: 'Document name is required',
                        })}
                      />

                      {errors?.document?.[index]?.name && (
                        <small className="text-danger">{errors.document[index].name.message}</small>
                      )}
                    </Form.Group>
                  </Col>

                  {/* File Upload */}
                  <Col className="pr-1 mt-3 mb-2" md="6">
                    <Form.Group>
                      <label>
                        <b>Document</b>
                      </label>

                      <Form.Control
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileSelection(e, index)}
                      />
                    </Form.Group>
                  </Col>

                  {/* Description */}
                  <Col className="pr-1 mt-3" md="6">
                    <Form.Group>
                      <label>Description</label>

                      <Form.Control
                        placeholder="Description"
                        type="text"
                        {...register(`document.${index}.description`)}
                      />
                    </Form.Group>
                  </Col>

                  {/* Delete Button */}
                  <Col>
                    {fields.length > 1 && (
                      <Col className="justify-content-center mt-2" md="4">
                        <CIcon
                          className="mt-3"
                          onClick={() => remove(index)}
                          icon={cilDelete}
                          size="xl"
                          style={{ '--ci-primary-color': 'red', cursor: 'pointer' }}
                        />
                      </Col>
                    )}
                  </Col>
                </Row>
              ))}

              {/* Add More */}
              <Col className="m-3 d-flex justify-content-center">
                <CButton
                  type="button"
                  className="btn custom-add-more"
                  onClick={() =>
                    append({
                      name: '',
                      description: '',
                      file: { data: '' },
                    })
                  }
                >
                  <CIcon className="mt-1" icon={cilNoteAdd} />
                  ADD More
                </CButton>
              </Col>

              {/* Footer Buttons */}
              <div className="text-center">
                <CModalFooter>
                  <Button type="submit" className="btn custom_theme_button btn-primary btn-block">
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
  moving_in: PropTypes.bool,
}
