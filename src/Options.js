import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

const options = {
  headers: {
    Accept: 'application/json',
    Authorization: localStorage.getItem('token'),
    Test: '123',
  },
  interceptors: {
    // every time we make an http request, this will run 1st before the request is made
    // url, path and route are supplied to the interceptor
    // request options can be modified and must be returned
    request: async ({ options, url, path, route }) => {
      return options
    },

    // every time we make an http request, before getting the response back, this will run
    response: async ({ response, abort }) => {
      console.log(useLocation().pathname)
      if (response.status >= 400 && response.status < 500) {
        localStorage.clear()
        sessionStorage.clear()
        toast.error('Session Expired')
      }
      return response
    },
  },
  cachePolicy: 'no-cache',
}

export default options
