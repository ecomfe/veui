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

    expect(wrapper.vm.$data.fileList).to.deep.equal([])
    wrapper.destroy()
  })

  it('should handle value of object type correctly.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        value: { name: 'test.jpg', src: '/test.jpg' },
        action: '/upload'
      }
    })

    expect(wrapper.vm.$data.fileList).to.deep.equal([
      { name: 'test.jpg', src: '/test.jpg' }
    ])
    wrapper.destroy()
  })

  it('should transparently pass-through attrs to the <input> element.', async () => {
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

  it('should set action to form correctly when mode is iframe.', async () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        requestMode: 'iframe'
      }
    })

    wrapper.vm.submit({ name: 'test.jpg' })
    expect(wrapper.find('form').attributes('action')).to.equal('/upload')

    await wrapper.vm.$nextTick()
    wrapper.destroy()
  })

  it('should set payload to form correctly when mode is iframe.', async () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        requestMode: 'iframe',
        payload: {
          month: 7,
          day: 1
        }
      }
    })

    wrapper.vm.submit({ name: 'test.jpg' })

    let form = wrapper.find('form')

    let input = form.findAll('input').at(0)
    expect({
      value: input.element.value,
      name: input.attributes('name')
    }).to.deep.equal({ value: '7', name: 'month' })

    let input2 = form.findAll('input').at(1)
    expect({
      value: input2.element.value,
      name: input2.attributes('name')
    }).to.deep.equal({ value: '1', name: 'day' })

    await wrapper.vm.$nextTick()
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

    let input = wrapper.find('input[type="file"]')
    let dT = new DataTransfer()
    dT.items.add(new File(['foo'], 'test.jpg'))
    input.element.files = dT.files
    input.trigger('change')
    clearXHR(wrapper)
    expect(wrapper.emitted().statuschange[1][0]).to.equal('uploading')

    wrapper.vm.uploadCallback({ success: true }, dT.files[0])
    expect(wrapper.emitted().statuschange[2][0]).to.equal('success')

    dT = new DataTransfer()
    dT.items.add(new File(['foo'], 'test2.jpg'))
    input.element.files = dT.files
    input.trigger('change')
    clearXHR(wrapper)

    expect(wrapper.emitted().statuschange[3][0]).to.equal('uploading')
    wrapper.destroy()
  })

  it('should handle callback correctly when upload is finished.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        value: [{ name: 'test1.jpg', src: '/test1.jpg', id: 5 }]
      }
    })

    let input = wrapper.find('input[type="file"]')
    let dT = new DataTransfer()
    dT.items.add(new File(['foo'], 'test2.jpg'))
    input.element.files = dT.files
    input.trigger('change')
    clearXHR(wrapper)

    let callbackData = { src: '/test2.jpg', id: 6, success: true }
    wrapper.vm.uploadCallback(callbackData, dT.files[0])

    expect(wrapper.emitted().change[0][0]).to.deep.equal([
      { name: 'test1.jpg', src: '/test1.jpg', id: 5 },
      { name: 'test2.jpg', src: '/test2.jpg', id: 6 }
    ])
    expect(wrapper.emitted().success[0]).to.deep.equal([
      {
        name: 'test2.jpg',
        src: '/test2.jpg',
        id: 6,
        status: 'success'
      },
      1
    ])

    dT = new DataTransfer()
    dT.items.add(new File(['foo'], 'test3.jpg'))
    input.element.files = dT.files
    input.trigger('change')
    clearXHR(wrapper)

    callbackData = { success: false, message: 'image too large' }
    wrapper.vm.uploadCallback(callbackData, dT.files[0])

    expect(wrapper.emitted().failure[0]).to.deep.equal([
      {
        name: 'test3.jpg',
        status: 'failure'
      },
      2
    ])
    wrapper.destroy()
  })

  it('should handle post message callback correctly when iframe mode is post message.', async () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        requestMode: 'iframe',
        iframeMode: 'postmessage'
      }
    })

    let input = wrapper.find('input[type="file"]')
    let dT = new DataTransfer()
    dT.items.add(new File(['foo'], 'test.jpg'))
    input.element.files = dT.files
    input.trigger('change')
    clearXHR(wrapper)
    wrapper.vm.submit()

    await wrapper.vm.$nextTick()

    // 这里的iframe里调postMessage无法完全模拟真实环境，所以直接调message事件的回调函数
    wrapper.vm.handlePostmessage({
      source: {
        frameElement: {
          id: wrapper.vm.$data.iframeId
        }
      },
      origin: location.origin,
      data: { src: '/test.jpg', success: true }
    })

    expect(wrapper.emitted().change[0][0]).to.deep.equal([
      { name: 'test.jpg', src: '/test.jpg' }
    ])

    await wrapper.vm.$nextTick()
    wrapper.destroy()
  })

  it('should support custom upload function correctly.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        requestMode: 'custom',
        upload: (file, { onload, onprogress, onerror }) => {
          onload(file, { src: '/test.jpg', success: true })
        }
      }
    })

    let input = wrapper.find('input[type="file"]')
    let dT = new DataTransfer()
    dT.items.add(new File(['foo'], 'test.jpg'))
    input.element.files = dT.files
    input.trigger('change')

    expect(wrapper.emitted().change[0][0]).to.deep.equal([
      { name: 'test.jpg', src: '/test.jpg' }
    ])

    wrapper.destroy()
  })

  it('should parse callback data correctly.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        dataType: 'json'
      }
    })

    let callbackData = JSON.stringify({ src: '/test.jpg', id: '23' })
    expect(wrapper.vm.parseData(callbackData)).to.deep.equal({
      src: '/test.jpg',
      id: '23'
    })

    callbackData = { src: '/test.jpg', id: '23' }
    expect(wrapper.vm.parseData(callbackData)).to.deep.equal({
      src: '/test.jpg',
      id: '23'
    })

    wrapper.setProps({ dataType: 'text' })
    callbackData = 'callback text'
    expect(wrapper.vm.parseData(callbackData)).to.equal('callback text')

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

    wrapper
      .findAll('.veui-uploader-button-remove')
      .at(1)
      .trigger('click')
    expect(wrapper.emitted().remove[0]).to.deep.equal([
      { name: 'test2.jpg', src: '/test2.jpg' },
      1
    ])
    expect(wrapper.emitted().change[0][0]).to.deep.equal([
      { name: 'test1.jpg', src: '/test1.jpg' }
    ])
    wrapper.destroy()
  })

  it('should set request `withCredentials` correctly.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        withCredentials: false
      }
    })

    let fileList = [{ name: 'test.jpg' }]
    wrapper.vm.$data.fileList = fileList
    wrapper.vm.uploadFile(fileList[0])

    let xhr = fileList[0].xhr
    expect(xhr.withCredentials).to.equal(false)
    clearXHR(wrapper)
    wrapper.destroy()
  })

  it('should emit `progress` event when uploading.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload'
      }
    })

    let fileList = [{ name: 'test.jpg' }]
    wrapper.vm.$data.fileList = fileList
    wrapper.vm.uploadFile(fileList[0])

    // 模拟progress
    fileList[0].xhr.upload.onprogress({ loaded: 10, total: 100 })
    expect(wrapper.emitted().progress[0][1]).to.equal(0)
    clearXHR(wrapper)
    wrapper.destroy()
  })

  it('should handle cancel correctly.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        requestMode: 'iframe'
      }
    })

    wrapper.vm.$data.fileList = [{ name: 'test.jpg', status: 'uploading' }]

    wrapper
      .find('li')
      .find('button')
      .trigger('click')
    expect(wrapper.vm.$data.fileList).to.deep.equal([])
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

  it('should handle retry correctly.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload'
      }
    })

    wrapper.vm.$data.fileList = [{ name: 'test.jpg', status: 'failure' }]
    wrapper.find('.veui-uploader-list-retry').trigger('click')
    clearXHR(wrapper)

    expect(wrapper.vm.$data.fileList[0].status).to.equal('uploading')
    wrapper.destroy()
  })

  it('should handle replace correctly.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        value: [{ name: 'test.jpg', src: '/test.jpg' }],
        type: 'image'
      }
    })

    wrapper
      .find('li')
      .find('label')
      .trigger('click')

    let input = wrapper.find('input[type="file"]')
    let dT = new DataTransfer()
    dT.items.add(new File(['foo'], 'test2.jpg'))
    input.element.files = dT.files
    input.trigger('change')
    clearXHR(wrapper)

    let callbackData = { src: '/test2.jpg', success: true }
    wrapper.vm.uploadCallback(callbackData, dT.files[0])

    expect(wrapper.emitted().change[0][0]).to.deep.equal([])

    expect(wrapper.emitted().change[1][0]).to.deep.equal([
      { name: 'test2.jpg', src: '/test2.jpg' }
    ])

    wrapper.destroy()
  })

  it('should display upload progress correctly.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        progress: 'percent'
      }
    })

    wrapper.vm.$data.fileList = [
      { name: 'test.jpg', loaded: 300, total: 1000, status: 'uploading' }
    ]
    expect(wrapper.find('.veui-uploader-progress').text()).to.equal('30%')

    wrapper.setProps({ progress: 'detail' })
    expect(wrapper.find('.veui-uploader-progress').text()).to.equal(
      '300B/1000B'
    )

    wrapper.setProps({ progress: 'bar' })
    expect(
      wrapper.find('.veui-uploader-progress-bar').element.style.width
    ).to.equal('30%')

    wrapper.destroy()
  })

  it('should set callback function correctly when request mode is iframe.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload',
        requestMode: 'iframe',
        iframeMode: 'callback',
        callbackNamespace: 'testNameSpace'
      }
    })

    expect(window.testNameSpace).to.be.an('object')
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
        'file-before':
          '<p class="test-file-before" slot-scope="file">{{ file.index + 1 }}</p>',
        'file-after':
          '<p class="test-file-after" slot-scope="file">{{ file.src }}</p>'
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

function clearXHR (wrapper) {
  wrapper.vm.$data.fileList.forEach(file => {
    if (file.xhr) {
      file.xhr.abort()
    }
  })
}
