import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

/**
 * react-select with typing-to-filter (datalist-like) behavior.
 * By default, filters options by `label` plus any `searchKeys` on each option
 * (e.g. `email`, `phone_number`). Pass a custom `filterOption` to override.
 *
 * @example
 * <SearchableSelect options={opts} searchKeys={['email']} isMulti {...field} />
 */
function optionSearchText(option, searchKeys) {
  const data = option.data != null ? option.data : option
  const label = typeof data.label === 'string' ? data.label : String(data.label ?? '')
  const parts = [label]
  for (const key of searchKeys) {
    const v = data[key]
    if (v != null && String(v).trim() !== '') {
      parts.push(String(v))
    }
  }
  return parts.join(' ').toLowerCase()
}

function defaultFilterOption(option, rawInput, searchKeys) {
  const input = (rawInput || '').trim().toLowerCase()
  if (!input) return true
  return optionSearchText(option, searchKeys).includes(input)
}

const SearchableSelect = forwardRef(function SearchableSelect(
  { searchKeys = [], filterOption, ...rest },
  ref,
) {
  const resolvedFilter =
    filterOption || ((option, input) => defaultFilterOption(option, input, searchKeys))

  return <Select ref={ref} isSearchable filterOption={resolvedFilter} {...rest} />
})

SearchableSelect.propTypes = {
  /** Extra option fields to match against the typed query (in addition to label). */
  searchKeys: PropTypes.arrayOf(PropTypes.string),
  filterOption: PropTypes.func,
}

export default SearchableSelect
