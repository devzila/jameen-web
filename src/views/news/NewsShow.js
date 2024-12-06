import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchData } from '../shared/GetData'

function NewsShow() {
  const { postId } = useParams()

  return (
    <>
      <div>
        <p>hi</p>
      </div>
    </>
  )
}
export default NewsShow
