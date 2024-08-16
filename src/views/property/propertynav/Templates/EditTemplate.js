import React, { useEffect, useState } from 'react'
import useFetch from 'use-http'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import FroalaEditorComponent from 'react-froala-wysiwyg'
import Froalaeditor from 'froala-editor'

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

export default function EditTemplate({ after_submit, id, option }) {
  const { register, handleSubmit, control, reset, setValue } = useForm()
  const { get, put, response, api } = useFetch()
  const [model, setModel] = useState()
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchCreditNotes()
  }, [])

  async function fetchCreditNotes() {
    const endpoint = await get(`/v1/admin/template/${option}/${id}`)
    if (response.ok) {
      setValue('name', endpoint?.data?.name)
      setModel(endpoint?.data?.content)
    }
  }
  const handleModelChange = (event) => {
    setModel(event)
  }

  async function onSubmit(data) {
    if (option == 'credit_notes') {
      var payload = { credit_note: data }
    } else if (option == 'invoices') {
      var payload = { invoice: data }
    }
    const apiResponse = await put(`/v1/admin/template/${option}/${id}`, payload)
    if (response.ok) {
      setVisible(!visible)
      after_submit()
      toast.success('Building added successfully')
    } else {
      setErrors(response.data.errors)
      toast.error(response.data?.message || 'Unknown Error')
    }
  }

  function handleClose() {
    setVisible(false)
    setErrors({})
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
            <CModalTitle id="StaticBackdropExampleLabel">
              EDIT {option?.replace('_', ' ').toUpperCase()}{' '}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CContainer>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col className="my-2" md="12">
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
                </Row>
                <Row>
                  <label>Content</label>

                  <FroalaEditorComponent
                    model={model}
                    config={{
                      toolbarSticky: true,

                      toolbarButtons: [
                        ['bold', 'italic', 'underline', 'undo', 'redo'],
                        [
                          'outdent',
                          'indent',
                          'subscript',
                          'superscript',
                          'strikeThrough',
                          'insertHR',
                          'selectAll',
                          'formatOL',
                          'formatUL',
                          'insertTable',
                          'Macros',
                        ],
                      ],
                    }}
                    onModelChange={handleModelChange}
                    tag="textarea"
                    name="content"
                    {...register('content')}
                  />
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
                    <CButton className="custom_grey_button" onClick={() => setVisible(false)}>
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
    </>
  )
}

EditTemplate.propTypes = {
  after_submit: PropTypes.func,
  id: PropTypes.number,
  option: PropTypes.string,
}
