
<template>
  <div class="count-outer">
    <div class="count-content">
      <el-input
        v-model="value"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :class="props.class"
      >
        <template #append v-if="showAppend">
          <slot></slot>
        </template>
      </el-input>
    </div>
    <div class="conut-display" v-if="showDigits">
      <div class="arrow">
        <img src="../../../assets/arrow.jpg" alt="" />
      </div>
      {{ showDigits }}
    </div>
  </div>
</template>
<script setup>
import { defineEmits, defineProps, computed } from "vue";
// import { numberFormat } from "@/utils/index";

// export const numberFormat = value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: String,
  placeholder: String,
  class: String,
  disabled: Boolean,
  showAppend: Boolean,
});
console.log(props, "propsprops");
const value = computed({
  get() {
    return props.modelValue?.toString();
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
const showDigits = computed(() => {
  if (props.modelValue === "" || isNaN(props.modelValue)) {
    return false;
  }
  if (Number(props.modelValue) === 0) {
    return false;
  }
  if (props.modelValue?.toString().includes(" ")) {
    return false;
  }
  let str = "";
  switch (Math.floor(Number(props.modelValue)).toString().length) {
    case 1:
      str = "个";
      break;
    case 2:
      str = "十";
      break;
    case 3:
      str = "百";
      break;
    case 4:
      str = "千";
      break;
    case 5:
      str = "万";
      break;
    case 6:
      str = "十万";
      break;
    case 7:
      str = "百万";
      break;
    case 8:
      str = "千万";
      break;
    case 9:
      str = "亿";
      break;
    default:
      str = "亿";
  }
  return str;
});
</script>
<style lang='scss' scoped>
.count-outer {
  width: 100%;

  .count-content {
    display: flex;
    width: 100%;
  }

  .conut-display {
    padding-left: 11px;
    line-height: 16px;
    height: 10px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    margin-top: 7px;
    position: relative;

    .arrow {
      width: 10px;
      height: 6px;
      top: -6px;
      position: absolute;

      img {
        width: 10px;
        height: 6px;
      }
    }

    color: #999999;
    font-size: 10px;
  }
}
</style>
