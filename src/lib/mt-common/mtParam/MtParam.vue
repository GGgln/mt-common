<template>
  <div id="mtParam_component" class="container">
    <div class="param_contents">
      <div class="param_btn">
        <a-button type="primary" @click="editStatus = true" v-if="!editStatus" >编辑</a-button>
        <div v-else>
          <a-button @click="cancelSave">取消</a-button>
          <a-button style="margin-left:20px;" type="primary" @click="save()">保存</a-button>
        </div>
      </div>
      <div class="form_wrap">
        <a-form :form="form" ref="form">
          <section class="params_group" v-for="(group,i) in paramData.children" :key="i">
            <div v-if="group.commenParameters" class="group_wrap">
              <h3>
                <span>{{group.parametersClassDesc}}</span>
              </h3>
              <param-temp
                :editStatus="editStatus"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :spanSmall="spanSmall"
                :params="group.commenParameters"
                :groupIndex="i"
              />
            </div>
            <div v-else class="group_wrap">
              <h3>
                <span>{{group.parametersClassDesc}}</span>
              </h3>
              <div class="third_tit">
                <span
                  v-for="(title,indexSubTitle) in group.children"
                  :class="group.currentIndex == indexSubTitle?'on':''"
                  :key="indexSubTitle"
                  @click="group.currentIndex = indexSubTitle"
                >{{title.parametersClassDesc}}</span>
              </div>
              <div v-for="(groupThird,indexThird) in group.children">
                <param-temp
                  v-show="indexThird == group.currentIndex"
                  :editStatus="editStatus"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  :spanSmall="spanSmall"
                  :params="groupThird.commenParameters"
                  :groupIndex="i"
                  :selfIndex="indexThird"
                />
              </div>
            </div>
          </section>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script>
import request from "../utils/request";
import paramTemp from "./paramTemp";
export default {
  name: "mt-param",
  components: { paramTemp },
  data() {
    return {
      editStatus: false,
      paramData: {},
      indexGroup: []
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
        res.data.children.map(el => {
          el.currentIndex = 0;
          return el;
        });
        this.paramData = res.data;
      });
    },
    cancelSave() {
      this.form.resetFields();
      this.editStatus = false;
    },
    assignment(el) {},
    save() {
      let self = this;
      let url = `${this.baseUrl}/api/commenParameter/updateParameter`;
      this.form.validateFields((errors, value) => {
        // 下标 0：id ;1:参数类型；2：当前参数序号；3，参数属于该组的第几个
        if (!errors) {
          let data = {
            commenParameters: []
          };
          for (let key in value) {
            let keyArr = key.split("-");
            let [id, type] = keyArr;
            let parameterValue = "";
            if (type == 4) {
              parameterValue = value[key] ? 1 : 0;
            } else {
              parameterValue = value[key];
            }
            data.commenParameters.push({
              idParameter: id,
              parameterValue
            });
          }
          request.post(url, data).then(res => {
            this.$message.success("更新成功");
            this.init();
            this.editStatus = false;
          });
        } else {
          let errorArr = Object.keys(errors);
          let [id, type, groupIndex, groupSubIndex] = errorArr[0].split('-');
          if (groupSubIndex >= 0) {
            this.paramData.children[groupIndex].currentIndex = groupSubIndex;
          }
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
