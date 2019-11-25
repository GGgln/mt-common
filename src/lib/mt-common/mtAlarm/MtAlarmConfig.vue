<template>
    <div class="param-alarm">
        <a-form class="filter_box" :form="formData" layout="inline">
            <a-form-item label="关键字查询：" style="float: left;"><a-input class="inp-gjc" v-decorator="['name']" placeholder="请输入关键字" /></a-form-item>
            <a-form-item style="float: right;margin-left: 10px;"><a-button  type="primary" @click="toSearch">查询</a-button></a-form-item>
            <a-form-item style="float: right;"><a-button @click="newShowModal()"  type="primary">添加</a-button></a-form-item>
        </a-form>
        <a-table :columns="columns" :dataSource="data" :pagination="pageOptions" rowKey="sid">
            <template slot="ruleDesc" slot-scope="text, record">
                <!-- 编辑 -->
                <span v-if="record.ruleDesc">{{ record.ruleDesc }}</span>
                <a-icon @click="showModal(record)" style="float: right;font-size: 16px;margin-top: 5px" type="form" />
            </template>
            <template slot="validTag" slot-scope="text, record">
                <!-- 启动 -->
                <a-switch size="small" :checked="record.validTag" @change="onChange($event, record)" />
            </template>
            <template slot="ignoreTag" slot-scope="text, record">
                <!-- 静音 -->
                <div @click="voice(record)" style="position: relative;">
                    <img  style="width: 25px;height:20px;position: relative;" src="./ht.png" alt="" />
                    <p
                        v-if="record.ignoreTag"
                        style="width: 2px;height: 25px;position: absolute;top: 50%;left: 50%;background: red;transform:rotate(-45deg);margin-top:-12.5px;"
                    ></p>
                </div>
            </template>
            <template slot="deleteTag" slot-scope="text, record">
                <a-popconfirm title="是否删除该报警?" @confirm="deleteData(record)" placement="top" okText="确定" cancelText="取消"><a>删除</a></a-popconfirm>
            </template>
        </a-table>
        <a-modal centered okText="保存" cancelText="关闭" :maskClosable="false" v-model="visible" @ok="handleOk">
            <div slot="title">
                <img style="width: 50px;height: 50px;" src="./alarmSet.svg" alt="" />
                <span style="font-size: 20px;font-weight: 600;">{{ type === 1 ? '添加报警' : '配置报警' }}</span>
            </div>

            <a-form :form="formModel" v-if="editData || type == 1">
                <a-form-item label="报警名称" class="stepFormText" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
                    <a-input
                        :disabled="type === 2"
                        type="text"
                        v-decorator="['name', { initialValue: type === 2 ? editData.name : '', rules: [{ required: true, message: '请输入报警名称' }] }]"
                    />
                </a-form-item>
                <a-form-item label="报警详情" class="stepFormText" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
                    <a-input
                        :disabled="type === 2"
                        type="text"
                        v-decorator="['desc', { initialValue: type === 2 ? editData.desc : '', rules: [{ required: true, message: '请输入报警详情' }] }]"
                    />
                </a-form-item>

                <a-row :gutter="24">
                    <a-col span="24">
                        <a-form-item label="部件属性：" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
                            <a-select
                                :disabled="type === 1 ? false : editData.alarmRuleVo.id == 0 ? false : true"
                                v-decorator="[
                                    'componentPropertyId',
                                    {
                                        initialValue: type === 1 ? '' : editData.alarmRuleVo.componentPropertyId ? editData.alarmRuleVo.componentPropertyId : '',
                                        rules: [{ required: true, message: '请选择部件属性' }]
                                    }
                                ]"
                                placeholder="请选择"
                                @change="handleChange"
                            >
                                <a-select-option :key="propertyData.id" :value="propertyData.id" v-for="propertyData in alarmSetpropertyData">
                                    {{ propertyData.desc }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col span="24">
                        <a-form-item label="人工复位类型：" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
                            <a-select
                                v-decorator="[
                                    'resetType',
                                    {
                                        initialValue: type === 2 ? editData.resetType: '',
                                        rules: [{ required: true, message: '请选择复位类型' }]
                                    }
                                ]"
                                placeholder="请选择"
                            >
                                <a-select-option :key="artificial.id" :value="artificial.id" v-for="artificial in artificialType">
                                    {{ artificial.desc }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="1" v-if="variable == 0">
                    <a-col span="14">
                        <a-form-item label="报警值：" :label-col="{ span: 10 }" :wrapper-col="{ span: 11 }">
                            <a-select
                                v-decorator="[
                                    'opratorType',
                                    {
                                        initialValue: type === 1 ? '' : editData.alarmRuleVo.opratorType ? editData.alarmRuleVo.opratorType : '',
                                        rules: [{ required: true, message: '不能为空' }]
                                    }
                                ]"
                                placeholder="请选择"
                            >
                                <a-select-option :key="index" :value="contrastData.id" v-for="(contrastData, index) in alarmSetcontrastData">
                                    {{ contrastData.desc }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col span="6">
                        <a-form-item :colon="false">
                            <a-input-number
                                :label-col="{ span: 3 }"
                                :wrapper-col="{ span: 11 }"
                                type="text"
                                v-decorator="[
                                    'threshold',
                                    {
                                        initialValue: type === 1 ? '' : editData.alarmRuleVo.threshold ? editData.alarmRuleVo.threshold : '',
                                        rules: [{ required: true, message: '不能为空' }]
                                    }
                                ]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col span="3">
                        <a-form-item v-if="type == 2" :colon="false">
                            <span style="margin-left: 10px;">{{ editData.alarmRuleVo.unit }}</span>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="1" v-else>
                    <a-col span="14">
                        <a-form-item label="报警值：" :label-col="{ span: 10 }" :wrapper-col="{ span: 11 }">
                            <a-select
                                v-decorator="[
                                    'opratorType',
                                    {
                                        initialValue: type === 1 ? '' : editData.alarmRuleVo.opratorType ? editData.alarmRuleVo.opratorType : '',
                                        rules: [{ required: true, message: '不能为空' }]
                                    }
                                ]"
                                placeholder="请选择"
                            >
                                <a-select-option :key="5" :value="5">等于</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col span="6">
                        <a-form-item :colon="false">
                            <a-select
                                v-decorator="[
                                    'threshold',
                                    {
                                        initialValue: type === 1 ? '' : editData.alarmRuleVo.threshold ? editData.alarmRuleVo.threshold : '',
                                        rules: [{ required: true, message: '不能为空' }]
                                    }
                                ]"
                                placeholder="请选择"
                            >
                                <a-select-option :key="0" :value="0">0</a-select-option>
                                <a-select-option :key="1" :value="1">1</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="20">
                    <a-col span="18">
                        <a-form-item label="错误码：" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                            <a-select
                                v-decorator="['errorCode', { initialValue: type === 2 ? editData.errorCode : '', rules: [{ required: true, message: '请选择错误码' }] }]"
                                placeholder="请选择"
                                @change="levelChange"
                            >
                                <a-select-option v-if="alarmSetErrorData" :key="ErrorData.errorCode" :value="ErrorData.errorCode" v-for="ErrorData in alarmSetErrorData">
                                    {{ ErrorData.desc }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col span="5">
                        <a-form-item :colon="false">
                            <span>{{ alarmLevel }}</span>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col span="12">
                        <a-form-item label="是否启用" class="stepFormText" :label-col="{ span: 13 }" :wrapper-col="{ span: 11 }">
                            <a-switch v-model="switchData.validTag" v-decorator="['validTag']" />
                        </a-form-item>
                    </a-col>

                    <a-col span="12">
                        <a-form-item label="是否影响启车" class="stepFormText" :label-col="{ span: 10 }" :wrapper-col="{ span: 11 }">
                            <a-switch v-model="switchData.affectStartTag" v-decorator="['affectStartTag']" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                <a-col span="12">
                    <a-form-item label="是否待机有效" class="stepFormText" :label-col="{ span: 13 }" :wrapper-col="{ span: 11 }">
                        <a-switch v-model="switchData.standbyEffective" v-decorator="['standbyEffective']" />
                    </a-form-item>
                </a-col>
                    <a-col span="12">
                        <a-form-item label="是否静音" class="stepFormText" :label-col="{ span: 10 }" :wrapper-col="{ span: 11 }">
                            <a-switch v-model="switchData.ignoreTag" v-decorator="['ignoreTag']" />
                        </a-form-item>
                    </a-col>
                </a-row>


            </a-form>
        </a-modal>
    </div>
</template>

<script>
import request from '../utils/request'

const columns = [
    {
        title: '报警等级',
        dataIndex: 'errorLevel',
        width:'15%',
        scopedSlots: { customRender: 'errorLevel' }
    },
    {
        title: '报警名称',
        dataIndex: 'name',
        width:'15%',
        scopedSlots: { customRender: 'name' }
    },
    {
        title: '报警详情',
        dataIndex: 'desc',
        scopedSlots: { customRender: 'desc' }
    },
    {
        title: '报警设置',
        dataIndex: 'ruleDesc',
        width:'18%',
        scopedSlots: { customRender: 'ruleDesc' }
    },

    {
        title: '启用',
        dataIndex: 'validTag',
        align: 'center',
        width:'8%',
        scopedSlots: { customRender: 'validTag' }
    },
    {
        title: '声音',
        dataIndex: 'ignoreTag',
        align: 'center',
        width:'8%',
        scopedSlots: { customRender: 'ignoreTag' }
    },
    {
        title: '删除',
        dataIndex: 'deleteTag',
        align: 'center',
        width:'8%',
        scopedSlots: { customRender: 'deleteTag' }
    }
];
const data = [];
const apis = {
  alarmSetList: `api/standardization/cn/alarm/alarmSpec/page`,//报警设置列表
  alarmSetOff: `api/standardization/cn/alarm/alarmSpec/soundOff`,//报警设置//静音
  alarmSetOn: `api/standardization/cn/alarm/alarmSpec/soundOn`,//报警设置//取消静音
  alarmSetStart: `api/standardization/cn/alarm/alarmSpec/enable`,//报警设置//启动
  alarmSetEnd: `api/standardization/cn/alarm/alarmSpec/disable`,//报警设置//不启动
  alarmSetDelete: `api/standardization/cn/alarm/alarmSpec/delete`,//报警设置删除
  alarmSetError: `api/standardization/cn/alarm/errorCode`,//报警设置错误码
  alarmSetproperty: `api/standardization/cn/component/property-relation`,//报警设置部件属性
  alarmSetcontrast: `api/standardization/cn/alarm/rule/opratorType`,//报警设置对比类型
  alarmAdd: `api/standardization/cn/alarm/alarmSpec/add`,//报警设置对比类型
  alarmEdit: `api/standardization/cn/alarm/alarmSpec/`,//报警设置//编辑单个
  alarmUpdate: `api/standardization/cn/alarm/alarmSpec/update`,//报警设置//编辑单个
  alarmLevel: `api/standardization/cn/alarm/alarmSpec/errorLevel/`,//报警设置//根据报警码获取报警级别
  alarmArtificial: `api/standardization/cn/alarm/alarmSpec/resetType`,//报警设置//人工复位类型
}
export default {
    name: 'mt-alarm-config',
    data() {
        return {
            data,
            columns,
            alarmLevel: '', //报警级别
            Data: {}, //数据
            type: 1, //新建1,修改2
            variable: 0, //默认报警值状态
            alarmSetErrorData: [], //错误码数据
            editData: null, //编辑数据
            alarmSetpropertyData: [], //部件属性
            alarmSetcontrastData: [],//对比数据
            artificialType: [],//人工复位类型
            visible: false, //model显示隐藏
            formData: this.$form.createForm(this),
            formModel: this.$form.createForm(this),
            switchData: {
                validTag: true,
                affectStartTag: false,
                ignoreTag: false,
                standbyEffective: false
            },
            addData: {
                //添加数据
                desc: '',
                name: '',
                resetType:null,
                errorCode: null,
                affectStartTag: false,
                ignoreTag: false,
                validTag: false,
                standbyEffective: false,
                alarmRuleVo: {
                    componentPropertyId: null,
                    opratorType: null,
                    threshold: null
                }
            },
            postData: {
                //查询数据
                name: '',
                pageSize: 10,
                currPage: 1
            },
            pageOptions: {
                //控制分页
                current: 1,
                defaultPageSize: 10,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                total: 0,
                onShowSizeChange: (current, size) => {
                    this.postData.pageSize = size;
                    this.postData.currPage = 1;
                    this.requestFormList();
                },
                onChange: (page, pageSize) => {
                    // 跳页
                    this.postData.currPage = page;
                    this.requestFormList();
                }
            },

        };
    },
    mounted() {
        this.requestFormList();
        this.alarmSetError();
        this.alarmSetproperty();
        this.alarmSetcontrast();
        this.manualReduction();
    },
    props:{
        baseUrl: {
            type: String,
            default: 'http://192.168.6.16:5565/'
        },
        apis:{
            type:Object,
            required:false,
            default: () => { return apis},
        }
    },
    methods: {
          duoChange(value) {
                console.log(value);
              },
        handleChange(selectedItems) {
            //部件属性改变时
            for (let i = 0; i < this.alarmSetpropertyData.length; i++) {
                if (selectedItems == this.alarmSetpropertyData[i].id) {
                    this.variable = this.alarmSetpropertyData[i].digitalTag;
                    this.formModel.setFields({
                        opratorType: {
                            value: null
                        },
                        threshold: {
                            value: null
                        }
                    });
                }
            }
        },
        manualReduction() {
            //人工复位类型
            let this_ = this;
            let url = this.baseUrl+this_.apis.alarmArtificial;
            request
                .get(url)
                .then(response => {
                    console.log(response)
                    this_.artificialType = response.data;
                })
                .catch(error => {
                    // this_.$message.error('获取错误码失败');
                });
        },
        alarmSetError() {
            //错误码
            let this_ = this;
            let url = this.baseUrl+this_.apis.alarmSetError;
            request
                .get(url)
                .then(response => {
                    this_.alarmSetErrorData = response.data;
                })
                .catch(error => {
                    // this_.$message.error('获取错误码失败');
                });
        },
        alarmSetproperty() {
            //部件属性
            let this_ = this;
            let url = this.baseUrl+this_.apis.alarmSetproperty;
            request
                .get(url)
                .then(response => {
                    this_.alarmSetpropertyData = response.message;
                })
                .catch(error => {
                    // this_.$message.error('获取部件属性失败');
                });
        },
        alarmSetcontrast() {
            //对比
            let this_ = this;
            let url = this.baseUrl+this_.apis.alarmSetcontrast;
            request
                .get(url)
                .then(response => {
                    this_.alarmSetcontrastData = response.data;
                })
                .catch(error => {
                    // this_.$message.error('获取比较类型失败');
                });
        },
        newShowModal() {
            //添加
            // this.Data = data;
            this.variable = 0;
            this.alarmLevel = '';
            for (let var1 in this.switchData) {
                if (var1=='validTag') {
                    this.switchData[var1] = true;
                }else{
                this.switchData[var1] = false;
                    }

            }
            this.formModel.resetFields(); // model重置
            this.visible = true;
            this.type = 1;
        },

        showModal(data) {
            //单条编辑
            this.alarmLevel = '';
            this.type = 2;
            this.formModel.resetFields(); // model重置
            let this_ = this;
            let url = this.baseUrl+this_.apis.alarmEdit;
            request.get(url + data.sid)
                .then(response => {
                    response.data.alarmRuleVo.opratorType = Number(response.data.alarmRuleVo.opratorType);
                    this_.editData = response.data;
                    this_.switchData.validTag = response.data.validTag;
                    this_.switchData.affectStartTag = response.data.affectStartTag;
                    this_.switchData.ignoreTag = response.data.ignoreTag;
                    this_.switchData.standbyEffective = response.data.standbyEffective;
                    this_.alarmLevel = response.data.errorLevel;

                    for (let i = 0; i < this_.alarmSetpropertyData.length; i++) {
                        if (response.data.alarmRuleVo.componentPropertyId == this_.alarmSetpropertyData[i].id) {
                            this_.variable = this_.alarmSetpropertyData[i].digitalTag;
                        }
                    }
                    this.visible = true;
                })
                .catch(error => {
                    this_.$message.error('获取本条数据失败');
                });
        },
        handleOk(e) {
            //model确定
            e.preventDefault();
            this.formModel.validateFields((err, values) => {
                if (!err) {
                    if (this.type == 1) {
                        this.addData.name = values.name;
                        this.addData.desc = values.desc;
                        this.addData.errorCode = values.errorCode;
                        this.addData.resetType = values.resetType;
                        this.addData.alarmRuleVo.componentPropertyId = values.componentPropertyId;
                        this.addData.alarmRuleVo.opratorType = values.opratorType;
                        this.addData.alarmRuleVo.threshold = values.threshold;
                        this.addData = Object.assign(this.addData, this.switchData);

                        let this_ = this;
                        let url = this.baseUrl+this_.apis.alarmAdd;
                        request
                            .post(url, this_.addData)
                            .then(response => {
                                this_.visible = false;
                                this_.$message.success('添加报警数据成功');
                                this_.requestFormList();
                            })
                            .catch(error => {
                                this_.$message.error(error.msg);
                            });
                    } else {
                        this.editData = Object.assign(this.editData, this.switchData);
                        this.editData.alarmRuleVo.componentPropertyId = values.componentPropertyId;
                        this.editData.alarmRuleVo.opratorType = values.opratorType;
                        this.editData.alarmRuleVo.threshold = values.threshold;
                        this.editData.errorCode = values.errorCode;
                        this.editData.resetType = values.resetType;
                        var param = this.editData;
                        console.log(param);
                        let this_ = this;
                        let url = this.baseUrl+this_.apis.alarmUpdate;
                        request
                            .put(url, param)
                            .then(response => {
                                this_.requestFormList();
                                this_.$message.success('修改该条报警数据成功');
                                this_.visible = false;
                            })
                            .catch(error => {
                                this_.$message.error('编辑该条报警数据失败');
                            });
                    }
                }
            });
        },

        toSearch() {
            //查询
            this.postData.currPage = 1;
            this.formData.validateFields((err, values) => {
                if (!err) {
                    this.postData = Object.assign(this.postData, values);
                    this.requestFormList();
                }
            });
        },

        requestFormList() {
            //列表
            let this_ = this;
            let url = this.baseUrl+this_.apis.alarmSetList;
            request
                .post(url, this_.postData)
                .then(response => {
                    this_.data = response.data.alarmSettingVoList;
                    this_.pageOptions.total = response.data.totalCount || 0;
                    this_.postData.currPage = response.data.currentPage;
                    this_.pageOptions.current = response.data.currentPage;
                })
                .catch(error => {
                    // this_.$message.error('获取列表失败');
                });
        },
        deleteData(data) {
            //删除
            var param = { sid: data.sid };
            let this_ = this;
            let url = this.baseUrl+this_.apis.alarmSetDelete;
            request
                .delete(url, { data: param })
                .then(response => {
                    this_.requestFormList();
                })
                .catch(error => {
                    this_.$message.error('删除操作失败');
                });
        },
        onChange(checked, event) {
            //启动
            var param = { sid: event.sid };
            let this_ = this;
            let url = checked ? this.baseUrl+this_.apis.alarmSetStart : this.baseUrl+this_.apis.alarmSetEnd;
            request
                .put(url, param)
                .then(response => {
                    this_.requestFormList();
                })
                .catch(error => {
                    this_.$message.error('启用操作失败');
                });
        },
        levelChange(selectedItems) {
            let this_ = this;
            let url = this.baseUrl+this_.apis.alarmLevel;
            request
                .get(url + selectedItems)
                .then(response => {
                    this_.alarmLevel = response.data.alarmLevel;
                })
                .catch(error => {
                    // this_.$message.error('匹配报警级别错误');
                });
        },
        voice(data) {
            //静音
            data.ignoreTag = !data.ignoreTag;
            var param = { sid: data.sid };
            let this_ = this;
            let url = data.ignoreTag ? this.baseUrl+this_.apis.alarmSetOff : this.baseUrl+this_.apis.alarmSetOn;
            request
                .put(url, param)
                .then(response => {
                    this_.requestFormList();
                })
                .catch(error => {
                    this_.$message.error('静音操作失败');
                });
        }
    }
};
</script>

<style lang="scss">
.param-alarm{
  .ant-form-inline .ant-form-item {
      margin-right: 0 !important;
  }
  .filter_box {
      width: 100%;
      overflow: hidden;
      margin-bottom: 16px;
      line-height: 32px !important;
      margin-top: -8px;

  }  
}

</style>
