<template>
  <div id="mtParam_component" class="container">
    <div class="param_contents">
      <div class="param_btn">
        <a-button type="primary" @click="editStatus = true" v-if="!editStatus">编辑</a-button>
        <div v-else>
          <a-button @click="cancelSave">取消</a-button>
          <a-button style="margin-left:20px;" type="primary" @click="save()">保存</a-button>
        </div>
      </div>
      <div class="form_wrap">
        <a-form :form="form" ref="form">
          <section class="params_group" v-for="(group,i) in paramData.children" :key="i">
            <h3>{{group.parametersClassDesc}}</h3>
            <div class="param_list">
              <a-col
                :xxl="spanLarge"
                :lg="spanSmall"
                :xl="spanSmall"
                v-for="(param, j) in group.commenParameters"
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
                    v-decorator="[`${param.id}`,{initialValue:param.parameterValue,rules: [{required:param.isRequired && param.isWrite,message:`请选择${param.parameterDesc}`}]}]"
                    style="100%"
                  >
                    <a-select-option
                      :value="el.TypeClassId"
                      v-for="(el,k) in param.dimTypes"
                      :key="k"
                    >{{el.TypeClassDesc}}</a-select-option>
                  </a-select>
                  <a-switch 
                     v-else-if='param.parameterTypeID == 4' 
                    :disabled="!editStatus || !param.isWrite"
                    v-decorator="[`${param.id}`,{initialValue:param.parameterValue == 1}]" />
                  <a-input
                    v-else
                    :disabled="!editStatus || !param.isWrite"
                    v-decorator="[
                  `${param.id}`,
                  { initialValue: param.parameterValue ,rules: [{required:param.isRequired && param.isWrite,message:`请输入${param.parameterDesc}`},{validator:validatorCustom(param)}]}
                  ]"
                  />
                </a-form-item>
              </a-col>
            </div>
          </section>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script>
import request from "../utils/request";

export default {
  name: "mt-param",
  data() {
    return {
      editStatus: false,
      paramData: {}
    };
  },
  props: {
    baseUrl: {
      type: String,
      default: "/mtCommonApi"
    },
    idParametersClass: {
      type: [String, Number],
      required: true
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
  created() {
    this.init();
  },
  methods: {
    init() {
      let url = `${this.baseUrl}/api/commenParameter/getParameter?idParametersClass=${this.idParametersClass}`;
      request.get(url).then(res => {
        this.paramData = res.data;
      });
    },
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
        console.log(el.regularExpression, reg);
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
    },
    cancelSave() {
      this.form.resetFields();
      this.editStatus = false;
    },
    save() {
      let self = this;
      let url = `${this.baseUrl}/api/commenParameter/updateParameter`;
      this.form.validateFields((err, value) => {
        console.log(value)
        if (!err) {
          let data = JSON.parse(JSON.stringify(self.paramData));
          data.children.map(group => {
            group.commenParameters.map(el => {
              if(el.parameterTypeID == 4){
                el.parameterValue = value[el.id]?1:0;
              } else{
                el.parameterValue = value[el.id];
              }
              
              return el;
            });
          });
          request.post(url, data).then(res => {
            this.$message.success("更新成功");
            this.init();
            this.editStatus = false;
          });
        }
      });
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  }
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
