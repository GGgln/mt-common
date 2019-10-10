<template>
  <div id="mt-filter">
    <a-form
      :form="formData"
      layout="inline"
      v-if="form.formFilterData && form.formFilterData.length > 0"
    >
      <template v-if="!$slots.default" v-for="(el,index) in form.formFilterData">
        <slot v-if="el.type === 'customAll'" :name="el.key"></slot>
        <a-form-item
          v-else
          :label="`${el.name}:`"
          :key="index"
        >
          <a-select v-if="el.type === 'select'" v-model="el.value" :placeholder="'请选择' + el.name">
            <a-select-option
              v-for="(optionItem, optionIndex) in el.data"
              :key="optionIndex"
              :value="optionItem.value"
              :label="optionItem.label"
            ></a-select-option>
          </a-select>
          <a-input v-else v-model="el.value" :placeholder="`请输入${ el.name }`" />
        </a-form-item>
      </template>
      <slot name="default"></slot>
      <a-form-item>
        <template v-if="!$slots.buttons">
          <a-button type="primary" @click="toSearch">查询</a-button>
          <a-button style="margin-left:20px;" @click="toReset">重置</a-button>
        </template>
        <slot name="buttons"></slot>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
export default {
  name: 'mt-filter',
  props: [ 'form' ],
  data () {
    return {
      formData: this.$form.createForm(this)
    }
  },
  mounted () {
    console.log('form filter data', this)
  },
  methods: {
    toSearch () {
      this.$emit('request-form-list')
    },
    toReset () {
      this.$emit('request-form-list')
    }
  }
}
</script>
