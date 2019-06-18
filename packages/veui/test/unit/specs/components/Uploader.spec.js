import { mount } from '@vue/test-utils'
import Uploader from '@/components/Uploader'

describe('components/Uploader', () => {
  it('should handle value prop with `null` value.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        value: null,
        action: '/upload'
      }
    })

    expect(wrapper.vm.$data.fileList).to.eql([])
    wrapper.destroy()
  })

  it('should handle value of object type correctly.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        value: { name: 'test.jpg', src: '/test.jpg' },
        action: '/upload'
      }
    })

    expect(wrapper.vm.$data.fileList).to.eql([
      { name: 'test.jpg', src: '/test.jpg' }
    ])
    wrapper.destroy()
  })

  it('should transparently pass-through attrs to the <input> element.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        name: 'filedata',
        accept: 'jpg,jpeg,png'
      }
    })

    let input = wrapper.find('input[type="file"]')
    expect(input.attributes('name')).to.equal('filedata')
    expect(input.attributes('accept')).to.equal('jpg,jpeg,png')
    wrapper.destroy()
  })

  it('should validate file size correctly.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        maxSize: 5000
      }
    })

    expect(wrapper.vm.validateFileSize(6000)).to.equal(false)

    wrapper.setProps({ maxSize: '20mb' })
    expect(wrapper.vm.validateFileSize(20 * 1024 * 1024 + 1)).to.equal(false)
    expect(wrapper.vm.validateFileSize(20 * 1024 * 1024 - 1)).to.equal(true)

    wrapper.setProps({ maxSize: undefined })
    expect(wrapper.vm.validateFileSize(10000)).to.equal(true)
    wrapper.destroy()
  })

  it('should validate file tyle correctly.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        accept: 'jpg,.png,.gif'
      }
    })

    expect(wrapper.vm.validateFileType('test.1.gif')).to.equal(true)
    expect(wrapper.vm.validateFileType('test.1.txt')).to.equal(false)

    wrapper.setProps({ accept: 'image/*,.xlsx,.pdf' })
    expect(wrapper.vm.validateFileType('test2.gif')).to.equal(true)
    expect(wrapper.vm.validateFileType('test2.jpg')).to.equal(true)
    expect(wrapper.vm.validateFileType('test.2.pdf')).to.equal(true)
    expect(wrapper.vm.validateFileType('test.2.ppt')).to.equal(false)

    wrapper.setProps({ accept: undefined })
    expect(wrapper.vm.validateFileType('test.3.ppt')).to.equal(true)
    wrapper.destroy()
  })

  it('should emit `statuschange` event when status is changed.', async () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload'
      }
    })

    // 不能直接给input[type="file"]元素直接设置value，所以直接改data变量模拟上传后的过程
    wrapper.vm.$data.fileList = [{ name: 't.jpg', status: 'uploading' }]
    expect(wrapper.emitted().statuschange[0][0]).to.equal('uploading')

    wrapper.vm.$data.fileList[0].status = 'success'
    expect(wrapper.emitted().statuschange[1][0]).to.equal('success')

    wrapper.vm.$data.fileList.push({ name: 't2.jpg', status: 'uploading' })
    expect(wrapper.emitted().statuschange[2][0]).to.equal('uploading')
    wrapper.destroy()
  })

  it('should handle callback correctly when upload is finished.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        value: [
          { name: 'test1.jpg', src: '/test1.jpg', id: 5 }
        ]
      }
    })

    let newFile = { name: 'test2.jpg', status: 'uploading' }
    wrapper.vm.$data.fileList.push(newFile)
    let callbackData = { src: '/test2.jpg', id: 6, success: true }
    wrapper.vm.uploadCallback(callbackData, newFile)

    expect(wrapper.emitted().change[0][0]).to.eql([
      { name: 'test1.jpg', src: '/test1.jpg', id: 5 },
      { name: 'test2.jpg', src: '/test2.jpg', id: 6 }
    ])
    expect(wrapper.emitted().success[0]).to.eql([{
      name: 'test2.jpg', src: '/test2.jpg', id: 6, status: 'success'
    }, 1])

    newFile = { name: 'test3.jpg', status: 'uploading' }
    wrapper.vm.$data.fileList.push(newFile)
    callbackData = { success: false, message: 'image too large' }
    wrapper.vm.uploadCallback(callbackData, newFile)
    expect(wrapper.emitted().failure[0]).to.eql([{
      name: 'test3.jpg', status: 'failure'
    }, 2])
    wrapper.destroy()
  })

  it('should handle `remove` event correctly.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        value: [
          { name: 'test1.jpg', src: '/test1.jpg' },
          { name: 'test2.jpg', src: '/test2.jpg' }
        ]
      }
    })

    wrapper.findAll('.veui-uploader-button-remove').at(1).trigger('click')
    expect(wrapper.emitted().remove[0]).to.eql([
      { name: 'test2.jpg', src: '/test2.jpg' },
      1
    ])
    expect(wrapper.emitted().change[0][0]).to.eql([
      { name: 'test1.jpg', src: '/test1.jpg' }
    ])
    wrapper.destroy()
  })

  it('should be disabled when number of files reach max count.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        value: [
          { name: 'test1.jpg', src: '/test1.jpg' },
          { name: 'test2.jpg', src: '/test2.jpg' }
        ],
        maxCount: 2
      }
    })

    let input = wrapper.find('input[type="file"]')
    expect(input.attributes('disabled')).to.equal('disabled')

    wrapper.find('.veui-uploader-button-remove').trigger('click')
    expect(input.attributes('disabled')).to.equal(undefined)
    wrapper.destroy()
  })

  it('should set src of image correctly when type is image.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        value: [
          { name: 'test1.jpg', src: '/test1.jpg' },
          { name: 'test2.jpg', src: '/test2.jpg' }
        ],
        type: 'image'
      }
    })

    let images = wrapper.findAll('img')
    expect(images.at(0).attributes('src')).to.equal('/test1.jpg')
    expect(images.at(1).attributes('src')).to.equal('/test2.jpg')
    wrapper.destroy()
  })

  it('should render desc slot correctly.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload'
      },
      slots: {
        desc: 'jpg only.'
      }
    })

    expect(wrapper.find('.veui-uploader-tip').text()).to.equal('jpg only.')
    wrapper.destroy()
  })

  it('should render button label slot correctly.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload'
      },
      slots: {
        'button-label': '<span class="test-label">upload</span>'
      }
    })

    expect(wrapper.find('.test-label').text()).to.equal('upload')
    wrapper.destroy()
  })

  it('should render file-before file-after slot correctly.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        value: [
          { name: 'test1.jpg', src: '/test1.jpg' },
          { name: 'test2.jpg', src: '/test2.jpg' }
        ]
      },
      scopedSlots: {
        'file-before': '<p class="test-file-before" slot-scope="file">{{ file.index + 1 }}</p>',
        'file-after': '<p class="test-file-after" slot-scope="file">{{ file.src }}</p>'
      }
    })

    let before = wrapper.findAll('.test-file-before')
    expect(before.at(0).text()).to.equal('1')
    expect(before.at(1).text()).to.equal('2')
    let after = wrapper.findAll('.test-file-after')
    expect(after.at(0).text()).to.equal('/test1.jpg')
    expect(after.at(1).text()).to.equal('/test2.jpg')
    wrapper.destroy()
  })
})
