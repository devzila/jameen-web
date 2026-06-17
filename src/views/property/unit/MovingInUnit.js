import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useFetch from 'use-http'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { toast } from 'react-toastify'
import SearchableSelect from 'src/components/SearchableSelect'
import { useParams } from 'react-router-dom'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { cilDelete, cilNoteAdd, freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { removeEmptyDocuments } from 'src/services/CommonFunctions'

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

export default function MovingInUnit({ unitNo, unitId, after_submit }) {
  const { register, handleSubmit, setValue, control, watch, reset } = useForm()
  const { post, get, response } = useFetch()
  const [temp_base64, setTemp_base64] = useState([])
  const [vacantUnits, setVacantUnit] = useState([])
  const [unit_id, setUnit_id] = useState(null)

  const [residents, setResidents] = useState([])
  const [errors, setErrors] = useState([])

  const [visible, setVisible] = useState(false)
  const [submitLoader, setSubmitLoader] = useState(false)

  const { propertyId } = useParams()

  //dynamic form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'documents_attributes',
  })

  //useEffext — load when modal opens; units list only when user must pick a unit (no unitNo)
  useEffect(() => {
    if (!visible || !propertyId) {
      return undefined
    }
    let cancelled = false
    const load = async () => {
      if (!unitNo) {
        await loadVacantUnits()
        if (cancelled) return
      }
      await loadInitialResidents()
    }
    load()
    return () => {
      cancelled = true
    }
  }, [visible, propertyId, unitNo])

  //resident api call

  async function loadInitialResidents() {
    let endpoint = `/v1/admin/members?limit=-1`

    const initialResidents = await get(endpoint)

    if (response.ok) {
      if (initialResidents.data) {
        setResidents(trimResidents(initialResidents.data))
      }
    } else {
      toast.error('Unable to load residents')
    }
  }

  async function loadVacantUnits() {
    if (!propertyId) return
    const endpoint = `/v1/admin/premises/properties/${propertyId}/units?moving_in_eligible=true&limit=-1`
    const result = await get(endpoint)
    if (!response.ok) {
      setVacantUnit([])
      toast.error('Unable to load units')
      return
    }
    const rows = Array.isArray(result?.data) ? result.data : []
    setVacantUnit(
      rows.map((u) => ({
        value: u.id,
        label: String(u.unit_no ?? ''),
        buildingName: (u.building?.name || '').trim(),
      })),
    )
  }

  function trimResidents(obj) {
    return obj.map((element) => ({
      value: element.id,
      label: `${element.first_name || ''} ${element.last_name || ''}`.trim() || '—',
      email: (element.email || '').trim(),
    }))
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

  //initially append
  useEffect(() => {
    setValue('documents_attributes', [{ name: '', description: '', file: { data: '' } }])
  }, [setValue])

  //primary_resident

  const primary_resident_array = watch('resident_ids')
  if (primary_resident_array) {
    // setValue('primary_resident_ids', primary_resident_array?.[0]?.id)
  }

  //submit function

  async function onSubmit(data) {
    let updatedUnitId = undefined
    updatedUnitId = unitId || unit_id

    if (updatedUnitId == undefined) {
      toast.error('Please select a unit from the dropdown.')
      return
    }
    //resident array
    setSubmitLoader(true)
    const assigned_resident_data =
      data?.resident_ids?.length > 0 ? data.resident_ids.map((element) => element.value) : []

    //filestobase64
    temp_base64.map((x, index) => setValue(`documents_attributes.${index}.file.data`, x))

    data.documents_attributes.map((element, index) => (element.file.data = temp_base64[index]))

    const body = { ...data, resident_ids: assigned_resident_data }
    const processed_data = removeEmptyDocuments(body)

    await post(`/v1/admin/premises/properties/${propertyId}/units/${updatedUnitId}/moving_in`, {
      allotment: processed_data,
    })
    if (response.ok) {
      toast.success('Moved in successfully')
      reset()
      updatedUnitId = undefined
      after_submit()
      setSubmitLoader(false)
      setVisible(false)
      setUnit_id(null)
      setTemp_base64([])
    } else {
      setSubmitLoader(false)
      setErrors(response?.data)
      toast.error(response.data?.message || 'Unknown Error')
    }
  }

  function handlClose() {
    setVisible(false)
    setTemp_base64([])
    reset()
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
        Moving In
      </button>

      <Modal
        show={visible}
        onHide={handlClose}
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
                <CIcon icon={freeSet.cilHome} size="lg" />
              </div>
              <div className="d-flex flex-column">
                <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>
                  Moving In
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                  Register a resident moving into a unit
                </span>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '22px' }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ ...cardStyle, marginBottom: '16px' }}>
              <SectionTitle>Moving In Details</SectionTitle>
              <Row className="g-3">
                <Col md={12}>
                  {unitNo ? (
                    <div className="mb-2" style={{ color: '#495057' }}>
                      <span style={labelStyle}>Unit No: </span>
                      {unitNo}
                    </div>
                  ) : (
                    <Form.Group>
                      <Form.Label style={labelStyle}>
                        Unit <span style={{ color: '#e03131' }}>*</span>
                      </Form.Label>
                      <Controller
                        required
                        name="unit_id"
                        render={({ field }) => (
                          <SearchableSelect
                            {...field}
                            options={vacantUnits}
                            value={vacantUnits?.find((c) => c.value === field.value) ?? null}
                            onChange={(val) => {
                              field.onChange(val?.value ?? null)
                              setUnit_id(val?.value ?? null)
                            }}
                            placeholder="Search or select unit number"
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isMulti={false}
                            searchKeys={['buildingName']}
                            formatOptionLabel={(option) => (
                              <span>
                                {option.label}
                                {option.buildingName ? (
                                  <small className="text-muted ms-1">({option.buildingName})</small>
                                ) : null}
                              </span>
                            )}
                          />
                        )}
                        control={control}
                      />
                    </Form.Group>
                  )}
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
                    <Form.Label style={labelStyle}>
                      Primary Resident <span style={{ color: '#e03131' }}>*</span>
                    </Form.Label>
                    <Controller
                      name="primary_resident_id"
                      render={({ field }) => (
                        <SearchableSelect
                          {...field}
                          options={
                            Array.isArray(primary_resident_array) ? primary_resident_array : []
                          }
                          value={
                            Array.isArray(primary_resident_array)
                              ? primary_resident_array.find((c) => c.value === field.value) ?? null
                              : null
                          }
                          onChange={(val) => field.onChange(val?.value ?? null)}
                          placeholder="Search or select primary resident"
                          className="basic-multi-select"
                          classNamePrefix="select"
                          isMulti={false}
                          searchKeys={['email']}
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
                    <Form.Label style={labelStyle}>Moving In Date</Form.Label>
                    <Form.Control required type="date" {...register('moving_in_date')} />
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
                          {...register(`documents_attributes.${index}.name`)}
                        />
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
                onClick={handlClose}
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
MovingInUnit.propTypes = {
  unitId: PropTypes.string,
  unitNo: PropTypes.string,
  after_submit: PropTypes.func,
}
