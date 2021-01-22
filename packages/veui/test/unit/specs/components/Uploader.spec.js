import { mount } from '@vue/test-utils'
import Uploader from '@/components/Uploader'
// import Dropdown from '@/components/Dropdown'
// import { wait } from '../../../utils'
import 'veui-theme-dls-icons/check'
import 'veui-theme-dls-icons/crop'
import 'veui-theme-dls-icons/cut'

describe('components/Uploader', () => {
  it('should handle value prop with `null` value.', () => {
    let wrapper = mount(Uploader, {
      propsData: {
        value: null,
        action: '/upload/xhr'
      }
    })

    expect(wrapper.vm.$data.fileList).to.eql([])
    wrapper.destroy()
  })

  it('should handle value of object type correctly.', () => {
    let wrapper = mount(Uploader, {
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

  // it('should transparently pass-through attrs to the <input> element.', async () => {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       name: 'filedata',
  //       accept: 'jpg,jpeg,png'
  //     }
  //   })

  //   let input = wrapper.find('input[type="file"]')
  //   expect(input.attributes('name')).to.equal('filedata')
  //   expect(input.attributes('accept')).to.equal('jpg,jpeg,png')
  //   wrapper.destroy()
  // })

  // it('should set action to form correctly when mode is iframe.', async () => {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       requestMode: 'iframe'
  //     }
  //   })

  //   wrapper.vm.submit({ name: 'test.jpg' })
  //   expect(wrapper.find('form').attributes('action')).to.equal('/upload')

  //   await wrapper.vm.$nextTick()
  //   wrapper.destroy()
  // })

  // it('should set payload to form correctly when mode is iframe.', async () => {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       requestMode: 'iframe',
  //       payload: {
  //         month: 7,
  //         day: 1
  //       }
  //     }
  //   })

  //   wrapper.vm.submit({ name: 'test.jpg' })

  //   let form = wrapper.find('form')

  //   let input = form.findAll('input').at(0)
  //   expect({
  //     value: input.element.value,
  //     name: input.attributes('name')
  //   }).to.eql({ value: '7', name: 'month' })

  //   let input2 = form.findAll('input').at(1)
  //   expect({
  //     value: input2.element.value,
  //     name: input2.attributes('name')
  //   }).to.eql({ value: '1', name: 'day' })

  //   await wrapper.vm.$nextTick()
  //   wrapper.destroy()
  // })

  it('should validate file count/size/type correctly.', async () => {
    let wrapper = mount(Uploader, {
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

  // it('should validate file with custom async validator correctly.', async () => {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       validator (file) {
  //         return new Promise(resolve => {
  //           setTimeout(() => {
  //             resolve({
  //               valid: file.name.length > 10,
  //               message: 'file name too short'
  //             })
  //           }, 0)
  //         })
  //       }
  //     }
  //   })

  //   let mockFile = createFile('longlonglongfilename.png', 'image/png', 128 * 1024)
  //   let promise = waitForEvent(wrapper.vm, 'invalid')
  //   wrapper.vm.addFiles([mockFile])
  //   await promise

  //   let arg = wrapper.emitted('invalid')[0][0]
  //   expect(arg.errors[0].type).to.equal('custom')
  //   expect(arg.errors[0].message).to.equal('file name too short')

  //   wrapper.destroy()
  // })

  // it('should emit `statuschange` event when status is changed.', async () => {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr'
  //     }
  //   })

  //   let input = wrapper.find('input[type="file"]')
  //   let dT = new DataTransfer()
  //   dT.items.add(new File(['foo'], 'test.jpg'))
  //   input.element.files = dT.files
  //   input.trigger('change')
  //   clearXHR(wrapper)
  //   await wait(0)

  //   expect(wrapper.emitted().statuschange[1][0]).to.equal('uploading')

  //   wrapper.vm.uploadCallback({ success: true }, dT.files[0])
  //   expect(wrapper.emitted().statuschange[2][0]).to.equal('success')

  //   dT = new DataTransfer()
  //   dT.items.add(new File(['foo'], 'test2.jpg'))
  //   input.element.files = dT.files
  //   input.trigger('change')
  //   clearXHR(wrapper)
  //   await wait(0)

  //   expect(wrapper.emitted().statuschange[3][0]).to.equal('uploading')
  //   wrapper.destroy()
  // })

  // it('should handle callback correctly when upload is finished.', async () => {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       value: [{ name: 'test1.jpg', src: '/test1.jpg', id: 5 }]
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
  //   expect(wrapper.emitted().change[0][0]).to.eql([
  //     { name: 'test2.jpg', src: '/test2.jpg', id: 6 },
  //     { name: 'test1.jpg', src: '/test1.jpg', id: 5 }
  //   ])

  //   expect(wrapper.emitted().success[0]).to.eql([
  //     {
  //       name: 'test2.jpg',
  //       src: '/test2.jpg',
  //       id: 6,
  //       status: 'success'
  //     },
  //     0
  //   ])

  //   dT = new DataTransfer()
  //   dT.items.add(new File(['foo'], 'test3.jpg'))
  //   input.element.files = dT.files
  //   input.trigger('change')
  //   await wait(0)
  //   clearXHR(wrapper)

  //   callbackData = { success: false, message: 'image too large' }
  //   wrapper.vm.uploadCallback(callbackData, dT.files[0])
  //   expect(wrapper.emitted().failure[0]).to.eql([
  //     {
  //       name: 'test3.jpg',
  //       status: 'failure',
  //       message: 'image too large'
  //     },
  //     0
  //   ])
  //   wrapper.destroy()
  // })

  // it('should handle post message callback correctly when iframe mode is post message.', async () => {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       requestMode: 'iframe',
  //       iframeMode: 'postmessage'
  //     }
  //   })

  //   let input = wrapper.find('input[type="file"]')
  //   let dT = new DataTransfer()
  //   dT.items.add(new File(['foo'], 'test.jpg'))
  //   input.element.files = dT.files
  //   input.trigger('change')
  //   clearXHR(wrapper)
  //   await wait(0)

  //   wrapper.vm.submit(input.element.files[0])

  //   await wrapper.vm.$nextTick()

  //   // 这里的iframe里调postMessage无法完全模拟真实环境，所以直接调message事件的回调函数
  //   wrapper.vm.handlePostmessage({
  //     source: {
  //       frameElement: {
  //         id: wrapper.vm.$data.iframeId
  //       }
  //     },
  //     origin: location.origin,
  //     data: { src: '/test.jpg', success: true }
  //   })

  //   expect(wrapper.emitted().change[0][0]).to.eql([
  //     { name: 'test.jpg', src: '/test.jpg' }
  //   ])

  //   await wrapper.vm.$nextTick()
  //   wrapper.destroy()
  // })

  // it('should support custom upload function with type `image` correctly.', async () => {
  //   let count = 0
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       requestMode: 'custom',
  //       type: 'image',
  //       upload: async (file, { onload, onprogress, oncancel }) => {
  //         onprogress({
  //           loaded: 50,
  //           total: 100
  //         })

  //         await wrapper.vm.$nextTick()
  //         expect(wrapper.emitted().progress[count][1]).to.equal(0)
  //         expect(wrapper.emitted().progress[count][2]).to.eql({ loaded: 50, total: 100 })

  //         if (count === 1) {
  //           oncancel()
  //         } else {
  //           onload({ src: `/test${count}.jpg`, success: true })
  //         }
  //         count++
  //       }
  //     },
  //     attachToDocument: true
  //   })

  //   let input = wrapper.find('input[type="file"]')
  //   let dt = new DataTransfer()
  //   dt.items.add(new File(['foo'], 'test.jpg'))
  //   input.element.files = dt.files
  //   input.trigger('change')
  //   await wait(0)

  //   expect(wrapper.emitted().change[0][0]).to.eql([
  //     { name: 'test.jpg', src: '/test0.jpg' }
  //   ])

  //   await wrapper.vm.$nextTick()
  //   wrapper.find('.veui-uploader-list-media-mask label').trigger('click')
  //   dt = new DataTransfer()
  //   dt.items.add(new File(['foo'], 'test.jpg'))
  //   input.element.files = dt.files
  //   input.trigger('change')

  //   await wait(0)
  //   expect(wrapper.findAll('.veui-uploader-list-media-item:not(.veui-uploader-list-media-item-upload)').length).to.equal(1)
  //   // should restore uploaded image
  //   expect(wrapper.find('.veui-uploader-list-media-container-media').attributes('src')).to.equal('/test0.jpg')

  //   wrapper.destroy()
  // })

  // it('should support custom upload function with type `file` correctly.', async () => {
  //   let count = 0
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       requestMode: 'custom',
  //       upload: async (file, { onload, onprogress, oncancel }) => {
  //         onprogress({
  //           loaded: count * 10 + 30,
  //           total: 100
  //         })

  //         await wrapper.vm.$nextTick()
  //         expect(wrapper.emitted().progress[count][1]).to.equal(0)
  //         expect(wrapper.emitted().progress[count][2]).to.eql({ loaded: count * 10 + 30, total: 100 })

  //         if (count === 1) {
  //           oncancel()
  //         } else {
  //           onload({ src: `/test${count}.jpg`, success: true })
  //         }
  //         count++
  //       }
  //     },
  //     attachToDocument: true
  //   })

  //   let input = wrapper.find('input[type="file"]')
  //   let dt = new DataTransfer()
  //   dt.items.add(new File(['foo'], 'test.jpg'))
  //   input.element.files = dt.files
  //   input.trigger('change')
  //   await wait(0)

  //   expect(wrapper.emitted().change[0][0]).to.eql([
  //     { name: 'test.jpg', src: '/test0.jpg' }
  //   ])

  //   await wrapper.vm.$nextTick()
  //   dt = new DataTransfer()
  //   dt.items.add(new File(['foo'], 'test2.jpg'))
  //   input.element.files = dt.files
  //   input.trigger('change')

  //   await wait(0)
  //   expect(wrapper.findAll('.veui-uploader-list-item').length).to.equal(1)

  //   wrapper.destroy()
  // })

  // it('should parse callback data correctly.', () => {
  //   let wrapper = mount(Uploader, {
  //     propsData: {
  //       action: '/upload/xhr',
  //       dataType: 'json'
  //     }
  //   })

  //   let callbackData = JSON.stringify({ src: '/test.jpg', id: '23' })
  //   expect(wrapper.vm.parseData(callbackData)).to.eql({
  //     src: '/test.jpg',
  //     id: '23'
  //   })

  //   callbackData = { src: '/test.jpg', id: '23' }
  //   expect(wrapper.vm.parseData(callbackData)).to.eql({
  //     src: '/test.jpg',
  //     id: '23'
  //   })

  //   wrapper.setProps({ dataType: 'text' })
  //   callbackData = 'callback text'
  //   expect(wrapper.vm.parseData(callbackData)).to.equal('callback text')

  //   wrapper.destroy()
  // })

  // it('should handle `remove` event correctly.', () => {
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

  // it('should set request `withCredentials` correctly.', () => {
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

  // it('should emit `progress` event when uploading.', () => {
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

  // it('should handle cancel correctly.', () => {
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

  // it('should be disabled when number of files reach max count.', () => {
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

  // it('should set src of image correctly when type is image.', () => {
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

  // it('should set src of video correctly when type is video.', () => {
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

  // it('should set src of video or image correctly when type is media.', () => {
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

  // it('should config controls of media correctly.', () => {
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

  // it('should config entries of media correctly.', async () => {
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

  // it('should handle replace correctly.', async () => {
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

  // it('should set callback function correctly when request mode is iframe.', () => {
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

  // it('should render desc slot correctly.', () => {
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

  // it('should render button label slot correctly.', () => {
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

  // it('should render file-before file-after slot correctly.', async () => {
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
    vm.$on(event, resolve)
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
