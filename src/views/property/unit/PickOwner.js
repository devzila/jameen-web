function PickOwner(resObj) {
  const ownerMatch = resObj.filter((curRes) => {
    return curRes.association_type == 'owner'
  })
  const ownerName =
    ownerMatch.length > 0
      ? ownerMatch[0].resident.first_name + ' ' + ownerMatch[0].resident.last_name
      : ''

  const residentMatch = resObj.filter((curRes) => {
    return curRes.association_type == 'primary_resident'
  })
  const residentName =
    residentMatch.length > 0
      ? residentMatch[0].resident.first_name + ' ' + residentMatch[0].resident.last_name
      : ''
  return ownerName + '/' + residentName
}

export default PickOwner
