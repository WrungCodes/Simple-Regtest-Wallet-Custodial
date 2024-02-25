export default function assetRepository (dbRepository) {
  const findByType = async (type) => dbRepository.findManyBy('type', type)
  const findById = async (id) => dbRepository.findById(id)
  const add = async (asset) => dbRepository.insert(asset)

  return Object.freeze({
    findByType,
    findById,
    add
  })
}
