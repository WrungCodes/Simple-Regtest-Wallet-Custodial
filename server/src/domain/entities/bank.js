export default function Bank (id, accountId, userId, accessToken, itemId) {
  return Object.freeze({
    id,
    accountId,
    userId,
    accessToken,
    itemId
  })
}
