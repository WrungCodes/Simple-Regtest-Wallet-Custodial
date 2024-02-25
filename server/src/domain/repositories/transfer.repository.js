export default function transferRepository (dbRepository) {
  const update = async (transfer) => dbRepository.update(transfer)
  const add = async (transfer) => dbRepository.insert(transfer)

  return Object.freeze({
    update,
    add
  })
}
