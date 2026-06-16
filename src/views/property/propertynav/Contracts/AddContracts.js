import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useFetch from 'use-http'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { toast } from 'react-toastify'
import SearchableSelect from 'src/components/SearchableSelect'
import { useParams } from 'react-router-dom'
import { format_react_select } from 'src/services/CommonFunctions'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { cilDelete, cilNoteAdd, freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const THEME_COLOR = '#00bfcc'
const labelStyle = { fontWeight: 600, color: '#1f2933' }
const cardStyle = {
  background: '#f8fafc',
  border: '1px solid #eef1f5',
  borderRadius: '14px',
  padding: '18px',
}

function SectionTitle({ children }) {
  return (
    <div className="d-flex align-items-center mb-3" style={{ gap: '8px' }}>
      <span
        style={{ width: '4px', height: '18px', background: THEME_COLOR, borderRadius: '2px' }}
      />
      <h6 className="mb-0" style={{ fontWeight: 700, color: '#1f2933' }}>
        {children}
      </h6>
    </div>
  )
}

SectionTitle.propTypes = {
  children: PropTypes.node,
}

export default function AllocateUnit({ unitId, unitNo, after_submit }) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm()
  const { post, get, response } = useFetch()
  const [temp_base64, setTemp_base64] = useState([])
  const [residents, setResidents] = useState([])
  const [units, setUnits] = useState([])
  const [visible, setVisible] = useState(false)
  const [submitLoader, setSubmitLoader] = useState(false)
  const { propertyId } = useParams()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'documents_attributes',
  })

  useEffect(() => {
    if (visible) {
      loadInitialResidents()
      loadInitalUnits()
    }
  }, [visible])

  useEffect(() => {
    setValue('documents_attributes', [{ name: '', description: '', file: { data: '' } }])
  }, [setValue])

  async function loadInitialResidents() {
    const initialResidents = await get(`/v1/admin/members?limit=-1`)

    if (response.ok && initialResidents.data) {
      setResidents(
        initialResidents.data.map((m) => ({
          value: m.id,
          label: [m.first_name, m.last_name].filter(Boolean).join(' ').trim() || '—',
          email: (m.email || '').trim(),
        })),
      )
    } else {
      toast.error('Unable to load residents')
    }
  }

  async function loadInitalUnits() {
    const initialUnits = await get(`/v1/admin/premises/properties/${propertyId}/units?limit=-1`)
    if (response.ok && initialUnits.data) {
      setUnits(format_react_select(initialUnits.data, ['id', 'unit_no']))
    } else {
      toast.error('Unable to load units')
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

  function removeEmptyDocuments(payload) {
    const documents = payload.documents_attributes
    payload.documents_attributes = documents.filter((doc) => {
      return doc.name !== '' || doc.description !== '' || doc.file.data != undefined
    })

    return payload
  }

  async function onSubmit(data) {
    setSubmitLoader(true)
    const assigned_resident_data =
      data?.resident_ids?.length > 0 ? data.resident_ids.map((element) => element.value) : []

    temp_base64.map((x, index) => setValue(`documents_attributes.${index}.file.data`, x))
    data.documents_attributes.map((element, index) => (element.file.data = temp_base64[index]))

    const processed_data = removeEmptyDocuments(data)
    const body = { ...processed_data, resident_ids: assigned_resident_data }
    const selectedUnitId = unitId || watch('unit_id')

    await post(`/v1/admin/premises/properties/${propertyId}/units/${selectedUnitId}/allotment`, {
      allotment: body,
    })

    if (response.ok) {
      toast.success('Contract added successfully')
      reset()
      after_submit()
      setSubmitLoader(false)
      setVisible(false)
      setTemp_base64([])
    } else {
      setSubmitLoader(false)
      toast.error(response.data?.message || 'Unknown Error')
    }
  }

  function handleClose() {
    setVisible(false)
    setTemp_base64([])
    reset()
  }

  function openModal() {
    setVisible(true)
  }

  return (
    <>
      <button
        type="button"
        className="btn d-flex align-items-center"
        onClick={openModal}
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
        Add Contract
      </button>

      <Modal
        show={visible}
        onHide={handleClose}
        centered
        size="xl"
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
                  Add Contract
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  Allot a unit and assign residents
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px' }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ ...cardStyle, marginBottom: '16px' }}>
              <SectionTitle>Contract Details</SectionTitle>
              <Row className="g-3">
                <Col md={12}>
                  {unitNo ? (
                    <div className="mb-2" style={{ color: '#495057' }}>
                      <span style={labelStyle}>Unit No: </span>
                      {unitNo}
                    </div>
                  ) : null}
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Unit <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Controller
                      name="unit_id"
                      render={({ field }) => (
                        <SearchableSelect
                          {...field}
                          options={units}
                          value={units.find((c) => c.value === field.value) ?? null}
                          onChange={(val) => field.onChange(val?.value ?? null)}
                          placeholder="Search or select unit number"
                          className="basic-multi-select"
                          classNamePrefix="select"
                          isMulti={false}
                        />
                      )}
                      control={control}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>
                      Resident <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Controller
                      name="resident_ids"
                      render={({ field }) => (
                        <SearchableSelect
                          isMulti
                          type="text"
                          className="basic-multi-select"
                          classNamePrefix="select"
                          {...field}
                          options={residents}
                          searchKeys={['email']}
                          placeholder="Search residents by name or email"
                          formatOptionLabel={(option) => (
                            <span>
                              {option.label}
                              {option.email ? (
                                <small className="text-muted ms-1">({option.email})</small>
                              ) : null}
                            </span>
                          )}
                        />
                      )}
                      control={control}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Allocation Date</Form.Label>
                    <Form.Control required type="date" {...register('allotment_date')} />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={labelStyle}>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Notes"
                      style={{ resize: 'none' }}
                      {...register('notes')}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div style={cardStyle}>
              <SectionTitle>Documents</SectionTitle>

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
                        <Form.Label style={labelStyle}>Document Name</Form.Label>
                        <Form.Control
                          placeholder="Name"
                          type="text"
                          {...register(`documents_attributes.${index}.name`, {
                            validate: (value) => {
                              const fileValue = watch(`documents_attributes.${index}.file.data`)
                              if (fileValue && !value?.trim()) {
                                return 'Document name is required'
                              }
                              return true
                            },
                          })}
                        />
                        {errors?.documents_attributes?.[index]?.name && (
                          <small className="text-danger d-block" style={{ marginTop: '4px' }}>
                            {errors.documents_attributes[index].name.message}
                          </small>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={labelStyle}>Document</Form.Label>
                        <Form.Control
                          type="file"
                          accept=".jpg, .jpeg, .png"
                          {...register(`documents_attributes.${index}.file.data`)}
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
                          {...register(`documents_attributes.${index}.description`)}
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
                disabled={submitLoader}
                style={{
                  background: THEME_COLOR,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                }}
              >
                {submitLoader ? 'Submitting...' : 'Submit'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

AllocateUnit.propTypes = {
  unitId: PropTypes.number,
  unitNo: PropTypes.string,
  after_submit: PropTypes.func,
}
