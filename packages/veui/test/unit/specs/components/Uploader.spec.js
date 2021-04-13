import { pick, omit, identity } from 'lodash'
import { mount } from '@vue/test-utils'
import Uploader from '@/components/Uploader'
import Dropdown from '@/components/Dropdown'
import Lightbox from '@/components/Lightbox'
import { wait } from '../../../utils'
import { UploaderFile } from '@/components/Uploader/_helper'
import { addOnceEventListener } from '@/utils/dom'
import { createFileList } from '@/utils/file'
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
        autoupload: false,
        convertResponse: identity
      }
    })

    let promise = waitForEvent(wrapper.vm, 'statuschange')
    wrapper.vm.chooseFiles()
    wrapper.vm.chooseFiles()
    wrapper.vm.chooseFiles() // only last choose active

    let mockFiles = [
      createFile('力大无穷.png', 'image/png', 128 * 1024),
      createFile('千里眼，顺风耳.png', 'image/png', 128 * 1024)
    ]
    let input = wrapper.find('input[type="file"]')
    input.element.files = createFileList(mockFiles)
    input.trigger('change')

    await promise

    expect(wrapper.vm.fileList.length).to.equal(2)
    expect(wrapper.vm.fileList[0].native).to.equal(mockFiles[0])
    expect(wrapper.vm.fileList[1].native).to.equal(mockFiles[1])

    wrapper.destroy()
  })

  it('should handle value prop with `null` value.', async function () {
    let wrapper = mount(Uploader, {
      sync: false,
      attachToDocument: true,
      propsData: {
        maxCount: 3,
        value: null,
        action: '/upload/xhr?force=success&latency=0'
      }
    })
    expect(wrapper.vm.$data.fileList).to.eql([])

    let mockFile = createFile('葫芦娃.png', 'image/png', 128 * 1024)
    let promise = waitForEvent(wrapper.vm, 'success')
    wrapper.vm.addFiles([mockFile])
    await promise

    wrapper.vm.prune()
    wrapper.setProps({ maxCount: 1 })
    await wait(0)
    promise = waitForEvent(wrapper.vm, 'success')
    wrapper.vm.addFiles([mockFile])
    await promise

    wrapper.vm.prune()
    wrapper.setProps({ maxCount: 1, multiple: true })
    await wait(0)
    promise = waitForEvent(wrapper.vm, 'success')
    wrapper.vm.addFiles([mockFile])
    await promise

    let changes = wrapper
      .emittedByOrder()
      .filter(e => e.name === 'change')
      .map(e => e.args[0])
    expect(changes[0]).to.be.a('array')
    expect(changes[1]).to.eql([])
    expect(changes[2]).to.be.a('object')
    expect(changes[3]).to.equal(null)
    expect(changes[4]).to.be.a('array')

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
          },
          {
            key: 'zzz',
            name: '三娃.jpg',
            src: 'c.jpg'
          }
        ]
      }
    })

    await wait(0)
    expect(wrapper.vm.fileList.length, '初始文件个数').to.equal(3)

    // update, replace
    wrapper.setProps({
      value: [
        { name: '水娃.png', src: 'http://example.com/水娃.png' },
        { name: '火娃.png', src: 'http://example.com/火娃.png' },
        { key: 'yyyy', name: '二娃.jpg', src: 'http://example.com/二娃.jpg' },
        { key: 'xxxx', name: '大娃.jpg', src: 'http://example.com/大娃.jpg' }
      ]
    })
    await wait(0)
    let files = wrapper.vm.fileList.map(file => file.value)
    expect(files.length, '填充后文件个数').to.equal(4)

    expect(files[0].key, '第一个文件 key').to.be.a('string')
    expect(files[0].name, '第一个文件 name').to.equal('水娃.png')
    expect(files[0].src, '第一个文件 src').to.equal(
      'http://example.com/水娃.png'
    )

    expect(files[1].key, '第二个文件 key').to.be.a('string')
    expect(files[1].name, '第二个文件 name').to.equal('火娃.png')
    expect(files[1].src, '第二个文件 src').to.equal(
      'http://example.com/火娃.png'
    )

    expect(files[2].key, '第三个文件 key').to.equal('yyyy')
    expect(files[2].name, '第三个文件 name').to.equal('二娃.jpg')
    expect(files[2].src, '第三个文件 src').to.equal(
      'http://example.com/二娃.jpg'
    )

    expect(files[3].key, '第四个文件 key').to.equal('xxxx')
    expect(files[3].name, '第四个文件 name').to.equal('大娃.jpg')
    expect(files[3].src, '第四个文件 src').to.equal(
      'http://example.com/大娃.jpg'
    )

    // delete
    let file = UploaderFile.fromValue({ name: '七娃.gif' }, { keyField: 'key' })
    file.isFailure = true
    wrapper.vm.fileList.splice(1, 0, file)
    wrapper.setProps({
      value: [
        { key: 'xxxx', name: '大娃.jpg', src: 'http://example.com/大娃.jpg' },
        { name: '六娃.jpg' }
      ]
    })
    await wait(0)
    expect(wrapper.vm.fileList.length, '删除后文件个数').to.equal(3)
    expect(wrapper.vm.fileList[0].key).to.equal('xxxx')
    expect(wrapper.vm.fileList[1].name).to.equal('七娃.gif')
    expect(wrapper.vm.fileList[2].name).to.equal('六娃.jpg')

    wrapper.destroy()
  })

  it('should call `afterPick` hook after files are choosed.', async function () {
    let wrapper = mount(Uploader, {
      sync: false,
      attachToDocument: true,
      propsData: {
        action: '/upload/xhr',
        requestMode: 'custom',
        upload (file, { onload }) {
          onload({
            success: true,
            name: file.name,
            src: file.jiale
          })
        },
        afterPick (files) {
          files = files.map(file => {
            file.jiale = '强力被夹.jpg'
            return file
          })
          return wait(0).then(() => files)
        }
      }
    })

    let mockFile = createFile('葫芦娃.png', 'image/png', 128 * 1024)
    let promise = waitForEvent(wrapper.vm, 'change')
    wrapper.vm.chooseFiles()
    let input = wrapper.find('input[type="file"]')
    input.element.files = createFileList(mockFile)
    input.trigger('change')
    await promise

    let values = wrapper.emitted('change')[0][0]
    expect(values[0].name).to.equal('葫芦娃.png')
    expect(values[0].src).to.equal('强力被夹.jpg')

    wrapper.destroy()
  })

  it('should validate file count/size/type correctly.', async function () {
    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        action: '/upload/xhr?force=success&latency=0',
        maxSize: '100kb',
        maxCount: 1,
        order: 'desc',
        type: 'file',
        accept: 'image/*'
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
    await wait(0)
    promise = waitForEvent(wrapper.vm, 'invalid')
    wrapper.vm.addFiles([mockFile])
    await promise

    // will pass validation
    wrapper.vm.prune()
    wrapper.setProps({ accept: 'image/*', extensions: ['jpg', 'png', 'gif'] })
    await wait(0)
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
        action: '/upload/xhr?latency=0',
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
        action: '/upload/xhr?force=success&latency=0',
        accept: '.png'
      }
    })

    let mockFile = createFile('a.jpg', 'image/jpg', 128 * 1024)
    let promise = waitForEvents(wrapper.vm, ['failure', 'statuschange'])
    wrapper.vm.addFiles([mockFile])
    await promise
    await wait(0)

    mockFile = createFile('a.png', 'image/png', 128 * 1024)
    promise = waitForEvents(wrapper.vm, ['success', 'statuschange'])
    wrapper.vm.addFiles([mockFile])
    await promise
    await wait(0)

    wrapper.setProps({ action: '/upload/xhr?force=failure&latency=0' })
    await wait(0)
    promise = waitForEvents(wrapper.vm, ['failure', 'statuschange'])
    wrapper.vm.addFiles([mockFile])
    await promise
    await wait(0)

    wrapper.vm.clear()
    await wait(0)

    wrapper.setProps({ value: [] })
    await wait(0)

    const eventNames = wrapper
      .emittedByOrder()
      .filter(e => e.name !== 'progress')
      .map(({ name, args }) => {
        switch (name) {
          case 'statuschange':
            return `${name}:${args[0]}`
          case 'invalid':
            return `${name}:${args[0].file.name}`
          case 'change':
            return `${name}:${args[0].length}`
        }
        return name
      })
    expect(eventNames).to.eql([
      'statuschange:uploading',
      'invalid:a.jpg',
      'failure',
      'statuschange:failure', // invalid
      'statuschange:uploading',
      'change:1',
      'success',
      'statuschange:failure', // success
      'statuschange:uploading',
      'failure',
      'statuschange:failure', // failure
      'remove',
      'remove',
      'statuschange:success', // remove
      'statuschange:empty' // empty
    ])

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
        action:
          '/upload/xhr?force=success&includeRequest=true&name=filedata&latency=0',
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
        type: 'media',
        action:
          '/upload/iframe?force=success&includeRequest=true&convert=false&latency=0',
        requestMode: 'iframe',
        payload,
        order: 'append'
      },
      attachToDocument: true
    })

    // iframeMode: postmessage (default according to global config)
    let mockFile = createFile('xxx.png', 'image/png', 128 * 1024)
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
    mockFile = createFile('yyyy.mp4', 'video/mp4', 128 * 1024)
    promise = waitForEvent(wrapper.vm, 'success')
    wrapper.vm.addFiles([mockFile])
    await promise

    arg = wrapper.emitted('success')[1][0]
    expect(arg._req.fields.current).to.equal(payload.current.toString())
    expect(arg._req.file.name).to.equal(mockFile.name)

    wrapper.destroy()
  })

  it('should upload file correctly when mode is custom.', async function () {
    let thisInsideUpload
    function successUpload (file, { onload, onprogress }) {
      thisInsideUpload = this

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

    function failureUpload (file, { onerror }) {
      setTimeout(function () {
        onerror({
          success: false,
          message: '🈲🈲'
        })
      }, 0)
    }

    function cancelUpload (file, { oncancel }) {
      setTimeout(oncancel, 20)
    }

    let called = false
    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        requestMode: 'custom',
        order: 'append',
        upload: successUpload,
        convertResponse: data => {
          called = true
          return data
        }
      },
      attachToDocument: true
    })

    let mockFile = createFile('xxx.png', 'image/png', 128 * 1024)
    let promise = waitForEvent(wrapper.vm, 'success')
    wrapper.vm.addFiles([mockFile])
    expect(wrapper.vm.fileList[0].status).to.equal('uploading')
    expect(wrapper.vm.fileList[0].name).to.equal('xxx.png')
    await promise
    expect(called).to.equal(true)
    expect(wrapper.vm.fileList[0].status).to.equal('success')
    expect(wrapper.vm.fileList[0].name).to.equal('xxx.jpg')
    expect(wrapper.emitted('progress')[0][2]).to.eql({
      loaded: 50,
      total: mockFile.size
    })
    expect(thisInsideUpload).to.equal(undefined)

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

  it('should handle cancel correctly.', async function () {
    let called = 0
    let cancel
    let cancelled = new Promise(resolve => {
      cancel = resolve
    })
    let wrapper = mount(Uploader, {
      sync: false,
      attachToDocument: true,
      propsData: {
        requestMode: 'custom',
        upload (file, { onprogress }) {
          called++
          onprogress({ loaded: 10, total: 100 })
          return function () {
            called++
            cancel()
          }
        }
      }
    })
    let progressPromise = waitForEvent(wrapper.vm, 'progress')
    let mockFile = createFile('xxx.png', 'image/png', 128 * 1024)
    wrapper.vm.addFiles([mockFile])
    await progressPromise
    wrapper.destroy()
    await cancelled
    expect(called).to.equal(2)

    wrapper = mount(Uploader, {
      sync: false,
      attachToDocument: true,
      propsData: {
        requestMode: 'custom',
        upload (file) {
          called++
          return function () {}
        }
      }
    })
    wrapper.vm.addFiles([mockFile])
    wrapper.destroy()
    await wait(100)
    expect(called).to.equal(2)
    expect(wrapper.emitted('failure')).to.be.a('undefined')
  })

  it('should be disabled when number of files reach max count.', function () {
    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        action: '/upload/xhr',
        value: [
          { name: 'test1.jpg', src: '/test1.jpg' },
          { name: 'test2.jpg', src: '/test2.jpg' }
        ],
        maxCount: 2
      }
    })

    expect(wrapper.vm.canAddImage).to.equal(false)
    expect(wrapper.find('.veui-button').element.disabled).to.equal(true)
    wrapper.find('.veui-uploader-list-remove').trigger('click')
    expect(wrapper.vm.canAddImage).to.equal(true)

    wrapper.destroy()
  })

  it('should set src of image correctly when type is image.', function () {
    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        action: '/upload/xhr',
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

  it('should set src of video correctly when type is video.', function () {
    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        action: '/upload/xhr',
        value: [
          { name: 'test1.mp4', src: '/test1.mp4' },
          { name: 'test2.mp4', src: '/test2.mp4' }
        ],
        type: 'video'
      }
    })

    let videos = wrapper.findAll('video')
    expect(videos.at(0).attributes('src')).to.equal('/test1.mp4')
    expect(videos.at(1).attributes('src')).to.equal('/test2.mp4')
    wrapper.destroy()
  })

  it('should set src of video or image correctly when type is media.', function () {
    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        action: '/upload/xhr',
        value: [
          { name: 'test1.mp4', src: '/test1.mp4' },
          { name: 'test2.jpg', src: '/test2.jpg' },
          { name: 'test3.mp4', src: '/test3.mp4', poster: '/test3.jpg' }
        ],
        type: 'media'
      }
    })

    let images = wrapper.findAll('img')
    let videos = wrapper.findAll('video')
    expect(videos.at(0).attributes('src')).to.equal('/test1.mp4')
    expect(images.at(0).attributes('src')).to.equal('/test2.jpg')
    expect(images.at(1).attributes('src')).to.equal('/test3.jpg')
    wrapper.destroy()
  })

  it('should config controls of media correctly.', function () {
    let wrapper = mount(Uploader, {
      sync: false,
      attachToDocument: true,
      propsData: {
        action: '/upload/xhr',
        value: [{ name: 'test1.jpg', src: '/test1.jpg' }],
        type: 'image',
        controls (file, defaultControls) {
          if (file.status === 'success') {
            return [
              { name: 'test', icon: 'check' },
              {
                name: 'test1',
                icon: 'crop',
                children: [
                  {
                    name: 'test11',
                    icon: 'cut',
                    label: 'test11'
                  }
                ]
              },
              ...defaultControls
            ]
          }
          return defaultControls
        }
      }
    })

    let items = wrapper
      .find('.veui-uploader-list-media-mask')
      .findAll('.veui-control-item')
    items.at(0).trigger('click')
    let file = wrapper.emitted('test')[0][0]
    expect(omit(file, ['key'])).to.eql(
      {
        name: 'test1.jpg',
        src: '/test1.jpg',
        status: 'success',
        type: 'image'
      },
      0
    )
    expect(file.key).to.be.a('string')

    const dropdown = items.at(1).find(Dropdown).vm
    expect(dropdown.$props.options).to.eql([
      {
        name: 'test11',
        icon: 'cut',
        label: 'test11',
        value: 'test11',
        children: []
      }
    ])
    items
      .at(1)
      .find('button')
      .trigger('mouseenter')
    expect(dropdown.localExpanded).to.equal(true)
    dropdown.handleSelect('test11')
    expect(wrapper.emitted('test11')[0][0].name).to.equal('test1.jpg')

    wrapper.destroy()
  })

  it('should config entries of media correctly.', async function () {
    let wrapper = mount(Uploader, {
      sync: false,
      attachToDocument: true,
      propsData: {
        action: '/upload/xhr',
        value: [{ name: 'test1.jpg', src: '/test1.jpg' }],
        type: 'media',
        entries (defaultEntries) {
          return [
            { name: 'test', icon: 'check', label: 'test' },
            {
              name: 'test1',
              icon: 'crop',
              label: 'test2',
              children: [
                {
                  name: 'test11',
                  icon: 'cut',
                  label: 'test11'
                }
              ]
            },
            ...defaultEntries
          ]
        }
      }
    })

    let entryContainer = wrapper.find('.veui-uploader-entries-container')
    let items = entryContainer.findAll('.veui-control-item')
    expect(items.length).to.equal(3)

    expect(items.at(0).text()).to.equal('test')
    expect(items.at(1).text()).to.equal('test2')

    let buttons = wrapper
      .find('.veui-uploader-entries-container')
      .findAll('button')

    buttons.at(0).trigger('click')
    expect(wrapper.emitted('test')[0]).to.eql([])

    const dropdown = items.at(1).find(Dropdown).vm
    expect(dropdown.$props.options).to.eql([
      {
        name: 'test11',
        icon: 'cut',
        label: 'test11',
        value: 'test11',
        children: []
      }
    ])

    buttons.at(1).trigger('mouseenter')
    expect(dropdown.localExpanded).to.equal(true)
    dropdown.handleSelect('test11')
    expect(wrapper.emitted('test11')[0]).to.eql([])

    let input = wrapper.find('input[type="file"]').element
    let clickTriggeredPromise = Promise.race([
      new Promise(
        resolve => {
          input.addEventListener('click', function () {
            resolve(true)
          })
        },
        { once: true }
      ),
      new Promise(resolve => {
        setTimeout(function () {
          resolve(false)
        }, 2000)
      })
    ])

    buttons.at(3).trigger('click')

    let clickTriggered = await clickTriggeredPromise
    expect(clickTriggered).to.equal(true)

    wrapper.destroy()
  })

  it('should show preview of media correctly.', async function () {
    let wrapper = mount(Uploader, {
      sync: false,
      attachToDocument: true,
      propsData: {
        action: '/upload/xhr',
        value: [
          { name: 'test1.jpg', src: '/test1.jpg' },
          { name: 'test2.mp4', src: '/test2.mp4' }
        ],
        type: 'media'
      }
    })

    let items = wrapper
      .findAll('.veui-uploader-list-media-mask')
      .at(1)
      .findAll('.veui-control-item')
    items.at(0).trigger('click')
    await wait(0)
    let lightBox = wrapper.find(Lightbox)
    expect(lightBox.vm.open).to.equal(true)
    expect(lightBox.vm.index).to.equal(1)

    wrapper.destroy()
  })

  it('should handle replace correctly.', async function () {
    let wrapper = mount(Uploader, {
      sync: false,
      attachToDocument: true,
      propsData: {
        action: '/upload/xhr?force=success&latency=0',
        value: [{ name: 'test.jpg', src: '/test.jpg' }],
        type: 'image'
      }
    })

    let promise = waitForEvent(wrapper.vm, 'success')

    wrapper
      .find('.veui-uploader-controls')
      .findAll('.veui-control-item')
      .at(1)
      .trigger('click')
    await wait(0)

    let mockFile = createFile('虚化身体.png', 'image/png', 128 * 1024)
    let input = wrapper.find('input[type="file"]')
    input.element.files = createFileList(mockFile)
    input.trigger('change')
    await promise

    let file = wrapper.emitted('change')[0][0][0]
    expect(file.name).to.equal('虚化身体.png')

    wrapper.destroy()
  })

  it('should render desc slot correctly.', function () {
    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        action: '/upload/xhr'
      },
      slots: {
        desc: 'jpg only.'
      }
    })

    expect(wrapper.find('.veui-uploader-desc').text()).to.equal('jpg only.')
    wrapper.destroy()
  })

  it('should render button label slot correctly.', function () {
    let wrapper = mount(Uploader, {
      propsData: {
        action: '/upload/xhr'
      },
      slots: {
        'button-label': '<span class="test-label">upload</span>'
      }
    })

    expect(wrapper.find('.test-label').text()).to.equal('upload')
    wrapper.destroy()
  })

  it('should render file-before file-after slot correctly.', async function () {
    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        action: '/upload/xhr',
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

  it('should reorder files when move event triggered.', async function () {
    let wrapper = mount(Uploader, {
      sync: false,
      propsData: {
        type: 'image',
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
    wrapper.vm.$children[0].$emit('move', 0, 2)

    let value = wrapper.emitted('change')[0][0]
    expect(value[0].key).to.equal('yyyy')
    expect(value[1].key).to.equal('xxxx')

    wrapper.destroy()
  })
})

function waitForEvent (vm, event) {
  return new Promise(function (resolve, reject) {
    vm.$once(event, resolve)
  })
}

function waitForEvents (vm, events) {
  let p = waitForEvent(vm, events[0])
  events.slice(1).reduce(function (promise, event) {
    let p = waitForEvent(vm, event)
    promise.then(() => p)
    return p
  }, p)
  return p
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
