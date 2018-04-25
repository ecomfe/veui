import { Tree } from '@/managers/overlay'
import { isFunction } from 'lodash'

describe('managers/overlay', () => {
  describe('Node', () => {
    describe('#constructor', () => {
      it('should create an instance of Node', () => {
        let node = (new Tree()).rootNode

        expect(node.hasOwnProperty('parent')).to.equal(true)
        expect(node.hasOwnProperty('childrenGroup')).to.equal(true)
        expect(node.hasOwnProperty('id')).to.equal(true)
        expect(node.hasOwnProperty('zIndex')).to.equal(true)
      })
    })

    describe('#appendChild', () => {
      it('should append child', () => {
        let node = (new Tree()).rootNode
        expect(node.childrenGroup.length).to.equal(0)
        node.appendChild((new Tree()).rootNode)
        expect(node.childrenGroup.length).to.equal(1)
        expect(node.childrenGroup[0].children.length).to.equal(1)
      })

      it('should append the current node to the last position of the group\'s last children', () => {
        let node = (new Tree()).rootNode
        let child1 = (new Tree()).rootNode
        let child2 = (new Tree()).rootNode
        node.appendChild(child1)
        node.appendChild(child2)
        expect(node.childrenGroup[0].children[0]).to.equal(child1)
        expect(node.childrenGroup[0].children[1]).to.equal(child2)
      })

      it('should place the node with different priority in different group', () => {
        let node = (new Tree()).rootNode
        let child1 = (new Tree()).rootNode
        let child2 = (new Tree()).rootNode
        node.appendChild(child1, 1)
        node.appendChild(child2, 2)
        expect(node.childrenGroup[0].children[0]).to.equal(child1)
        expect(node.childrenGroup[1].children[0]).to.equal(child2)
      })

      it('should insert the node with bigger priority at the right position', () => {
        let node = (new Tree()).rootNode
        let child1 = (new Tree()).rootNode
        let child2 = (new Tree()).rootNode
        node.appendChild(child1, 1)
        node.appendChild(child2, 2)
        expect(node.childrenGroup[0].children[0]).to.equal(child1)
        expect(node.childrenGroup[1].children[0]).to.equal(child2)
      })

      it('should insert the node with smaller priority at the left position', () => {
        let node = (new Tree()).rootNode
        let child1 = (new Tree()).rootNode
        let child2 = (new Tree()).rootNode
        node.appendChild(child1, 2)
        node.appendChild(child2, 1)
        expect(node.childrenGroup[1].children[0]).to.equal(child1)
        expect(node.childrenGroup[0].children[0]).to.equal(child2)
      })

      it('should record the group\'s priority', () => {
        let node = (new Tree()).rootNode
        let child1 = (new Tree()).rootNode
        let child2 = (new Tree()).rootNode
        node.appendChild(child1, 1)
        node.appendChild(child2, 2)
        expect(node.childrenGroup[0].priority).to.equal(1)
        expect(node.childrenGroup[1].priority).to.equal(2)
      })
    })

    describe('#removeChildById', () => {
      it('should remove child by id', () => {
        let node = (new Tree()).rootNode
        let child1 = (new Tree()).rootNode

        expect(node.getChildrenCount()).to.equal(0)
        node.appendChild(child1)
        expect(node.getChildrenCount()).to.equal(1)
        node.removeChildById(child1.id)
        expect(node.getChildrenCount()).to.equal(0)
      })
    })

    describe('#remove', () => {
      it('should remove self from parent', () => {
        let node = (new Tree()).rootNode
        let child1 = (new Tree()).rootNode

        expect(node.getChildrenCount()).to.equal(0)
        node.appendChild(child1)
        expect(node.getChildrenCount()).to.equal(1)
        child1.remove()
        expect(node.getChildrenCount()).to.equal(0)
      })

      it('should remove a node in subtree that is not under the rootNode.', () => {
        let tree = new Tree()

        let nodeHandle1 = tree.createNode({ priority: 1 })
        let nodeHandle2 = tree.createNode({ priority: 1, parentId: nodeHandle1.id })
        let nodeHandle3 = tree.createNode({ priority: 1, parentId: nodeHandle2.id })

        nodeHandle2.remove()
        expect(() => nodeHandle3.remove()).to.not.throw()
      })
    })

    describe('#getChildrenCount', () => {
      it('should get children count', () => {
        let node = (new Tree()).rootNode
        let child1 = (new Tree()).rootNode
        let child2 = (new Tree()).rootNode

        expect(node.getChildrenCount()).to.equal(0)
        node.appendChild(child1)
        expect(node.getChildrenCount()).to.equal(1)
        node.appendChild(child2, 1)
        expect(node.getChildrenCount()).to.equal(2)
      })
    })
  })

  describe('Tree', () => {
    describe('#constructor', () => {
      it('should create a Tree instance', () => {
        let tree = new Tree()
        expect(tree.hasOwnProperty('rootNode')).to.equal(true)
        expect(tree.hasOwnProperty('nodeMap')).to.equal(true)
        expect(tree.hasOwnProperty('baseZIndex')).to.equal(true)
      })
    })

    describe('#createNode', () => {
      it('should create a `Node` handle', () => {
        let tree = new Tree()
        let nodeHandle = tree.createNode()

        expect(nodeHandle.hasOwnProperty('id')).to.equal(true)
        expect(isFunction(nodeHandle.remove)).to.equal(true)
        expect(isFunction(nodeHandle.appendTo)).to.equal(true)
        expect(isFunction(nodeHandle.toTop)).to.equal(true)
      })
    })

    describe('#setBaseZIndex', () => {
      it('should set the base zIndex of the tree', () => {
        let tree = new Tree()
        tree.setBaseZIndex(201)
        expect(tree.baseZIndex).to.equal(201)
        tree.setBaseZIndex(202)
        expect(tree.baseZIndex).to.equal(202)
      })
    })

    describe('#iterate', () => {
      it('should iterate children in order', () => {
        let tree = new Tree()
        let childIdList = []
        childIdList[0] = tree.rootNode.id
        childIdList[1] = tree.createNode().id
        childIdList[2] = tree.createNode({parentId: childIdList[0]}).id
        childIdList[4] = tree.createNode({parentId: childIdList[0], priority: 10}).id
        childIdList[3] = tree.createNode({parentId: childIdList[0], priority: 8}).id

        let counter = 0
        let total = childIdList.length
        tree.iterate({
          callback (child) {
            counter++
            expect(childIdList.shift()).to.equal(child.id)
          }
        })
        expect(counter).to.equal(total)
      })

      it('should stop iteration white return true in callback', () => {
        let tree = new Tree()
        let childIdList = []
        childIdList[0] = tree.rootNode.id
        childIdList[1] = tree.createNode().id
        childIdList[2] = tree.createNode({parentId: childIdList[0]}).id
        childIdList[4] = tree.createNode({parentId: childIdList[0], priority: 10}).id
        childIdList[3] = tree.createNode({parentId: childIdList[0], priority: 8}).id

        let counter = 0
        tree.iterate({
          callback (child) {
            counter++
            return counter === 1
          }
        })
        expect(counter).to.equal(1)
      })
    })

    describe('#createNode', () => {
      it('should create a node and append it to parent', () => {
        let tree = new Tree()
        expect(tree.nodeMap[tree.rootNode.id].node.getChildrenCount()).to.equal(0)

        tree.createNode()
        expect(tree.nodeMap[tree.rootNode.id].node.getChildrenCount()).to.equal(1)

        tree.createNode()
        expect(tree.nodeMap[tree.rootNode.id].node.getChildrenCount()).to.equal(2)

        tree.createNode({priority: 5})
        expect(tree.nodeMap[tree.rootNode.id].node.getChildrenCount()).to.equal(3)

        let nodeHandle = tree.createNode({priority: 2})
        expect(tree.nodeMap[tree.rootNode.id].node.getChildrenCount()).to.equal(4)

        tree.createNode({priority: 5, parentId: nodeHandle.id})
        expect(tree.nodeMap[tree.rootNode.id].node.getChildrenCount()).to.equal(4)
      })

      it('should receive `zindexchange` event', (done) => {
        let tree = new Tree()
        let nodeHandle = tree.createNode()
        nodeHandle.$on('zindexchange', (zIndex) => {
          if (zIndex !== 100) {
            return done(new Error('expect zIndex to be 100'))
          }
          done()
        })

        tree.createNode({ parentId: nodeHandle.id }).$on('zindexchange', (zIndex) => {
          if (zIndex !== 101) {
            return done(new Error('expect zIndex to be 101'))
          }
          done()
        })
      })
    })

    describe('#generateTreeZIndex', () => {
      it('should generate zIndex for tree', () => {
        let tree = new Tree()
        let nodeHandle = tree.createNode()
        expect(tree.nodeMap[nodeHandle.id].node.zIndex).to.equal(tree.baseZIndex)
      })

      it('should generate bigger zIndex for the latter node', () => {
        let tree = new Tree()
        let nodeHandle = tree.createNode({ parentId: tree.rootNode.id })
        expect(tree.nodeMap[nodeHandle.id].node.zIndex).to.equal(tree.baseZIndex)

        let nodeHandle1 = tree.createNode({ parentId: nodeHandle.id })
        expect(tree.nodeMap[nodeHandle1.id].node.zIndex).to.equal(tree.baseZIndex + 1)

        let nodeHandle2 = tree.createNode({ parentId: nodeHandle.id })
        expect(tree.nodeMap[nodeHandle2.id].node.zIndex).to.equal(tree.baseZIndex + 2)

        let nodeHandle3 = tree.createNode({ parentId: nodeHandle.id, priority: 2 })
        expect(tree.nodeMap[nodeHandle3.id].node.zIndex).to.equal(tree.baseZIndex + 3)

        let nodeHandle4 = tree.createNode({ parentId: nodeHandle.id, priority: 6 })
        expect(tree.nodeMap[nodeHandle4.id].node.zIndex).to.equal(tree.baseZIndex + 4)

        let nodeHandle5 = tree.createNode({ parentId: nodeHandle.id, priority: 3 })
        expect(tree.nodeMap[nodeHandle5.id].node.zIndex).to.equal(tree.baseZIndex + 4)
        expect(tree.nodeMap[nodeHandle4.id].node.zIndex).to.equal(tree.baseZIndex + 5)
      })
    })
  })

  describe('NodeHandle', () => {
    describe('#remove', () => {
      it('should remove self from parent', () => {
        let tree = new Tree()
        expect(tree.rootNode.getChildrenCount()).to.equal(0)
        let nodeHandle = tree.createNode()
        expect(tree.rootNode.getChildrenCount()).to.equal(1)
        nodeHandle.remove()
        expect(tree.rootNode.getChildrenCount()).to.equal(0)
      })
    })

    describe('#appendTo', () => {
      it('should append self to specified parent', () => {
        let tree = new Tree()
        let nodeHandles1 = [tree.rootNode, tree.createNode(), tree.createNode()]
        let nodeHandles2 = [nodeHandles1[0], nodeHandles1[2], nodeHandles1[1]]

        let index = 0
        tree.iterate({
          callback (cur) {
            expect(cur.id).to.equal(nodeHandles1[index].id)
            index++
          }
        })
        expect(index).to.equal(nodeHandles1.length)

        nodeHandles1[1].appendTo(nodeHandles1[2].id)
        index = 0
        tree.iterate({
          callback (cur) {
            expect(cur.id).to.equal(nodeHandles2[index].id)
            index++
          }
        })
        expect(index).to.equal(nodeHandles2.length)
      })
    })

    describe('#toTop', () => {
      it('should bring the current node to the current group\'s last position', () => {
        let tree = new Tree()
        let nodeHandle1 = tree.createNode({ priority: 1 })
        let nodeHandle2 = tree.createNode({ priority: 1 })

        expect(tree.rootNode.childrenGroup[0].children[0].id).to.equal(nodeHandle1.id)
        expect(tree.rootNode.childrenGroup[0].children[1].id).to.equal(nodeHandle2.id)

        nodeHandle1.toTop()
        expect(tree.rootNode.childrenGroup[0].children[1].id).to.equal(nodeHandle1.id)
        expect(tree.rootNode.childrenGroup[0].children[0].id).to.equal(nodeHandle2.id)
      })

      it('should generate the correct zIndex value', () => {
        let tree = new Tree()
        tree.setBaseZIndex(200)

        let nodeHandle1 = tree.createNode({ priority: 1 })
        let nodeHandle2 = tree.createNode({ priority: 1 })
        let nodeHandle3 = tree.createNode({ priority: 1 })

        nodeHandle3.appendTo(nodeHandle1.id)
        expect(tree.nodeMap[nodeHandle1.id].node.zIndex).to.equal(200)
        expect(tree.nodeMap[nodeHandle2.id].node.zIndex).to.equal(202)
        expect(tree.nodeMap[nodeHandle3.id].node.zIndex).to.equal(201)

        nodeHandle1.toTop()
        expect(tree.nodeMap[nodeHandle1.id].node.zIndex).to.equal(201)
        expect(tree.nodeMap[nodeHandle2.id].node.zIndex).to.equal(200)
        expect(tree.nodeMap[nodeHandle3.id].node.zIndex).to.equal(202)
      })

      it('should fix the tail.', () => {
        let tree = new Tree()

        let nodeHandle1 = tree.createNode({ priority: 1 })
        let nodeHandle2 = tree.createNode({ priority: 1 })
        let nodeHandle3 = tree.createNode({ parentId: nodeHandle1.id, priority: 1 })
        let nodeHandle4 = tree.createNode({ parentId: nodeHandle1.id, priority: 1 })
        let nodeHandle5 = tree.createNode({ parentId: nodeHandle4.id, priority: 1 })
        let nodeHandle6 = tree.createNode({ parentId: nodeHandle4.id, priority: 1 })

        nodeHandle1.toTop()
        expect(tree.nodeMap[nodeHandle2.id].node.zIndex).to.equal(100)
        expect(tree.nodeMap[nodeHandle1.id].node.zIndex).to.equal(101)
        expect(tree.nodeMap[nodeHandle3.id].node.zIndex).to.equal(102)
        expect(tree.nodeMap[nodeHandle4.id].node.zIndex).to.equal(103)
        expect(tree.nodeMap[nodeHandle5.id].node.zIndex).to.equal(104)
        expect(tree.nodeMap[nodeHandle6.id].node.zIndex).to.equal(105)
      })
    })
  })
})

