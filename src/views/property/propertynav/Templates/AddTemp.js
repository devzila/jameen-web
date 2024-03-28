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

export default function AddTemp({ after_submit, option }) {
  const [visible, setVisible] = useState(false)
  const [model, setModel] = useState()

  const { register, handleSubmit, control, watch, reset } = useForm()
  const { get, post, response } = useFetch()

  async function onSubmit(data) {
    data = { ...data, content: model }
    if (option == 'credit_notes') {
      var payload = { credit_note: data }
    } else if (option == 'invoices') {
      var payload = { invoice: data }
    }
    const api = await post(`/v1/admin/template/${option}`, payload)

    console.log(payload)

    if (response.ok) {
      toast.success('Template added successfully')
      setVisible(!visible)
      after_submit()
      reset()
    } else {
      toast(api.data?.message)
    }
  }
  const handleModelChange = (event) => {
    setModel(event)
  }
  Froalaeditor.DefineIcon('Macros', { NAME: 'Macros', SVG_KEY: 'cogs' })
  Froalaeditor.RegisterCommand('Macros', {
    title: 'Macros',
    type: 'dropdown',
    focus: false,
    undo: false,
    refreshAfterCallback: true,
    options: {
      v1: 'Option 1',
      v2: 'Option 2',
    },
    callback: function (cmd, val) {
      console.log(val)
    },
    // Callback on refresh.
    refresh: function ($btn) {
      console.log('do refresh')
    },
    // Callback on dropdown show.
    refreshOnShow: function ($btn, $dropdown) {
      console.log('do refresh when show')
    },
  })

  return (
    <>
      <div>
        <button
          type="button"
          className="btn s-3 custom_theme_button "
          data-mdb-ripple-init
          onClick={() => setVisible(!visible)}
        >
          Add Template
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
            <CModalTitle id="StaticBackdropExampleLabel">Add Template</CModalTitle>
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

AddTemp.propTypes = {
  after_submit: PropTypes.func,
  option: PropTypes.string,
}
