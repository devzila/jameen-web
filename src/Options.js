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
      const environment = process.env.NODE_ENV
      if (response.status != 404 && response.status >= 400 && response.status < 420) {
        toast.error('Session Expired')
        localStorage.clear()
        sessionStorage.clear()
        window.location.reload()
      }
      return response
    },
  },
  cachePolicy: 'no-cache',
}

export default options
