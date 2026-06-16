import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilSync, freeSet } from '@coreui/icons'
import { format_react_select } from 'src/services/CommonFunctions'
import { useFetch } from 'use-http'
import { Dropdown, Form } from 'react-bootstrap'

const THEME_COLOR = '#00bfcc'
const labelStyle = { fontSize: '12px', color: '#8a94a6', fontWeight: 600 }

export default function MaintenanceaFilter({ units_type, filter_callback }) {
  const [request, setRequest] = useState('')
  const [category, setCategory] = useState('')
  const [maintenance_category, setMaintenanceCategory] = useState('')
  const [date_range, setDateRange] = useState('')

  const { get, response } = useFetch()

  const [visible_, setVisible_] = useState(true)

  useEffect(() => {
    queries_function()
    getMaintenanceCategories()
  }, [request, category, date_range])

  const { control, watch, reset, setValue, register } = useForm()

  const request_type = [
    { value: 0, label: 'Requested' },
    { value: 1, label: 'In Progress' },
    { value: 2, label: 'Cancelled' },
    { value: 3, label: 'Resolved' },
    { value: 4, label: 'Reopen' },
  ]

  const handle_reset = () => {
    setValue('category', null)
    setValue('request_type', null)
    setValue('created_at_from', null)
    setValue('created_at_to', null)
    setCategory(null)
    setRequest(null)
    setDateRange(null)
  }

  const handle_request = (val) => {
    setValue('category', watch('priority')?.value)

    const query = `&q[status_eq]=${val.value}`
    setRequest(query)
  }

  const handle_category = (val) => {
    setValue('request_type', watch('request_type')?.value)

    const query = `&q[category_id_eq]=${val.value}`
    setCategory(query)
  }

  const queries_function = () => {
    filter_callback(category + request + date_range)
    setVisible_(false)
  }

  const getMaintenanceCategories = async () => {
    const api = await get(`/v1/admin/maintenance/categories?limit=-1`)
    if (response.ok) {
      setMaintenanceCategory(format_react_select(api.data, ['id', 'name']))
    }
  }

  const handleDateChange = () => {
    const createdAtFrom = watch('created_at_from')
    const createdAtTo = watch('created_at_to')
    let queryString = ''
    if (createdAtFrom) {
      queryString += `&q[created_at_gteq]=${createdAtFrom}`
    }
    if (createdAtTo) {
      queryString += `&q[created_at_lteq]=${createdAtTo}`
    }
    setDateRange(queryString)
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
            minWidth: '300px',
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
            <Form.Label style={labelStyle}>Request Status</Form.Label>
            <Controller
              name="request_type"
              render={({ field }) => (
                <Select
                  type="text"
                  className="basic-single"
                  classNamePrefix="select"
                  {...field}
                  onChange={(val) => handle_request(val)}
                  options={request_type}
                />
              )}
              control={control}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={labelStyle}>Category</Form.Label>
            <Controller
              name="category"
              render={({ field }) => (
                <Select
                  type="text"
                  className="basic-single"
                  classNamePrefix="select"
                  {...field}
                  onChange={(val) => handle_category(val)}
                  options={maintenance_category}
                />
              )}
              control={control}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={labelStyle}>Created at from</Form.Label>
            <Form.Control
              type="date"
              onChange={(val) => handleDateChange(val)}
              {...register('created_at_from')}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label style={labelStyle}>Created at to</Form.Label>
            <Form.Control
              type="date"
              {...register('created_at_to')}
              onChange={(val) => handleDateChange(val)}
            />
          </Form.Group>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
MaintenanceaFilter.propTypes = {
  filter_callback: PropTypes.func,
  units_type: PropTypes.array,
}
