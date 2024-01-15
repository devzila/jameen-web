export const loadMetaData = () => {
  fetch(`${process.env.REACT_APP_API_URL}/v1/admin/options`)
    .then((res) => res.json())
    .then((data) => localStorage.setItem('meta', JSON.stringify(data)))
}
