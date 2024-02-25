export default function Bank (id, service, userId, accessToken, itemId) {
  return Object.freeze({
    id,
    service,
    userId,
    accessToken,
    itemId
  })
}
