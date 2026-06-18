import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilSync, freeSet } from '@coreui/icons'
import { format_react_select } from 'src/services/CommonFunctions'
import { useFetch } from 'use-http'
import { Dropdown } from 'react-bootstrap'

const THEME_COLOR = '#00bfcc'
const labelStyle = { fontWeight: 600, color: '#1f2933', fontSize: '13px' }

export default function ResidentFIlters({ filter_callback }) {
  const [gender_query, setGenderQuery] = useState('')
  const [property_query, setPropertyQuery] = useState('')
  const [property_array, setPropertyArray] = useState([])
  const [hasActiveFilter, setHasActiveFilter] = useState(false)

  const { get, response } = useFetch()
  const { control, watch, setValue } = useForm()

  const gender_type = [
    { value: 0, label: 'Male' },
    { value: 1, label: 'Female' },
    { value: 2, label: 'Other' },
  ]

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    filter_callback(gender_query + property_query)
    setHasActiveFilter(Boolean(gender_query || property_query))
  }, [gender_query, property_query])

  const handle_reset = () => {
    setValue('gender_val', null)
    setValue('property_select', null)
    setGenderQuery('')
    setPropertyQuery('')
  }

  const handle_property = (val) => {
    if (!val) {
      setPropertyQuery('')
      return
    }
    setPropertyQuery(`&q[property_id_eq]=${val.value}`)
  }

  const handle_gender = (val) => {
    if (!val) {
      setGenderQuery('')
      return
    }
    setGenderQuery(`&q[gender_eq]=${val.value}`)
  }

  async function fetchProperties() {
    const initialProperties = await get(`/v1/admin/premises/properties?limit=-1`)
    if (response.ok) {
      setPropertyArray(format_react_select(initialProperties.data, ['id', 'name']))
    }
  }

  return (
    <Dropdown align="end" autoClose="outside" className="resident-filter-dropdown">
      <Dropdown.Toggle
        as="button"
        type="button"
        className="btn d-flex align-items-center"
        style={{
          gap: '6px',
          background: hasActiveFilter ? 'rgba(0,191,204,0.12)' : '#f5f7fb',
          color: hasActiveFilter ? THEME_COLOR : '#495057',
          border: '1px solid #eef1f5',
          borderRadius: '10px',
          height: '38px',
          padding: '0 12px',
          fontWeight: 600,
          fontSize: '13px',
          flexShrink: 0,
        }}
      >
        <CIcon icon={freeSet.cilFilter} size="sm" />
        Filter
      </Dropdown.Toggle>

      <Dropdown.Menu
        renderOnMount
        popperConfig={{ strategy: 'fixed' }}
        style={{
          minWidth: '260px',
          padding: '14px',
          border: '1px solid #eef1f5',
          borderRadius: '12px',
          boxShadow: '0 6px 24px rgba(0,0,0,.08)',
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span style={{ fontWeight: 700, color: '#1f2933', fontSize: '14px' }}>Filters</span>
          <button
            type="button"
            className="btn btn-link p-0 d-flex align-items-center"
            style={{ gap: '4px', color: THEME_COLOR, fontSize: '13px', textDecoration: 'none' }}
            onClick={handle_reset}
          >
            <CIcon icon={cilSync} size="sm" />
            Reset
          </button>
        </div>

        <div className="mb-3">
          <label style={labelStyle}>Gender</label>
          <Controller
            name="gender_val"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isClearable
                className="basic-single"
                classNamePrefix="select"
                onChange={(val) => {
                  field.onChange(val)
                  handle_gender(val)
                }}
                options={gender_type}
                placeholder="All genders"
              />
            )}
          />
        </div>

        <div>
          <label style={labelStyle}>Property</label>
          <Controller
            name="property_select"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isClearable
                className="basic-single"
                classNamePrefix="select"
                onChange={(val) => {
                  field.onChange(val)
                  handle_property(val)
                }}
                options={property_array}
                placeholder="All properties"
              />
            )}
          />
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}

ResidentFIlters.propTypes = {
  filter_callback: PropTypes.func,
  units_type: PropTypes.array,
}
