import { pick, some } from 'lodash'
import { mount } from '@vue/test-utils'
import Uploader from '@/components/Uploader'
// import Dropdown from '@/components/Dropdown'
import { wait } from '../../../utils'
import { addOnceEventListener } from '@/utils/dom'
import 'veui-theme-dls-icons/check'
import 'veui-theme-dls-icons/crop'
import 'veui-theme-dls-icons/cut'

describe('components/Uploader', function () {
  it('should add files to list after choosing', async function () {
    let wrapper = mount(Uploader, {
      // 解决 Cannot read property '$scopedSlots' of undefined 的问题
      sync: false,
      attachToDocument: true,
      propsData: {
        value: null,
        action: '/upload/xhr',
        autoupload: false
      }
    })

    let promise = waitForEvent(wrapper.vm, 'statuschange')
    wrapper.vm.chooseFiles()

    let mockFiles = [
      createFile('力大无穷.png', 'image/png', 128 * 1024),
      createFile('千里眼，顺风耳.png', 'image/png', 128 * 1024)
    ]
    let input = wrapper.find('input[type="file"]')
    input.element.files = createFileList(mockFiles)
    input.trigger('change')

    await promise

    expect(wrapper.vm.fileList[0].native).to.equal(mockFiles[0])
    expect(wrapper.vm.fileList[1].native).to.equal(mockFiles[1])

    wrapper.destroy()
  })

  it('should handle value prop with `null` value.', function () {
    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        value: null,
        action: '/upload/xhr'
      }
    })

    expect(wrapper.vm.$data.fileList).to.eql([])
    wrapper.destroy()
  })

  it('should handle value of object type correctly.', function () {
    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        value: {
          _key_: 'op[ivxcsda',
          name: 'test.jpg',
          src: 'http://example.com/test.jpg'
        },
        action: '/upload/xhr',
        keyField: '_key_'
      }
    })

    let fileList = wrapper.vm.$data.fileList
    expect(fileList.length).to.equal(1)

    let internalFile = fileList[0]
    expect(internalFile.key).to.be.equal('op[ivxcsda')
    expect(internalFile.status).to.equal('success')
    expect(internalFile.type).to.equal('image')
    expect(internalFile.name).to.equal('test.jpg')
    expect(internalFile.src).to.equal('http://example.com/test.jpg')

    wrapper.destroy()
  })

  it('should handle external value updating correctly.', async function () {
    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        action: '/upload/xhr',
        attachToDocument: true,
        value: [
          {
            key: 'xxxx',
            name: '大娃.jpg',
            src: 'a.jpg'
          },
          {
            key: 'yyyy',
            name: '二娃.jpg',
            src: 'b.jpg'
          }
        ]
      }
    })

    await wait(0)
    expect(wrapper.vm.fileList.length).to.equal(2)

    // update, replace
    wrapper.setProps({
      value: [
        { name: '三娃.png', src: 'http://example.com/三娃.png' },
        { name: '火娃.png', src: 'http://example.com/火娃.png' },
        { key: 'xxxx', name: '大娃.jpg', src: 'http://example.com/大娃.jpg' }
      ]
    })
    await wait(0)
    let files = wrapper.vm.fileList

    const keys = ['key', 'name', 'src']
    expect(files.length).to.equal(3)
    expect(pick(files[0], keys)).to.eql({
      key: 'xxxx',
      name: '大娃.jpg',
      src: 'http://example.com/大娃.jpg'
    })
    expect(pick(files[1], keys)).to.eql({
      key: 'yyyy',
      name: '三娃.png',
      src: 'http://example.com/三娃.png'
    })
    expect(files[2].key).to.be.a('string')
    expect(files[2].name).to.equal('火娃.png')
    expect(files[2].src).to.equal('http://example.com/火娃.png')

    // delete
    wrapper.setProps({
      value: [
        { key: 'xxxx', name: '大娃.jpg', src: 'http://example.com/大娃.jpg' }
      ]
    })
    await wait(0)
    expect(wrapper.vm.fileList.length).to.equal(1)
    expect(wrapper.vm.fileList[0].key).to.equal('xxxx')

    wrapper.destroy()
  })

  it('should validate file count/size/type correctly.', async function () {
    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        action: '/upload/xhr?force=success',
        maxSize: '100kb',
        maxCount: 1
      }
    })

    let mockFile = createFile('葫芦娃.png', 'image/png', 128 * 1024)

    // count
    let promise = waitForEvent(wrapper.vm, 'invalid')
    wrapper.vm.addFiles([mockFile, mockFile])
    await promise

    // size
    wrapper.vm.prune()
    promise = waitForEvent(wrapper.vm, 'invalid')
    wrapper.vm.addFiles([mockFile])
    await promise

    // type
    wrapper.vm.prune()
    wrapper.setProps({ accept: '.xlsx,.pdf', maxSize: 1024 * 1024 })
    promise = waitForEvent(wrapper.vm, 'invalid')
    wrapper.vm.addFiles([mockFile])
    await promise

    // will pass validation
    wrapper.vm.prune()
    wrapper.setProps({ accept: 'image/*', extensions: ['jpg', 'png', 'gif'] })
    promise = waitForEvent(wrapper.vm, 'success')
    wrapper.vm.addFiles([mockFile]) // will be uploaded successfully
    await promise

    let invalidEvents = wrapper
      .emittedByOrder()
      .filter(e => e.name === 'invalid')
      .map(e => e.args[0])
    expect(invalidEvents.length).to.equal(3)

    expect(invalidEvents[0].file).to.be.an('undefined')
    expect(invalidEvents[0].errors[0].type).to.equal('count')
    expect(invalidEvents[0].errors[0].value).to.equal(2)

    expect(invalidEvents[1].file).to.equal(mockFile)
    expect(invalidEvents[1].errors[0].type).to.equal('size')
    expect(invalidEvents[1].errors[0].value).to.equal(mockFile.size)

    expect(invalidEvents[2].file).to.equal(mockFile)
    expect(invalidEvents[2].errors[0].type).to.equal('type')
    expect(invalidEvents[2].errors[0].value).to.equal(mockFile.name)

    wrapper.destroy()
  })

  it('should validate file with custom async validator correctly.', async function () {
    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        action: '/upload/xhr',
        validator (file) {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({
                valid: file.name.length > 10,
                message: 'file name too short'
              })
            }, 10)
          })
        }
      }
    })

    let mockFile = createFile('a.png', 'image/png', 128 * 1024)
    let promise = waitForEvent(wrapper.vm, 'invalid')
    wrapper.vm.addFiles([mockFile])
    await promise

    let arg = wrapper.emitted('invalid')[0][0]
    expect(arg.errors[0].type).to.equal('custom')
    expect(arg.errors[0].message).to.equal('file name too short')

    wrapper.destroy()
  })

  it('should emit `statuschange` event when status is changed.', async function () {
    let wrapper = mount(Uploader, {
      sync: false,
      attachToDocument: true,
      propsData: {
        action: '/upload/xhr?force=success',
        accept: '.png'
      }
    })

    let mockFile = createFile('a.png', 'image/png', 128 * 1024)
    let promise = waitForEvent(wrapper.vm, 'success')
    wrapper.vm.addFiles([mockFile])
    await promise

    mockFile = createFile('a.jpg', 'image/jpg', 128 * 1024)
    promise = waitForEvent(wrapper.vm, 'failure')
    wrapper.vm.addFiles([mockFile])
    await promise

    let invalidEvents = wrapper
      .emittedByOrder()
      .filter(e => e.name === 'statuschange')
      .map(e => e.args[0])
    expect(invalidEvents.length).to.equal(4)

    expect(invalidEvents[0]).to.equal('uploading')
    expect(invalidEvents[1]).to.equal('success')
    expect(invalidEvents[2]).to.equal('uploading')
    expect(invalidEvents[3]).to.equal('failure')

    wrapper.destroy()
  })

  it('should upload file correctly when mode is xhr.', async function () {
    let headers = {
      'x-aaa': 'aaa',
      'x-bbb': 'bbb'
    }
    let payload = {
      current: Date.now()
    }

    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        action: '/upload/xhr?force=success&includeRequest=true&name=filedata',
        name: 'filedata',
        accept: 'jpg,jpeg,png',
        headers,
        payload
      },
      attachToDocument: true
    })

    let filename = 'xxx.png'
    let mockFile = createFile(filename, 'image/png', 128 * 1024)
    let promise = waitForEvent(wrapper.vm, 'success')
    wrapper.vm.addFiles([mockFile])
    await promise

    let arg = wrapper.emitted('success')[0][0]
    expect(pick(arg._req.headers, Object.keys(headers))).to.eql(headers)
    // formdata.append 会把 value 转字符串
    expect(arg._req.fields.current).to.equal(payload.current.toString())
    expect(arg._req.file.name).to.equal(filename)

    wrapper.destroy()
  })

  it('should upload file correctly when mode is iframe.', async function () {
    const payload = {
      current: Date.now()
    }
    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        action:
          '/upload/iframe?force=success&includeRequest=true&convert=false',
        requestMode: 'iframe',
        payload
      },
      attachToDocument: true
    })

    // iframeMode: postmessage (default according to global config)
    let mockFile = createFile('xxx.png', 'image/png', 128 * 1024)
    mockFile._rawFileList = createFileList(mockFile)
    let promise = Promise.all([
      waitForEvent(wrapper.vm, 'success'),
      new Promise(resolve => addOnceEventListener(window, 'message', resolve))
    ])
    wrapper.vm.addFiles([mockFile])
    await promise

    let arg = wrapper.emitted('success')[0][0]
    expect(arg._req.fields.current).to.equal(payload.current.toString())
    expect(arg._req.file.name).to.equal(mockFile.name)

    // iframeMode: callback
    wrapper.setProps({ iframeMode: 'callback' })
    await wait(0)
    mockFile = createFile('yyyy.png', 'image/png', 128 * 1024)
    mockFile._rawFileList = createFileList(mockFile)
    promise = waitForEvent(wrapper.vm, 'success')
    wrapper.vm.addFiles([mockFile])
    await promise

    arg = wrapper.emitted('success')[1][0]
    expect(arg._req.fields.current).to.equal(payload.current.toString())
    expect(arg._req.file.name).to.equal(mockFile.name)

    wrapper.destroy()
  })

  it('should upload file correctly when mode is custom.', async function () {
    function successUpload (file, { onload, onprogress }) {
      setTimeout(function () {
        onprogress({
          loaded: 50,
          total: file.size
        })
      }, 10)
      setTimeout(function () {
        onload({
          success: true,
          name: 'xxx.jpg',
          src: './xxx.jpg'
        })
      }, 30)
    }

    function failureUpload (file, { onerror, onprogress }) {
      setTimeout(function () {
        onerror({
          success: false,
          message: '🈲🈲'
        })
      }, 0)
    }

    function cancelUpload (file, { oncancel, onprogress }) {
      setTimeout(oncancel, 20)
    }

    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        requestMode: 'custom',
        order: 'append',
        upload: successUpload
      },
      attachToDocument: true
    })

    let mockFile = createFile('xxx.png', 'image/png', 128 * 1024)
    let promise = waitForEvent(wrapper.vm, 'success')
    wrapper.vm.addFiles([mockFile])
    expect(wrapper.vm.fileList[0].status).to.equal('uploading')
    expect(wrapper.vm.fileList[0].name).to.equal('xxx.png')
    await promise
    expect(wrapper.vm.fileList[0].status).to.equal('success')
    expect(wrapper.vm.fileList[0].name).to.equal('xxx.jpg')
    expect(wrapper.emitted('progress')[0][2]).to.eql({
      loaded: 50,
      total: mockFile.size
    })

    wrapper.setProps({ upload: failureUpload })
    await wait(0)
    promise = waitForEvent(wrapper.vm, 'failure')
    wrapper.vm.addFiles([mockFile])
    await promise
    expect(wrapper.vm.fileList[1].status).to.equal('failure')
    expect(wrapper.vm.fileList[1].message).to.equal('🈲🈲')

    wrapper.setProps({ upload: cancelUpload })
    await wait(0)
    promise = waitForEvent(wrapper.vm, 'remove')
    expect(wrapper.vm.fileList.length).to.equal(2)
    wrapper.vm.addFiles([mockFile])
    expect(wrapper.vm.fileList.length).to.equal(3)
    await promise
    expect(wrapper.vm.fileList.length).to.equal(2)

    wrapper.destroy()
  })

  // ----------

  // it('should handle `remove` event correctly.', function () {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       value: [
  //         { name: 'test1.jpg', src: '/test1.jpg' },
  //         { name: 'test2.jpg', src: '/test2.jpg' }
  //       ]
  //     }
  //   })

  //   wrapper
  //     .findAll('.veui-uploader-list-remove')
  //     .at(1)
  //     .trigger('click')
  //   expect(wrapper.emitted().remove[0]).to.eql([
  //     { name: 'test2.jpg', src: '/test2.jpg', status: 'success' },
  //     1
  //   ])
  //   expect(wrapper.emitted().change[0][0]).to.eql([
  //     { name: 'test1.jpg', src: '/test1.jpg' }
  //   ])
  //   wrapper.destroy()
  // })

  // it('should set request `withCredentials` correctly.', function () {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       withCredentials: false
  //     }
  //   })

  //   let fileList = [{ name: 'test.jpg' }]
  //   wrapper.vm.$data.fileList = fileList
  //   wrapper.vm.uploadFile(fileList[0])

  //   let xhr = fileList[0].xhr
  //   expect(xhr.withCredentials).to.equal(false)
  //   clearXHR(wrapper)
  //   wrapper.destroy()
  // })

  // it('should emit `progress` event when uploading.', function () {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr'
  //     }
  //   })

  //   let fileList = [{ name: 'test.jpg' }]
  //   wrapper.vm.$data.fileList = fileList
  //   wrapper.vm.uploadFile(fileList[0])

  //   // 模拟progress
  //   fileList[0].xhr.upload.onprogress({ loaded: 10, total: 100 })
  //   expect(wrapper.emitted().progress[0][1]).to.equal(0)
  //   expect(wrapper.emitted().progress[0][2]).to.eql({ loaded: 10, total: 100 })
  //   clearXHR(wrapper)
  //   wrapper.destroy()
  // })

  // it('should handle cancel correctly.', function () {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       requestMode: 'iframe'
  //     }
  //   })

  //   wrapper.vm.$data.fileList = [{ name: 'test.jpg', status: 'uploading' }]

  //   wrapper
  //     .find('li')
  //     .find('button')
  //     .trigger('click')
  //   expect(wrapper.vm.$data.fileList).to.eql([])
  //   wrapper.destroy()
  // })

  // it('should be disabled when number of files reach max count.', function () {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       value: [
  //         { name: 'test1.jpg', src: '/test1.jpg' },
  //         { name: 'test2.jpg', src: '/test2.jpg' }
  //       ],
  //       maxCount: 2
  //     }
  //   })

  //   expect(wrapper.vm.inputDisabled).to.equal(true)

  //   wrapper.find('.veui-uploader-list-remove').trigger('click')
  //   expect(wrapper.vm.inputDisabled).to.equal(false)
  //   wrapper.destroy()
  // })

  // it('should set src of image correctly when type is image.', function () {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       value: [
  //         { name: 'test1.jpg', src: '/test1.jpg' },
  //         { name: 'test2.jpg', src: '/test2.jpg' }
  //       ],
  //       type: 'image'
  //     }
  //   })

  //   let images = wrapper.findAll('img')
  //   expect(images.at(0).attributes('src')).to.equal('/test1.jpg')
  //   expect(images.at(1).attributes('src')).to.equal('/test2.jpg')
  //   wrapper.destroy()
  // })

  // it('should set src of video correctly when type is video.', function () {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       value: [
  //         { name: 'test1.mp4', src: '/test1.mp4' },
  //         { name: 'test2.mp4', src: '/test2.mp4' }
  //       ],
  //       type: 'video'
  //     }
  //   })

  //   let videos = wrapper.findAll('video')
  //   expect(videos.at(0).attributes('src')).to.equal('/test1.mp4')
  //   expect(videos.at(1).attributes('src')).to.equal('/test2.mp4')
  //   wrapper.destroy()
  // })

  // it('should set src of video or image correctly when type is media.', function () {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       value: [
  //         { name: 'test1.mp4', src: '/test1.mp4' },
  //         { name: 'test2.jpg', src: '/test2.jpg' },
  //         { name: 'test3.mp4', src: '/test3.mp4', poster: '/test3.jpg' }
  //       ],
  //       type: 'media'
  //     }
  //   })

  //   let images = wrapper.findAll('img')
  //   let videos = wrapper.findAll('video')
  //   expect(videos.at(0).attributes('src')).to.equal('/test1.mp4')
  //   expect(images.at(0).attributes('src')).to.equal('/test2.jpg')
  //   expect(images.at(1).attributes('src')).to.equal('/test3.jpg')
  //   wrapper.destroy()
  // })

  // it('should config controls of media correctly.', function () {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       value: [{ name: 'test1.jpg', src: '/test1.jpg' }],
  //       type: 'image',
  //       controls (file, defaultControls) {
  //         if (file.status === 'success') {
  //           return [
  //             { name: 'test', icon: 'check' },
  //             {
  //               name: 'test1',
  //               icon: 'crop',
  //               children: [
  //                 {
  //                   name: 'test11', icon: 'cut', label: 'test11'
  //                 }
  //               ]
  //             },
  //             ...defaultControls
  //           ]
  //         }
  //         return defaultControls
  //       }
  //     }
  //   })

  //   let items = wrapper.find('.veui-uploader-list-media-mask').findAll('.veui-control-item')
  //   items.at(0).trigger('click')
  //   expect(wrapper.emitted().test[0][0]).to.eql(
  //     { name: 'test1.jpg', src: '/test1.jpg', status: 'success', type: 'image' },
  //     0
  //   )

  //   const dropdown = items.at(1).find(Dropdown).vm
  //   expect(dropdown.$props.options).to.eql(
  //     [{
  //       name: 'test11',
  //       icon: 'cut',
  //       label: 'test11',
  //       value: 'test11',
  //       children: []
  //     }]
  //   )
  //   items.at(1).find('button').trigger('mouseenter')
  //   expect(dropdown.expanded).to.equal(true)
  //   dropdown.handleSelect('test11')
  //   expect(wrapper.emitted().test11[0][0]).to.eql(
  //     { name: 'test1.jpg', src: '/test1.jpg', status: 'success', type: 'image' },
  //     0
  //   )

  //   wrapper.destroy()
  // })

  // it('should config entries of media correctly.', async function () {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       value: [{ name: 'test1.jpg', src: '/test1.jpg' }],
  //       type: 'media',
  //       entries (defaultEntries) {
  //         return [
  //           { name: 'test', icon: 'check', label: 'test' },
  //           {
  //             name: 'test1',
  //             icon: 'crop',
  //             label: 'test2',
  //             children: [
  //               {
  //                 name: 'test11',
  //                 icon: 'cut',
  //                 label: 'test11'
  //               }
  //             ]
  //           },
  //           ...defaultEntries
  //         ]
  //       }
  //     }
  //   })

  //   let entryContainer = wrapper.find('.veui-uploader-entries-container')
  //   let items = entryContainer.findAll('li')
  //   expect(items.length).to.equal(3)

  //   expect(items.at(0).text()).to.equal('test')
  //   expect(items.at(1).text()).to.equal('test2')

  //   let buttons = wrapper
  //     .find('.veui-uploader-entries-container')
  //     .findAll('button')

  //   buttons.at(0).trigger('click')
  //   expect(wrapper.emitted().test).to.eql([[]])

  //   const dropdown = items.at(1).find(Dropdown).vm
  //   expect(dropdown.$props.options).to.eql(
  //     [{
  //       name: 'test11',
  //       icon: 'cut',
  //       label: 'test11',
  //       value: 'test11',
  //       children: []
  //     }]
  //   )

  //   buttons.at(1).trigger('mouseenter')
  //   expect(dropdown.expanded).to.equal(true)
  //   dropdown.handleSelect('test11')
  //   expect(wrapper.emitted().test11).to.eql([[]])

  //   let input = wrapper.find('input[type="file"]').element
  //   let clickTriggeredPromise = Promise.race(
  //     [
  //       new Promise(resolve => {
  //         input.addEventListener('click', function () {
  //           resolve(true)
  //         })
  //       }, { once: true }),
  //       new Promise(resolve => {
  //         setTimeout(function () {
  //           resolve(false)
  //         }, 2000)
  //       })
  //     ])

  //   buttons.at(3).trigger('click')

  //   let clickTriggered = await clickTriggeredPromise
  //   expect(clickTriggered).to.equal(true)

  //   wrapper.destroy()
  // })

  // it('should handle replace correctly.', async function () {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       value: [{ name: 'test.jpg', src: '/test.jpg' }],
  //       type: 'image'
  //     }
  //   })

  //   wrapper
  //     .find('li')
  //     .find('label')
  //     .trigger('click')

  //   let input = wrapper.find('input[type="file"]')
  //   let dT = new DataTransfer()
  //   dT.items.add(new File(['foo'], 'test2.jpg'))
  //   input.element.files = dT.files
  //   input.trigger('change')
  //   clearXHR(wrapper)
  //   await wait(0)

  //   let callbackData = { src: '/test2.jpg', success: true }
  //   wrapper.vm.uploadCallback(callbackData, dT.files[0])

  //   expect(wrapper.emitted().change[0][0]).to.eql([])

  //   expect(wrapper.emitted().change[1][0]).to.eql([
  //     { name: 'test2.jpg', src: '/test2.jpg' }
  //   ])

  //   wrapper.destroy()
  // })

  // it('should set callback function correctly when request mode is iframe.', function () {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       requestMode: 'iframe',
  //       iframeMode: 'callback',
  //       callbackNamespace: 'testNameSpace'
  //     }
  //   })

  //   expect(window.testNameSpace).to.be.an('object')
  //   wrapper.destroy()
  // })

  // it('should render desc slot correctly.', function () {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr'
  //     },
  //     slots: {
  //       desc: 'jpg only.'
  //     }
  //   })

  //   expect(wrapper.find('.veui-uploader-desc').text()).to.equal('jpg only.')
  //   wrapper.destroy()
  // })

  // it('should render button label slot correctly.', function () {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr'
  //     },
  //     slots: {
  //       'button-label': '<span class="test-label">upload</span>'
  //     }
  //   })

  //   expect(wrapper.find('.test-label').text()).to.equal('upload')
  //   wrapper.destroy()
  // })

  // it('should render file-before file-after slot correctly.', async function () {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       value: [
  //         { name: 'test1.jpg', src: '/test1.jpg' },
  //         { name: 'test2.jpg', src: '/test2.jpg' }
  //       ]
  //     },
  //     scopedSlots: {
  //       'file-before':
  //         '<p class="test-file-before" slot-scope="file">{{ file.index + 1 }}</p>',
  //       'file-after':
  //         '<p class="test-file-after" slot-scope="file">{{ file.src }}</p>'
  //     }
  //   })

  //   let before = wrapper.findAll('.test-file-before')
  //   expect(before.at(0).text()).to.equal('1')
  //   expect(before.at(1).text()).to.equal('2')
  //   let after = wrapper.findAll('.test-file-after')
  //   expect(after.at(0).text()).to.equal('/test1.jpg')
  //   expect(after.at(1).text()).to.equal('/test2.jpg')

  //   wrapper.destroy()

  //   wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       value: [
  //         { name: 'test1.jpg', src: '/test1.jpg' },
  //         { name: 'test2.jpg', src: '/test2.jpg' }
  //       ]
  //     },
  //     scopedSlots: {
  //       'file-before':
  //         '<p class="test-file-before" slot-scope="file">{{ file.name }}</p>',
  //       'file-after':
  //         '<p class="test-file-after" slot-scope="file">{{ file.status }}</p>'
  //     }
  //   })

  //   let input = wrapper.find('input[type="file"]')
  //   let dT = new DataTransfer()
  //   dT.items.add(new File(['foo'], 'test2.jpg'))
  //   input.element.files = dT.files
  //   input.trigger('change')
  //   await wait(0)
  //   clearXHR(wrapper)

  //   let callbackData = { src: '/test2.jpg', id: 6, success: true }
  //   wrapper.vm.uploadCallback(callbackData, dT.files[0])

  //   before = wrapper.findAll('.test-file-before')
  //   after = wrapper.findAll('.test-file-after')
  //   expect(before.at(2).text()).to.equal('test2.jpg')
  //   expect(after.at(2).text()).to.equal('success')

  //   wrapper.destroy()
  // })
})

function waitForEvent (vm, event) {
  return new Promise(function (resolve, reject) {
    vm.$once(event, resolve)
  })
}

function createFile (name, type, size) {
  let file = new File(['㊙️'], name, { type })
  Object.defineProperty(file, 'size', {
    get () {
      return size
    }
  })
  return file
}

function createFileList (files) {
  // FileList没有构造函数来创建，通过 DataTransferItemList 来绕过
  // from https://github.com/jimmywarting/filelist-constructor/blob/bd262ed3778317d48dceed998f845dfedb2b69a6/filelist.js
  files = [].concat(files)
  if (some(files, file => !(file instanceof File))) {
    throw new Error(
      'expected argument to FileList is File or array of File objects'
    )
  }
  let dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()
  files.forEach(function (file) {
    dataTransfer.items.add(file)
  })
  return dataTransfer.files
}
