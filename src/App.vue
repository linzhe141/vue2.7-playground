<template>
  <div id="app">
    <!-- <ElButton size="mini" @click="auditStatus = !auditStatus"
      >稽核{{ auditStatus }}</ElButton
    > -->
    <LinkChart :audit="auditStatus" :data="data"></LinkChart>
  </div>
</template>

<script setup>
import { Button as ElButton } from 'element-ui'
import LinkChart from './components/LinkChart/LinkChart.vue'
import { ref } from 'vue'
// dddd
// type 1: 用户
// type 2: 业务系统
// type 3: 接口地址
// type 4: 数据库
const auditStatus = ref(true)
const data = {
  id: 'root',
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
}
</script>

<style></style>
