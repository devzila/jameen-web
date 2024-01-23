export function formatdate(date) {
  {
    return date?.replace('T', ' ')?.replace('Z', ' ').slice(0, 19)
  }
}
