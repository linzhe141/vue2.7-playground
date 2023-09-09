<template>
  <div id="app">
    <!-- <ElButton size="mini" @click="auditStatus = !auditStatus"
      >稽核{{ auditStatus }}</ElButton
    > -->
    <LinkChart
      :audit="auditStatus"
      :data="data"
      @add-node="({ id, newNode }) => addNodeChild(data, id, newNode)"
      @delete-node="({ id }) => deleteNode(data, id)"
      @insert-node="
        ({ sourceId, targetId, newNode }) =>
          insertNode(data, sourceId, targetId, newNode)
      "
      @remove-node="({ id }) => removeNode(data, id)"
    ></LinkChart>
  </div>
</template>

<script setup>
import { Button as ElButton } from 'element-ui'
import LinkChart from './components/LinkChart/LinkChart.vue'
import { reactive, ref } from 'vue'
// dddd
// type 1: 用户
// type 2: 业务系统
// type 3: 接口地址
// type 4: 数据库
const auditStatus = ref(true)
const data = reactive({
  id: 'a',
  type: 1,
  children: [
    {
      id: 'b',
      type: 2,
      data: {
        name: '人力资源管理系统',
        ip: '188.168.12.30:8099',
        operate: 'HTTP POST',
        url: 'api/v1/filetask',
      },
    },
    {
      id: 'c',
      type: 3,
      data: {
        name: '人力资源管理系统',
        ip: '188.168.12.30:8099',
        operate: 'HTTP POST',
        url: 'api/v1/filetask',
      },
      children: [
        {
          id: 'f',
          type: 3,
          data: {
            name: '人力资源管理系统',
            ip: '188.168.12.30:8099',
            operate: 'HTTP POST',
            url: 'api/v1/filetask',
          },
          children: [
            {
              id: 'gg',
              type: 2,
              data: {
                name: '人力资源管理系统',
                ip: '188.168.12.30:8099',
                operate: 'HTTP POST',
                url: 'api/v1/filetask',
              },
            },
          ],
        },
        {
          id: 'd',
          type: 2,
          data: {
            name: '人力资源管理系统',
            ip: '188.168.12.30:8099',
            operate: 'HTTP POST',
            url: 'api/v1/filetask',
          },
        },
      ],
    },
    {
      id: 'e',
      type: 4,
      data: {
        name: '人力资源管理系统',
        ip: '188.168.12.30:8099',
        operate: 'HTTP POST',
        url: 'api/v1/filetask',
      },
    },
  ],
})
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
</script>

<style></style>
