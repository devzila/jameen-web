import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilSync, freeSet } from '@coreui/icons'

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
    { value: 'date', label: 'Handover Date' },
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

    const query = `&sort=${val.value}`
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
    <div className="mx-2">
      <Dropdown data-bs-theme="light" className="d-flex" autoClose="outside">
        <Dropdown.Toggle
          id=" d-inline mx-4"
          variant="secondary"
          className="ms-2 text-start h-100 w-100"
          style={{
            backgroundColor: 'white',
            width: '15vw',
            border: '1px solid #00bfcc',
            borderRadius: '2px',
          }}
        >
          <CIcon icon={freeSet.cilSortAlphaDown} />
          Sort
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
            <label>Sort By</label>

            <Controller
              name="sort_by"
              render={({ field }) => (
                <Select
                  type="text"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  {...field}
                  onChange={(val) => handleunit_status(val)}
                  options={sort_array}
                />
              )}
              control={control}
            />
          </Dropdown.Item>
          <Dropdown.Item className="btn btn-teritary" href="#/action-3">
            <label>Order</label>
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
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
MaintenanceSort.propTypes = {
  filter_callback: PropTypes.func,
  units_type: PropTypes.array,
}
