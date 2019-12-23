<template>
  <div class="param_list">
    <a-col
      :xxl="spanLarge"
      :lg="spanSmall"
      :xl="spanSmall"
      v-for="(param, j) in params"
      :key="param.id"
      class="mt-col"
    >
      <a-form-item
        :label-col="{span:labelCol}"
        :wrapper-col="{span:wrapperCol}"
        :label="retureLabel(param)"
        :title="param.tips"
      >
        <a-select
          v-if="param.parameterTypeID == 3"
          :disabled="!editStatus || !param.isWrite"
          v-decorator="[`${param.id}-${param.parameterTypeID}-${groupIndex}-${selfIndex}`,{initialValue:param.parameterValue,rules: [{required:param.isRequired && param.isWrite,message:`请选择${param.parameterDesc}`}]}]"
          style="100%"
        >
          <a-select-option
            :value="el.TypeClassId"
            v-for="(el,k) in param.dimTypes"
            :key="k"
          >{{el.TypeClassDesc}}</a-select-option>
        </a-select>
        <a-switch
          v-else-if="param.parameterTypeID == 4"
          :disabled="!editStatus || !param.isWrite"
          v-decorator="[`${param.id}-${param.parameterTypeID}-${groupIndex}-${selfIndex}`,{initialValue:param.parameterValue == 1,valuePropName:'checked'}]"
        />
        <a-input
          v-else
          :disabled="!editStatus || !param.isWrite"
          v-decorator="[
                  `${param.id}-${param.parameterTypeID}-${groupIndex}-${selfIndex}`,
                  { initialValue: param.parameterValue ,rules: [{required:param.isRequired && param.isWrite,message:`请输入${param.parameterDesc}`},{validator:validatorCustom(param)}]}
                  ]"
        />
      </a-form-item>
    </a-col>
  </div>
</template>

<script>
export default {
  name: "param_list",
  props: {
    groupIndex:{
      type: Number,
      default: 0,
      required: false
    },
    selfIndex:{
      type: Number,
      default: -1,
      required: false
    },
    editStatus: {
      type: Boolean,
      default: false
    },
    params: {
      type: Array,
      default: []
    },
    spanSmall: {
      type: Number,
      default: 8,
      required: false
    },
    spanLarge: {
      type: Number,
      default: 6,
      required: false
    },
    labelCol: {
      type: Number,
      default: 14,
      required: false
    },
    wrapperCol: {
      type: Number,
      default: 9,
      required: false
    }
  },
  methods: {
    retureLabel(param) {
      if (param.unit) {
        return `${param.parameterDesc}(${param.unit})`;
      } else {
        return param.parameterDesc;
      }
    },
    validatorCustom(el) {
      if (el.regularExpression) {
        // let reg = /^[0-9]([.][0-9]{1,2})?$|^[1-9]\d([.][0-9]{1,2})?$|^10[0]([.]{0})?$/
        let reg = new RegExp(el.regularExpression);
        return (rule, value, callback) => {
          if (value && !reg.test(value)) {
            callback(new Error(el.ruleDesc));
            return;
          }
          callback();
        };
      } else {
        return (rule, value, callback) => {
          callback();
        };
      }
    }
  }
};
</script>

<style lang='scss'>

</style>