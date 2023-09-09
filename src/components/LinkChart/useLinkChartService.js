import { Graph, Dom } from '@antv/x6'
import dagre from 'dagre'
import insertCss from 'insert-css'
import { ref, onMounted, watch } from 'vue'

export default function useLinkChartService(props) {
  const data = props.data
  const container = ref(null)
  const imgMap = {
    1: require('@/assets/fulllink/user.png'),
    2: require('@/assets/fulllink/pc.png'),
    3: require('@/assets/fulllink/link.png'),
    4: require('@/assets/fulllink/database.png'),
  }
  function insertNode(node, sourceId, targetId, newNode) {
    if (node.id === sourceId) {
      node.children = node.children ?? []
      const index = node.children.findIndex((item) => item.id === targetId)
      if (index !== -1) {
        newNode.children = [node.children[index]]
        node.children.splice(index, 1, newNode)
      }
    }
    if (node.children) {
      for (const subNode of node.children) {
        insertNode(subNode, sourceId, targetId, newNode)
      }
    }
  }
  function addNodeChild(node, targetId, newNode) {
    if (node.id === targetId) {
      node.children = node.children ?? []
      node.children.push(newNode)
    }
    if (node.children) {
      for (const subNode of node.children) {
        addNodeChild(subNode, targetId, newNode)
      }
    }
  }
  function deleteNode(node, targetId, parent = null) {
    if (node.id === targetId) {
      if (parent) {
        const index = parent.children.findIndex((item) => item.id === targetId)
        if (index !== -1) {
          parent.children.splice(index, 1)
        }
      }
    }
    if (node.children) {
      for (const subNode of node.children) {
        deleteNode(subNode, targetId, node)
      }
    }
  }
  function removeNode(node, targetId, parent = null) {
    if (node.id === targetId) {
      if (parent) {
        const index = parent.children.findIndex((item) => item.id === targetId)
        if (index !== -1) {
          const targetChildren = parent.children[index].children ?? []
          parent.children.splice(index, 1, ...targetChildren)
        }
      }
    }
    if (node.children) {
      for (const subNode of node.children) {
        removeNode(subNode, targetId, node)
      }
    }
  }
  function getAllNodes(node, result = []) {
    const data = {
      id: node.id,
      shape: 'node',
      attrs: {
        image: { xlinkHref: imgMap[node.type] },
      },
    }
    if (node?.data?.name) {
      data.attrs.name = {
        text: Dom.breakText(node.data.name, { width: 160, height: 45 }),
      }
    }
    if (node?.data?.ip) {
      data.attrs.ip = {
        text: Dom.breakText(node.data.ip, { width: 160, height: 45 }),
      }
    }
    if (node?.data?.url) {
      data.attrs.url = {
        text: Dom.breakText(node.data.url, { width: 160, height: 45 }),
      }
    }
    result.push(data)
    if (node.children) {
      for (const subNode of node.children) {
        getAllNodes(subNode, result)
      }
    }
    return result
  }
  function getAllEdges(node, result = [], parent = null) {
    if (parent) {
      result.push({
        shape: 'edge',
        source: { cell: parent.id },
        target: { cell: node.id },
        data: node.data,
        label: node.data.operate,
      })
    }
    if (node.children) {
      for (const subNode of node.children) {
        getAllEdges(subNode, result, node)
      }
    }
    return result
  }
  function init() {
    insertCss(`
      .x6-cell {
        cursor: default;
      }
      .x6-node .btn {
        cursor: pointer;
      }
    `)
    // 自定义节点
    Graph.registerNode(
      'node',
      {
        inherit: 'rect', // 继承于 rect 节点
        width: 60,
        height: 60,
        markup: [
          {
            tagName: 'rect', // 标签名称
            selector: 'body', // 选择器
          },
          {
            tagName: 'image',
            selector: 'image',
          },
          {
            tagName: 'text',
            selector: 'name',
          },
          {
            tagName: 'text',
            selector: 'ip',
          },
          {
            tagName: 'text',
            selector: 'url',
          },
          {
            tagName: 'circle',
            selector: 'removeBody',
            attrs: {
              class: 'btn',
            },
          },
          {
            tagName: 'text',
            selector: 'remove',
          },
          {
            tagName: 'circle',
            selector: 'addBody',
            attrs: {
              class: 'btn',
            },
          },
          {
            tagName: 'text',
            selector: 'add',
          },
          {
            tagName: 'circle',
            selector: 'deleteBody',
            attrs: {
              class: 'btn',
            },
          },
          {
            tagName: 'text',
            selector: 'delete',
          },
        ],
        attrs: {
          body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
            rx: 6,
            ry: 6,
          },
          image: {
            width: 24,
            height: 24,
            x: 18,
            y: 12,
          },
          name: {
            y: 40,
          },
          ip: {
            y: 60,
          },
          url: {
            y: 80,
          },
          remove: {
            ref: 'image',
            text: 'x',
            fill: '#ff0000',
            fontSize: 12,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            pointerEvents: 'none',
            refX: 40,
            refY: -10,
          },
          removeBody: {
            ref: 'remove',
            fill: '#fff',
            stroke: '#ff0000',
            strokeWidth: 1,
            refR: 1,
            refCx: '50%',
            refCy: '50%',
            refX: 0,
            refY: 0,
            event: 'node:remove',
          },
          add: {
            ref: 'image',
            text: '+',
            fill: '#5f95ff',
            fontSize: 12,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            pointerEvents: 'none',
            refX: 0,
            refY: 35,
          },
          addBody: {
            ref: 'add',
            fill: '#fff',
            stroke: '#5f95ff',
            strokeWidth: 1,
            refR: 1,
            refCx: '50%',
            refCy: '50%',
            refX: 0,
            refY: 0,
            event: 'node:add',
          },
          delete: {
            ref: 'image',
            text: '-',
            fill: '#5f95ff',
            fontSize: 20,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            pointerEvents: 'none',
            refX: 27,
            refY: 35,
          },
          deleteBody: {
            ref: 'delete',
            fill: '#fff',
            stroke: '#5f95ff',
            strokeWidth: 1,
            refR: 1,
            refCx: '50%',
            refCy: '50%',
            refX: 0,
            refY: 2,
            event: 'node:delete',
          },
        },
      },
      true
    )

    // 自定义边
    Graph.registerEdge(
      'edge',
      {
        inherit: 'edge',
        zIndex: 0,
        attrs: {
          line: {
            stroke: '#A2B1C3',
            strokeWidth: 12,
          },
        },
        // router: {
        //   name: 'orth',
        //   args: {
        //     startDirections: ['bottom'],
        //     endDirections: ['top'],
        //   },
        // },
        // router: {
        //   name: 'manhattan',
        //   args: {
        //     startDirections: ['bottom'],
        //     endDirections: ['top'],
        //   },
        // },
        label: {
          attrs: {
            label: {
              fill: 'red',
              fontSize: 12,
            },
          },
          position: {
            distance: -50,
          },
        },
      },
      true
    )

    // 创建画布
    const graph = new Graph({
      container: container.value,
      // scroller: true,
      interacting: false,
      // connecting: {
      //   anchor: 'orth',
      // },

      panning: true,
      mousewheel: {
        enabled: true,
        maxScale: 4,
        minScale: 0.5,
      },
    })

    // 监听自定义事件
    let i = 0
    function setup() {
      graph.on('node:add', ({ node }) => {
        i++
        const newNode = {
          id: node.id + i,
          type: (i % 4) + 1,
          data: {
            name: '人力资源管理系统',
            ip: '188' + i,
            operate: 'HTTP POST' + i,
            url: 'api/' + node.id + i,
          },
        }
        addNodeChild(data, node.id, newNode)
        layout(data)
      })

      graph.on('node:delete', ({ node }) => {
        deleteNode(data, node.id)
        layout(data)
      })
      graph.on('node:remove', ({ node }) => {
        removeNode(data, node.id)
        layout(data)
      })
      graph.on('edge:dblclick', ({ edge }) => {
        i++
        const sourceId = edge.source.cell
        const targetId = edge.target.cell
        const newNode = {
          id: sourceId + '-' + targetId + i,
          type: (i % 4) + 1,
          data: {
            name: '人力资源管理系统' + i,
            ip: '188.168.123' + i,
            operate: 'HTTP POST insert' + i,
            url: 'api/v1/' + sourceId + '-' + targetId + i,
          },
        }
        insertNode(data, sourceId, targetId, newNode)
        layout(data)
        console.log(data)
      })
    }

    // 自动布局
    function layout(data) {
      graph.resetCells([
        ...getAllNodes(data).map((node) => graph.createNode(node)),
        ...getAllEdges(data).map((edge) => graph.createEdge(edge)),
      ])
      const nodes = graph.getNodes()
      const edges = graph.getEdges()
      const g = new dagre.graphlib.Graph()
      g.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 100 })
      g.setDefaultEdgeLabel(() => ({}))
      const width = 250
      const height = 150
      nodes.forEach((node) => {
        if (!props.audit) {
          node.attr('add', null)
          node.attr('delete', null)
          node.attr('remove', null)
        }
        if (node.id === 'root') {
          node.attr('delete', null)
          node.attr('remove', null)
        }
        g.setNode(node.id, { width, height })
      })
      edges.forEach((edge) => {
        const source = edge.getSource()
        const target = edge.getTarget()
        g.setEdge(source.cell, target.cell)
      })
      dagre.layout(g)
      g.nodes().forEach((id) => {
        const node = graph.getCell(id)
        if (node) {
          const pos = g.node(id)
          node.position(pos.x, pos.y)
        }
      })
      //
      edges.forEach((edge) => {
        const source = edge.getSourceNode()
        const target = edge.getTargetNode()
        const sourceBBox = source.getBBox()
        const targetBBox = target.getBBox()

        console.log(sourceBBox, targetBBox)

        const gap = targetBBox.y - sourceBBox.y - sourceBBox.height
        const fix = sourceBBox.height
        const y = sourceBBox.y + fix + gap / 2
        edge.setVertices([
          { x: sourceBBox.center.x, y },
          { x: targetBBox.center.x, y },
        ])
      })
    }
    layout(data)
    graph.zoomTo(0.8)
    graph.centerContent()
    setup()
  }
  onMounted(init)
  watch(
    () => props.audit,
    () => {
      init()
    }
  )
  return {
    container,
  }
}
