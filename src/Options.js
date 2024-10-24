import { toast } from 'react-toastify'
import React from 'react'

const options = {
  headers: {
    Accept: 'application/json',
    Test: '123',
  },
  interceptors: {
    // every time we make an http request, this will run 1st before the request is made
    // url, path and route are supplied to the interceptor
    // request options can be modified and must be returned
    request: async ({ options, url, path, route }) => {
      options.headers.Authorization = localStorage.getItem('token')
      return options
    },

    // every time we make an http request, before getting the response back, this will run
    response: async ({ response, abort }) => {
      const environment = process.env.NODE_ENV
      if (
        (response.status != 404 && response.status >= 400 && response.status < 420) ||
        response.status == 500
      ) {
        toast.dismiss()
        toast.error(
          <div>
            {response.status == 500 ? (
              <div>
                <div>{response.data.error} </div>
                <div>{environment == 'development' ? response.data.exception : null}</div>
              </div>
            ) : (
              <>
                <h2>Session expired</h2>
                <p>Please login again to continue!</p>
                <button
                  className="btn btn-primary"
                  style={{ width: '200px', borderRadius: '3px' }}
                  onClick={() => {
                    window.location.reload()
                    localStorage.clear()
                    sessionStorage.clear()
                  }}
                >
                  Login
                </button>
              </>
            )}
          </div>,
          {
            autoClose: response.status == 500,
            closeOnClick: response.status == 500,
            pauseOnHover: false,
            draggable: false,
          },
        )
      }
      return response
    },
  },
  cachePolicy: 'no-cache',
}

export default options
