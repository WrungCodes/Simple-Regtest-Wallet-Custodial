export const response = (response, errorCode, data) => {
  return response.status(errorCode).json(data)
}
