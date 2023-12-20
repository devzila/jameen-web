import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Search = ({ listener }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = () => {
    listener(searchTerm)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search by property name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      &nbsp;<button onClick={handleSearch}>Search</button>
    </div>
  )
}

Search.propTypes = {
  listener: PropTypes.func,
}

export default Search
