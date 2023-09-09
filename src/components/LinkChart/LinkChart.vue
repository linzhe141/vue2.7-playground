<template>
  <div style="position: relative">
    <div ref="container" style="height: 500px"></div>
    <div
      style="position: absolute"
      ref="selectWrapper"
      v-clickoutside="clickoutsideHandle"
    >
      <el-select v-model="selectValue" v-show="showSelect">
        <el-option value="x">x</el-option>
        <el-option value="y">y</el-option>
        <el-option value="z">z</el-option>
      </el-select>
    </div>
  </div>
</template>
<script setup>
import vClickoutside from 'element-ui/src/utils/clickoutside'
import { ref } from 'vue'
import { ElSelect } from 'element-ui'
import useLinkChartService from './useLinkChartService'
const props = defineProps({
  audit: {
    type: Boolean,
  },
  data: {
    type: Object,
    default: () => ({}),
  },
})
const showSelect = ref(false)
const selectWrapper = ref(null)
const selectValue = ref('')
// let i = 0;
function clickoutsideHandle() {
  if (!showSelect.value) return
  if (showSelect.value) {
    showSelect.value = false
  }
}

const { container } = useLinkChartService(props)
</script>
<style lang="scss" scoped></style>
