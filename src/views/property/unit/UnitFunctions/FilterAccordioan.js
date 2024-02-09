import React from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilSync, freeSet } from '@coreui/icons'

export default function FilterAccordion({ units_data }) {
  const { control } = useForm()
  units_data = []
  return (
    <div>
      <Dropdown data-bs-theme="light" autoClose={false}>
        <Dropdown.Toggle
          id="dropdown-button-light-example1"
          variant="secondary"
          className="mx-2 pe-5  text-start"
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
          className="p-2"
          style={{
            borderRadius: '0px',
            border: '0px',
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 12px',
            width: '400px',
          }}
          variant="success"
        >
          <Dropdown.Item className="btn btn-teritary">
            <CIcon icon={cilSync} /> Reset Filter
          </Dropdown.Item>
          <Dropdown.Item className="btn btn-teritary" href="#/action-3">
            <label>Bedroom Number</label>

            <Controller
              name="unit_type_id"
              render={({ field }) => (
                <Select
                  type="text"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  {...field}
                  value={units_data.find((c) => c.value === field.value)}
                  onChange={(val) => field.onChange(val.value)}
                  options={units_data}
                />
              )}
              control={control}
            />
          </Dropdown.Item>
          <Dropdown.Item className="btn btn-teritary" href="#/action-3">
            <label>Unit Type</label>
            <Controller
              name="unit_type_id"
              render={({ field }) => (
                <Select
                  type="text"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  {...field}
                  value={units_data.find((c) => c.value === field.value)}
                  onChange={(val) => field.onChange(val.value)}
                  options={units_data}
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

FilterAccordion.propTypes = {
  units_data: PropTypes.array,
}
