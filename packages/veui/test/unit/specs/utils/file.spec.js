import { createFileList } from '@/utils/file'

describe('utils/bom', () => {
  it('should create FileList correctly', () => {
    let mockFile = new File([''], 'a.jpg')
    let mockFile2 = new File([''], 'b.jpg')

    let files = createFileList(mockFile)
    expect(files).to.be.a('FileList')
    expect(files.item(0)).to.equal(mockFile)

    files = createFileList([mockFile, mockFile2])
    expect(files.length).to.equal(2)
    expect(files[1]).to.equal(mockFile2)
  })
})
