import { OverlayManager } from '@/managers/overlay'

describe('managers/overlay', () => {
  describe('Node', () => {
    describe('#appendChild', () => {
      it('should append child', () => {
        let mgr = new OverlayManager()
        let parent = mgr.createNode()
        let child = mgr.createNode({ parent })
        expect(mgr.root.children.length).to.equal(1)
        expect(parent.children.length).to.equal(1)
        expect(child.children.length).to.equal(0)
      })

      it("should append the current node to the last position of the group's last children", () => {
        let mgr = new OverlayManager()
        let child1 = mgr.createNode()
        let child2 = mgr.createNode()
        expect(mgr.root.children[0]).to.equal(child1)
        expect(mgr.root.children[1]).to.equal(child2)
      })

      it('should sort nodes with different priority correctly', () => {
        let mgr = new OverlayManager()
        let child1 = mgr.createNode({ priority: 3 })
        let child2 = mgr.createNode({ priority: 1 })
        expect(mgr.root.children[0]).to.equal(child2)
        expect(mgr.root.children[1]).to.equal(child1)
      })
    })

    describe('#remove', () => {
      it('should remove self from parent', () => {
        let mgr = new OverlayManager()
        let parent = mgr.createNode()
        let child = mgr.createNode()

        expect(parent.children.length).to.equal(0)
        parent.append(child)
        expect(parent.children.length).to.equal(1)
        child.remove()
        expect(parent.children.length).to.equal(0)

        child = mgr.createNode({ parent })
        parent.remove()

        let node = mgr.createNode({ parent: null })
        expect(mgr.root.children[mgr.root.children.length - 1]).to.equal(node)

        expect(() => {
          mgr.createNode({ parentId: child.id })
        }).to.throw(Error, `The given node id doesn't exist!`)
      })
    })

    describe('#toTop', () => {
      it('should move node to the last among nodes with the same priority', () => {
        let mgr = new OverlayManager()
        mgr.createNode({ priority: 2 })
        mgr.createNode({ priority: 2 })
        let node = mgr.createNode({ priority: 1 })
        mgr.createNode({ priority: 1 })

        expect(mgr.root.children[0]).to.equal(node)
        node.toTop()
        expect(mgr.root.children[1]).to.equal(node)
      })
    })
  })

  describe('OverlayManager', () => {
    describe('#constructor', () => {
      it('should create an OverlayManager instance', () => {
        let mgr = new OverlayManager()
        expect(typeof mgr.createNode).to.equal('function')
        expect(typeof mgr.setBaseOrder).to.equal('function')

        mgr = new OverlayManager({
          baseOrder: 300
        })
        expect(mgr.baseOrder).to.equal(300)
      })
    })

    describe('#createNode', () => {
      it('should create a `Node` correctly', () => {
        let mgr = new OverlayManager()
        let node = mgr.createNode()

        expect('id' in node).to.equal(true)
        expect('order' in node).to.equal(true)
        expect(typeof node.remove).to.equal('function')
        expect(typeof node.appendTo).to.equal('function')
        expect(typeof node.toTop).to.equal('function')
      })
    })

    describe('#setBaseOrder', () => {
      it('should set the base order of the tree', () => {
        let mgr = new OverlayManager()
        mgr.setBaseOrder(201)
        expect(mgr.baseOrder).to.equal(201)
        mgr.setBaseOrder(202)
        expect(mgr.baseOrder).to.equal(202)
      })
    })

    describe('#createNode', () => {
      it('should create a node and append it to parent', () => {
        let mgr = new OverlayManager()
        expect(mgr.root.children.length).to.equal(0)

        mgr.createNode()
        expect(mgr.root.children.length).to.equal(1)

        mgr.createNode()
        expect(mgr.root.children.length).to.equal(2)

        mgr.createNode({ priority: 5 })
        expect(mgr.root.children.length).to.equal(3)

        let parent = mgr.createNode({ priority: 2 })
        expect(mgr.root.children.length).to.equal(4)

        mgr.createNode({ priority: 5, parentId: parent.id })
        expect(mgr.root.children.length).to.equal(4)
        expect(parent.children.length).to.equal(1)

        mgr.createNode({ priority: 5, parent })
        expect(mgr.root.children.length).to.equal(4)
        expect(parent.children.length).to.equal(2)
      })

      it('should respect `orderChangeCallback` and `onOrderChange`', done => {
        let mgr = new OverlayManager()
        let parent = mgr.createNode({
          orderChangeCallback: order => {
            expect(order).to.equal(100)
          }
        })

        mgr.createNode({
          parent,
          onOrderChange: order => {
            expect(order).to.equal(101)
            done()
          }
        })
      })
    })

    describe('#reorder', () => {
      it('should generate bigger order for the latter node', () => {
        let mgr = new OverlayManager()
        let node = mgr.createNode()
        expect(node.order).to.equal(mgr.baseOrder)

        let node1 = mgr.createNode({ parent: node })
        expect(node1.order).to.equal(mgr.baseOrder + 1)

        let node2 = mgr.createNode({ parent: node })
        expect(node2.order).to.equal(mgr.baseOrder + 2)

        let node3 = mgr.createNode({ parent: node, priority: 2 })
        expect(node3.order).to.equal(mgr.baseOrder + 3)

        let node4 = mgr.createNode({ parent: node, priority: 6 })
        expect(node4.order).to.equal(mgr.baseOrder + 4)

        let node5 = mgr.createNode({ parent: node, priority: 3 })
        expect(node5.order).to.equal(mgr.baseOrder + 4)
        expect(node4.order).to.equal(mgr.baseOrder + 5)
      })
    })
  })
})
