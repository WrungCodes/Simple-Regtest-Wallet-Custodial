import transferRepository from '../../../../src/domain/repositories/transfer.repository'

describe('transferRepository', () => {
  let mockRepository
  let repo

  beforeEach(() => {
    mockRepository = {
      update: jest.fn(),
      insert: jest.fn()
    }
    repo = transferRepository(mockRepository)
  })

  it('update calls repository with correct parameters', async () => {
    const transfer = { id: 1 }
    await repo.update(transfer)
    expect(mockRepository.update).toHaveBeenCalledWith(transfer)
  })

  it('add calls repository with correct parameters', async () => {
    const transfer = { id: 1 }
    await repo.add(transfer)
    expect(mockRepository.insert).toHaveBeenCalledWith(transfer)
  })
})
