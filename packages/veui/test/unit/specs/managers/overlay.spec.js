import { Tree } from '@/managers/overlay'
import { isFunction } from 'lodash'

describe('managers/overlay', () => {
  describe('Node', () => {
    describe('#constructor', () => {
      it('should create an instance of Node', () => {
        let node = new Tree().root

        expect(node.hasOwnProperty('parent')).to.be.equal(true)
        expect(node.hasOwnProperty('childrenGroup')).to.be.equal(true)
        expect(node.hasOwnProperty('id')).to.be.equal(true)
        expect(node.hasOwnProperty('order')).to.be.equal(true)
      })
    })

    describe('#appendChild', () => {
      it('should append child', () => {
        let node = new Tree().root
        expect(node.childrenGroup.length).to.be.equal(0)
        node.appendChild(new Tree().root)
        expect(node.childrenGroup.length).to.be.equal(1)
        expect(node.childrenGroup[0].children.length).to.be.equal(1)
      })

      it("should append the current node to the last position of the group's last children", () => {
        let node = new Tree().root
        let child1 = new Tree().root
        let child2 = new Tree().root
        node.appendChild(child1)
        node.appendChild(child2)
        expect(node.childrenGroup[0].children[0]).to.be.equal(child1)
        expect(node.childrenGroup[0].children[1]).to.be.equal(child2)
      })

      it('should place the node with different priority in different group', () => {
        let node = new Tree().root
        let child1 = new Tree().root
        let child2 = new Tree().root
        node.appendChild(child1, 1)
        node.appendChild(child2, 2)
        expect(node.childrenGroup[0].children[0]).to.be.equal(child1)
        expect(node.childrenGroup[1].children[0]).to.be.equal(child2)
      })

      it('should insert the node with bigger priority at the right position', () => {
        let node = new Tree().root
        let child1 = new Tree().root
        let child2 = new Tree().root
        node.appendChild(child1, 1)
        node.appendChild(child2, 2)
        expect(node.childrenGroup[0].children[0]).to.be.equal(child1)
        expect(node.childrenGroup[1].children[0]).to.be.equal(child2)
      })

      it('should insert the node with smaller priority at the left position', () => {
        let node = new Tree().root
        let child1 = new Tree().root
        let child2 = new Tree().root
        node.appendChild(child1, 2)
        node.appendChild(child2, 1)
        expect(node.childrenGroup[1].children[0]).to.be.equal(child1)
        expect(node.childrenGroup[0].children[0]).to.be.equal(child2)
      })

      it("should record the group's priority", () => {
        let node = new Tree().root
        let child1 = new Tree().root
        let child2 = new Tree().root
        node.appendChild(child1, 1)
        node.appendChild(child2, 2)
        expect(node.childrenGroup[0].priority).to.be.equal(1)
        expect(node.childrenGroup[1].priority).to.be.equal(2)
      })
    })

    describe('#removeChildById', () => {
      it('should remove child by id', () => {
        let node = new Tree().root
        let child1 = new Tree().root

        expect(node.getChildrenCount()).to.be.equal(0)
        node.appendChild(child1)
        expect(node.getChildrenCount()).to.be.equal(1)
        node.removeChildById(child1.id)
        expect(node.getChildrenCount()).to.be.equal(0)
      })
    })

    describe('#remove', () => {
      it('should remove self from parent', () => {
        let node = new Tree().root
        let child1 = new Tree().root

        expect(node.getChildrenCount()).to.be.equal(0)
        node.appendChild(child1)
        expect(node.getChildrenCount()).to.be.equal(1)
        child1.remove()
        expect(node.getChildrenCount()).to.be.equal(0)
      })

      it('should remove a node in subtree that is not under the root.', () => {
        let tree = new Tree()

        let nodeHandle1 = tree.createNode({ priority: 1 })
        let nodeHandle2 = tree.createNode({
          priority: 1,
          parentId: nodeHandle1.id
        })
        let nodeHandle3 = tree.createNode({
          priority: 1,
          parentId: nodeHandle2.id
        })

        nodeHandle2.remove()
        expect(() => nodeHandle3.remove()).to.not.throw()
      })
    })

    describe('#getChildrenCount', () => {
      it('should get children count', () => {
        let node = new Tree().root
        let child1 = new Tree().root
        let child2 = new Tree().root

        expect(node.getChildrenCount()).to.be.equal(0)
        node.appendChild(child1)
        expect(node.getChildrenCount()).to.be.equal(1)
        node.appendChild(child2, 1)
        expect(node.getChildrenCount()).to.be.equal(2)
      })
    })
  })

  describe('Tree', () => {
    describe('#constructor', () => {
      it('should create a Tree instance', () => {
        let tree = new Tree()
        expect(tree.hasOwnProperty('root')).to.be.equal(true)
        expect(tree.hasOwnProperty('nodeMap')).to.be.equal(true)
        expect(tree.hasOwnProperty('baseOrder')).to.be.equal(true)
      })
    })

    describe('#createNode', () => {
      it('should create a `Node` handle', () => {
        let tree = new Tree()
        let nodeHandle = tree.createNode()

        expect(nodeHandle.hasOwnProperty('id')).to.be.equal(true)
        expect(isFunction(nodeHandle.remove)).to.be.equal(true)
        expect(isFunction(nodeHandle.appendTo)).to.be.equal(true)
        expect(isFunction(nodeHandle.toTop)).to.be.equal(true)
      })
    })

    describe('#setBaseOrder', () => {
      it('should set the base order of the tree', () => {
        let tree = new Tree()
        tree.setBaseOrder(201)
        expect(tree.baseOrder).to.be.equal(201)
        tree.setBaseOrder(202)
        expect(tree.baseOrder).to.be.equal(202)
      })
    })

    describe('#iterate', () => {
      it('should iterate children in order', () => {
        let tree = new Tree()
        let childIdList = []
        childIdList[0] = tree.root.id
        childIdList[1] = tree.createNode().id
        childIdList[2] = tree.createNode({ parentId: childIdList[0] }).id
        childIdList[4] = tree.createNode({
          parentId: childIdList[0],
          priority: 10
        }).id
        childIdList[3] = tree.createNode({
          parentId: childIdList[0],
          priority: 8
        }).id

        let counter = 0
        let total = childIdList.length
        tree.iterate({
          callback (child) {
            counter++
            expect(childIdList.shift()).to.be.equal(child.id)
          }
        })
        expect(counter).to.be.equal(total)
      })

      it('should stop iteration white return true in callback', () => {
        let tree = new Tree()
        let childIdList = []
        childIdList[0] = tree.root.id
        childIdList[1] = tree.createNode().id
        childIdList[2] = tree.createNode({ parentId: childIdList[0] }).id
        childIdList[4] = tree.createNode({
          parentId: childIdList[0],
          priority: 10
        }).id
        childIdList[3] = tree.createNode({
          parentId: childIdList[0],
          priority: 8
        }).id

        let counter = 0
        tree.iterate({
          callback (child) {
            counter++
            return counter === 1
          }
        })
        expect(counter).to.be.equal(1)
      })
    })

    describe('#createNode', () => {
      it('should create a node and append it to parent', () => {
        let tree = new Tree()
        expect(tree.nodeMap[tree.root.id].node.getChildrenCount()).to.be.equal(0)

        tree.createNode()
        expect(tree.nodeMap[tree.root.id].node.getChildrenCount()).to.be.equal(1)

        tree.createNode()
        expect(tree.nodeMap[tree.root.id].node.getChildrenCount()).to.be.equal(2)

        tree.createNode({ priority: 5 })
        expect(tree.nodeMap[tree.root.id].node.getChildrenCount()).to.be.equal(3)

        let nodeHandle = tree.createNode({ priority: 2 })
        expect(tree.nodeMap[tree.root.id].node.getChildrenCount()).to.be.equal(4)

        tree.createNode({ priority: 5, parentId: nodeHandle.id })
        expect(tree.nodeMap[tree.root.id].node.getChildrenCount()).to.be.equal(4)
      })

      it('should receive `orderchange` event', done => {
        let tree = new Tree()
        let nodeHandle = tree.createNode({
          orderChangeCallback: order => {
            if (order !== 100) {
              return done(new Error('expect order to be 100'))
            }
            done()
          }
        })

        tree
          .createNode({
            parentId: nodeHandle.id,
            orderChangeCallback: order => {
              if (order !== 101) {
                return done(new Error('expect order to be 101'))
              }
              done()
            }
          })
      })
    })

    describe('#generateTreeOrder', () => {
      it('should generate order for tree', () => {
        let tree = new Tree()
        let nodeHandle = tree.createNode()
        expect(tree.nodeMap[nodeHandle.id].node.order).to.be.equal(tree.baseOrder)
      })

      it('should generate bigger order for the latter node', () => {
        let tree = new Tree()
        let nodeHandle = tree.createNode({ parentId: tree.root.id })
        expect(tree.nodeMap[nodeHandle.id].node.order).to.be.equal(tree.baseOrder)

        let nodeHandle1 = tree.createNode({ parentId: nodeHandle.id })
        expect(tree.nodeMap[nodeHandle1.id].node.order).to.be.equal(
          tree.baseOrder + 1
        )

        let nodeHandle2 = tree.createNode({ parentId: nodeHandle.id })
        expect(tree.nodeMap[nodeHandle2.id].node.order).to.be.equal(
          tree.baseOrder + 2
        )

        let nodeHandle3 = tree.createNode({
          parentId: nodeHandle.id,
          priority: 2
        })
        expect(tree.nodeMap[nodeHandle3.id].node.order).to.be.equal(
          tree.baseOrder + 3
        )

        let nodeHandle4 = tree.createNode({
          parentId: nodeHandle.id,
          priority: 6
        })
        expect(tree.nodeMap[nodeHandle4.id].node.order).to.be.equal(
          tree.baseOrder + 4
        )

        let nodeHandle5 = tree.createNode({
          parentId: nodeHandle.id,
          priority: 3
        })
        expect(tree.nodeMap[nodeHandle5.id].node.order).to.be.equal(
          tree.baseOrder + 4
        )
        expect(tree.nodeMap[nodeHandle4.id].node.order).to.be.equal(
          tree.baseOrder + 5
        )
      })
    })
  })

  describe('NodeHandle', () => {
    describe('#remove', () => {
      it('should remove self from parent', () => {
        let tree = new Tree()
        expect(tree.root.getChildrenCount()).to.be.equal(0)
        let nodeHandle = tree.createNode()
        expect(tree.root.getChildrenCount()).to.be.equal(1)
        nodeHandle.remove()
        expect(tree.root.getChildrenCount()).to.be.equal(0)
      })
    })

    describe('#appendTo', () => {
      it('should append self to specified parent', () => {
        let tree = new Tree()
        let nodeHandles1 = [tree.root, tree.createNode(), tree.createNode()]
        let nodeHandles2 = [nodeHandles1[0], nodeHandles1[2], nodeHandles1[1]]

        let index = 0
        tree.iterate({
          callback (cur) {
            expect(cur.id).to.be.equal(nodeHandles1[index].id)
            index++
          }
        })
        expect(index).to.be.equal(nodeHandles1.length)

        nodeHandles1[1].appendTo(nodeHandles1[2].id)
        index = 0
        tree.iterate({
          callback (cur) {
            expect(cur.id).to.be.equal(nodeHandles2[index].id)
            index++
          }
        })
        expect(index).to.be.equal(nodeHandles2.length)
      })
    })

    describe('#toTop', () => {
      it("should bring the current node to the current group's last position", () => {
        let tree = new Tree()
        let nodeHandle1 = tree.createNode({ priority: 1 })
        let nodeHandle2 = tree.createNode({ priority: 1 })

        expect(tree.root.childrenGroup[0].children[0].id).to.be.equal(
          nodeHandle1.id
        )
        expect(tree.root.childrenGroup[0].children[1].id).to.be.equal(
          nodeHandle2.id
        )

        nodeHandle1.toTop()
        expect(tree.root.childrenGroup[0].children[1].id).to.be.equal(
          nodeHandle1.id
        )
        expect(tree.root.childrenGroup[0].children[0].id).to.be.equal(
          nodeHandle2.id
        )
      })

      it('should generate the correct order value', () => {
        let tree = new Tree()
        tree.setBaseOrder(200)

        let nodeHandle1 = tree.createNode({ priority: 1 })
        let nodeHandle2 = tree.createNode({ priority: 1 })
        let nodeHandle3 = tree.createNode({ priority: 1 })

        nodeHandle3.appendTo(nodeHandle1.id)
        expect(tree.nodeMap[nodeHandle1.id].node.order).to.be.equal(200)
        expect(tree.nodeMap[nodeHandle2.id].node.order).to.be.equal(202)
        expect(tree.nodeMap[nodeHandle3.id].node.order).to.be.equal(201)

        nodeHandle1.toTop()
        expect(tree.nodeMap[nodeHandle1.id].node.order).to.be.equal(201)
        expect(tree.nodeMap[nodeHandle2.id].node.order).to.be.equal(200)
        expect(tree.nodeMap[nodeHandle3.id].node.order).to.be.equal(202)
      })

      it('should fix the tail.', () => {
        let tree = new Tree()

        let nodeHandle1 = tree.createNode({ priority: 1 })
        let nodeHandle2 = tree.createNode({ priority: 1 })
        let nodeHandle3 = tree.createNode({
          parentId: nodeHandle1.id,
          priority: 1
        })
        let nodeHandle4 = tree.createNode({
          parentId: nodeHandle1.id,
          priority: 1
        })
        let nodeHandle5 = tree.createNode({
          parentId: nodeHandle4.id,
          priority: 1
        })
        let nodeHandle6 = tree.createNode({
          parentId: nodeHandle4.id,
          priority: 1
        })

        nodeHandle1.toTop()
        expect(tree.nodeMap[nodeHandle2.id].node.order).to.be.equal(100)
        expect(tree.nodeMap[nodeHandle1.id].node.order).to.be.equal(101)
        expect(tree.nodeMap[nodeHandle3.id].node.order).to.be.equal(102)
        expect(tree.nodeMap[nodeHandle4.id].node.order).to.be.equal(103)
        expect(tree.nodeMap[nodeHandle5.id].node.order).to.be.equal(104)
        expect(tree.nodeMap[nodeHandle6.id].node.order).to.be.equal(105)
      })

      it('should properly set the tail node\'s next node.', () => {
        let tree = new Tree()

        let nodeHandle2 = tree.createNode()
        let nodeHandle3 = tree.createNode({ parentId: nodeHandle2.id })
        let nodeHandle4 = tree.createNode({ parentId: nodeHandle3.id })
        tree.createNode({
          parentId: nodeHandle4.id,
          priority: 1
        })
        tree.createNode({
          parentId: nodeHandle4.id,
          priority: 1
        })
        let nodeHandle7 = tree.createNode({
          parentId: nodeHandle4.id,
          priority: 1
        })

        nodeHandle2.toTop()
        expect(tree.nodeMap[nodeHandle7.id].node.next).to.be.equal(null)
      })
    })

    it('should properly fix the broken nodes\' previous node.', () => {
      let tree = new Tree()

      let nodeHandle2 = tree.createNode()
      tree.createNode({ parentId: nodeHandle2.id })
      tree.createNode({ parentId: nodeHandle2.id })
      let nodeHandle3 = tree.createNode({ parentId: nodeHandle2.id })
      let nodeHandle4 = tree.createNode({ priority: 100 })

      expect(tree.nodeMap[nodeHandle4.id].node.previous).to.be.equal(tree.nodeMap[nodeHandle3.id].node)
    })
  })
})
