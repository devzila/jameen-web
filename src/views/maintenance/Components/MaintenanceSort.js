import React, { useEffect, useState } from 'react'
import { Dropdown, Form } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilSync, freeSet } from '@coreui/icons'

const THEME_COLOR = '#00bfcc'
const labelStyle = { fontSize: '12px', color: '#8a94a6', fontWeight: 600 }

export default function MaintenanceSort({ filter_callback }) {
  const [status_query, setStatus_query] = useState('')
  const [order, setOrder] = useState('')

  const [visible_, setVisible_] = useState(true)

  useEffect(() => {
    queries_function()
  }, [status_query, order])

  const { control, watch, reset, setValue } = useForm()

  const sort_array = [
    { value: 'title', label: 'Title' },
    { value: 'priority', label: 'Priority' },
    { value: 'created_at', label: 'Date Created' },
  ]

  const order_array = [
    { value: '+asc', label: 'Ascending' },
    { value: '+desc', label: 'Descending' },
  ]
  const handle_reset = () => {
    setValue('sort_by', null)
    setValue('order', null)
    setOrder(null)
    setStatus_query(null)
  }

  const handleunit_status = (val) => {
    setValue('sort_by', watch('sort_by')?.value)

    const query = `&q[s]=${val.value}`
    setStatus_query(query)
  }

  const handleOrder = (val) => {
    setValue('order', watch('order')?.value)

    const query = val.value
    setOrder(query)
  }

  const queries_function = () => {
    filter_callback(status_query + order)
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
          <CIcon icon={freeSet.cilSortAlphaDown} size="sm" />
          Sort
        </Dropdown.Toggle>

        <Dropdown.Menu
          renderOnMount
          popperConfig={{ strategy: 'fixed' }}
          style={{
            minWidth: '260px',
            padding: '16px',
            border: '1px solid #eef1f5',
            borderRadius: '12px',
            boxShadow: '0 6px 24px rgba(0,0,0,.08)',
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontWeight: 700, color: '#1f2933' }}>Sort</span>
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
            <Form.Label style={labelStyle}>Sort By</Form.Label>
            <Controller
              name="sort_by"
              render={({ field }) => (
                <Select
                  type="text"
                  className="basic-single"
                  classNamePrefix="select"
                  {...field}
                  onChange={(val) => handleunit_status(val)}
                  options={sort_array}
                />
              )}
              control={control}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label style={labelStyle}>Order</Form.Label>
            <Controller
              name="order"
              render={({ field }) => (
                <Select
                  type="text"
                  className="basic-single"
                  classNamePrefix="select"
                  {...field}
                  onChange={(val) => handleOrder(val)}
                  options={order_array}
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
MaintenanceSort.propTypes = {
  filter_callback: PropTypes.func,
  units_type: PropTypes.array,
}
