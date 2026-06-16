import React, { useEffect, useState } from 'react'
import { Dropdown, Form } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilSync, freeSet } from '@coreui/icons'

const THEME_COLOR = '#00bfcc'
const labelStyle = { fontSize: '12px', color: '#8a94a6', fontWeight: 600 }

export default function FilterAccordion({ units_type, filter_callback }) {
  const [status_query, setStatus_query] = useState('')
  const [unit_query, setUnit_query] = useState('')

  const [visible_, setVisible_] = useState(true)

  useEffect(() => {
    queries_function()
  }, [status_query, unit_query])

  const { control, watch, reset, setValue } = useForm()
  const unit_status = [
    { value: 1, label: 'Vacant' },
    { value: 2, label: 'Occupied' },
    { value: 0, label: 'Unallotted' },
  ]

  const handle_reset = () => {
    setValue('unit_status', null)
    setValue('unit_type_id', null)
    setUnit_query(null)
    setStatus_query(null)
  }

  const handleunit_status = (val) => {
    setValue('unit_status', watch('unit_status')?.value)

    const query = `&q[status_eq]=${val.value}`
    setStatus_query(query)
  }

  const handleunit_type = (val) => {
    setValue('unit_type_id', watch('unit_type_id')?.value)

    const query = `&q[unit_type_id_eq]=${val.value}`
    setUnit_query(query)
  }

  const queries_function = () => {
    filter_callback(unit_query + status_query)
    setVisible_(false)
  }

  return (
    <div>
      <Dropdown data-bs-theme="light" autoClose="outside">
        <Dropdown.Toggle
          as="button"
          type="button"
          className="btn d-flex align-items-center"
          style={{
            gap: '8px',
            background: '#f5f7fb',
            color: '#495057',
            border: 'none',
            borderRadius: '10px',
            height: '38px',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          <CIcon icon={freeSet.cilFilter} size="sm" />
          Filter
        </Dropdown.Toggle>

        <Dropdown.Menu
          renderOnMount
          popperConfig={{ strategy: 'fixed' }}
          style={{
            minWidth: '280px',
            padding: '16px',
            border: '1px solid #eef1f5',
            borderRadius: '12px',
            boxShadow: '0 6px 24px rgba(0,0,0,.08)',
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontWeight: 700, color: '#1f2933' }}>Filter</span>
            <button
              type="button"
              className="d-inline-flex align-items-center border-0"
              style={{
                gap: '5px',
                background: 'initial',
                color: THEME_COLOR,
                fontWeight: 600,
              }}
              onClick={handle_reset}
            >
              <CIcon icon={cilSync} size="sm" /> Reset
            </button>
          </div>

          <Form.Group className="mb-3">
            <Form.Label style={labelStyle}>Unit Status</Form.Label>
            <Controller
              name="unit_status"
              render={({ field }) => (
                <Select
                  type="text"
                  className="basic-single"
                  classNamePrefix="select"
                  {...field}
                  onChange={(val) => handleunit_status(val)}
                  options={unit_status}
                />
              )}
              control={control}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label style={labelStyle}>Unit Type</Form.Label>
            <Controller
              name="unit_type_id"
              render={({ field }) => (
                <Select
                  type="text"
                  className="basic-single"
                  classNamePrefix="select"
                  {...field}
                  onChange={(val) => handleunit_type(val)}
                  options={units_type}
                />
              )}
              control={control}
            />
          </Form.Group>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

FilterAccordion.propTypes = {
  filter_callback: PropTypes.func,
  units_type: PropTypes.array,
}
