import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import { toast } from 'react-toastify'
import { useForm, useFieldArray } from 'react-hook-form'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { cilDelete, cilNoteAdd, freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useParams } from 'react-router-dom'

const THEME_COLOR = '#00bfcc'
const labelStyle = { fontWeight: 600, color: '#1f2933' }
const cardStyle = {
  background: '#f8fafc',
  border: '1px solid #eef1f5',
  borderRadius: '14px',
  padding: '18px',
}

export default function AddDocuments({ after_submit, moving_in }) {
  const [visible, setVisible] = useState(false)
  const [temp_base64, setTemp_base64] = useState([])
  const { register, handleSubmit, setValue, control, reset } = useForm()
  const { post, response } = useFetch()
  const { propertyId, contractId } = useParams()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'document',
  })

  useEffect(() => {
    append()
  }, [])

  useEffect(() => {
    setValue('document', [{ name: '', description: '', file: { data: '' } }])
  }, [setValue])

  async function onSubmit(data) {
    temp_base64.map((x, index) => setValue(`document.${index}.file.data`, x))
    data.document.map((element, index) => (element.file.data = temp_base64[index]))

    await post(
      `/v1/admin/premises/properties/${propertyId}/${
        moving_in ? 'moving_in' : 'allotments'
      }/${contractId}/documents`,
      {
        document: data.document[0],
      },
    )

    if (response.ok) {
      toast.success('Document added successfully')
      after_submit()
      reset()
      setVisible(false)
      setTemp_base64([])
    } else {
      toast.error(response.data?.message || 'Unknown Error')
    }
  }

  function handleFileSelection(e, index) {
    const selectedFile = e.target.files[0]

    if (selectedFile) {
      const reader = new FileReader()

      reader.onload = function (event) {
        const temp_array64 = Array.from(temp_base64)
        temp_array64[index] = event.target.result
        setTemp_base64(temp_array64)
      }

      reader.readAsDataURL(selectedFile)
    }
  }

  function handleClose() {
    setVisible(false)
    reset()
    setTemp_base64([])
  }

  return (
    <>
      <button
        type="button"
        className="btn d-flex align-items-center"
        onClick={() => setVisible(true)}
        style={{
          gap: '6px',
          background: THEME_COLOR,
          color: '#fff',
          borderRadius: '10px',
          height: '38px',
          fontWeight: 600,
          border: 'none',
        }}
      >
        <CIcon icon={freeSet.cilPlus} size="sm" />
        Add Document
      </button>

      <Modal
        show={visible}
        onHide={handleClose}
        centered
        size="lg"
        backdrop="static"
        contentClassName="border-0 overflow-hidden rounded-4"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          style={{
            background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #0098a3 100%)`,
            border: 'none',
            padding: '20px 24px',
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit',
          }}
        >
          <Modal.Title style={{ color: '#fff' }}>
            <div className="d-flex align-items-center" style={{ gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CIcon icon={freeSet.cilDescription} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  Add Document
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  Upload a document for this contract
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px' }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div style={cardStyle}>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #eef1f5',
                    borderRadius: '12px',
                    padding: '14px',
                    marginBottom: index < fields.length - 1 ? '12px' : 0,
                  }}
                >
                  <Row className="g-3 align-items-end">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={labelStyle}>
                          Document Name <span style={{ color: '#e03131' }}>*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          placeholder="Name"
                          type="text"
                          {...register(`document.${index}.name`)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={labelStyle}>Document</Form.Label>
                        <Form.Control
                          type="file"
                          accept=".jpg, .jpeg, .png"
                          {...register(`document.${index}.file.data`)}
                          onChange={(e) => handleFileSelection(e, index)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={fields.length > 1 ? 10 : 12}>
                      <Form.Group>
                        <Form.Label style={labelStyle}>Description</Form.Label>
                        <Form.Control
                          placeholder="Description"
                          type="text"
                          {...register(`document.${index}.description`)}
                        />
                      </Form.Group>
                    </Col>
                    {fields.length > 1 && (
                      <Col md={2} className="d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-link p-0"
                          onClick={() => remove(index)}
                          aria-label="Remove document"
                        >
                          <CIcon icon={cilDelete} size="lg" style={{ color: '#e03131' }} />
                        </button>
                      </Col>
                    )}
                  </Row>
                </div>
              ))}

              <div className="d-flex justify-content-center mt-3">
                <Button
                  type="button"
                  variant="light"
                  className="d-flex align-items-center"
                  style={{ gap: '6px', borderRadius: '8px', fontWeight: 600 }}
                  onClick={() => append({ name: '', description: '', file: { data: '' } })}
                >
                  <CIcon icon={cilNoteAdd} size="sm" />
                  Add More
                </Button>
              </div>
            </div>

            <Modal.Footer style={{ border: 'none', padding: '16px 0 0' }}>
              <Button
                variant="light"
                onClick={handleClose}
                style={{ borderRadius: '8px', fontWeight: 600 }}
              >
                Close
              </Button>
              <Button
                type="submit"
                style={{
                  background: THEME_COLOR,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                }}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

AddDocuments.propTypes = {
  after_submit: PropTypes.func,
  moving_in: PropTypes.bool,
}
