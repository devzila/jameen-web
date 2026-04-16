import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilSync, freeSet } from '@coreui/icons'
import { format_react_select } from 'src/services/CommonFunctions'
import { useFetch } from 'use-http'
import { Dropdown, Button, Form, Row, Col } from 'react-bootstrap'
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
      <Dropdown data-bs-theme="light" className="d-flex" autoClose="outside">
        <Dropdown.Toggle
          id=" d-inline mx-2"
          variant="secondary"
          className="ms-2 text-start h-100 w-100"
          style={{
            backgroundColor: 'white',
            width: '15vw',
            border: '1px solid #00bfcc',
            borderRadius: '2px',
          }}
        >
          <CIcon icon={freeSet.cilFilter} />
          Filter
        </Dropdown.Toggle>

        <Dropdown.Menu
          className="p-2 border-0 rounded-0"
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 12px',
            width: '20vw',
          }}
          variant="success"
        >
          {/* <Dropdown.Item className="btn btn-teritary"> */}
          <button
            style={{
              border: '0px',
              float: 'left',
              background: 'initial',
            }}
            onClick={handle_reset}
          >
            <CIcon icon={cilSync} /> Reset Filter
          </button>
          {/* </Dropdown.Item> */}
          <Dropdown.Item className="btn btn-teritary mt-2" href="#/action-3">
            <label>Request Status</label>

            <Controller
              name="request_type"
              render={({ field }) => (
                <Select
                  type="text"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  {...field}
                  onChange={(val) => handle_request(val)}
                  options={request_type}
                />
              )}
              control={control}
            />
          </Dropdown.Item>
          <Dropdown.Item className="btn btn-teritary" href="#/action-3">
            <label>Category</label>
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
          </Dropdown.Item>
          <Dropdown.Item className="btn btn-teritary" href="#/action-3">
            <Form.Group>
              <label>Created at from</label>
              <Form.Control
                type="date"
                onChange={(val) => handleDateChange(val)}
                {...register('created_at_from')}
              ></Form.Control>
            </Form.Group>
          </Dropdown.Item>
          <Dropdown.Item className="btn btn-teritary" href="#/action-3">
            <Form.Group>
              <label>Created at to</label>
              <Form.Control
                type="date"
                {...register('created_at_to')}
                onChange={(val) => handleDateChange(val)}
              ></Form.Control>
            </Form.Group>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
MaintenanceaFilter.propTypes = {
  filter_callback: PropTypes.func,
  units_type: PropTypes.array,
}
