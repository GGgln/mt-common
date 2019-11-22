<template>
  <div id="role_component" class="container">
    <div class="big">
      <!-- title -->
      <a-form class="filter_box" :form="formData" layout="inline">
        <a-form-item><a-input style="width:100%;"  v-decorator="['name']" placeholder="请输入姓名" /></a-form-item>
        <a-form-item>
          <a-button icon="search" type="primary" @click="seeAbout">查询角色</a-button>
          <a-button icon="plus" style="margin-left:20px;" type="primary" @click="showModal">新建角色</a-button>
        </a-form-item>
      </a-form>
      <!-- 新建 -->
      <a-modal centered :maskClosable="false" title="新建角色" v-model="visible" @cancel="noModel" @ok="okModel" okText="保存" cancelText="关闭">
        <a-form :form="formRole">
          <a-form-item label="角色名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input placeholder="请输入角色" v-decorator="['roleTypeName', { rules: [{ required: true, message: '请输入角色' }] }]"></a-input>
          </a-form-item>
        </a-form>
        <div class="tree-min" v-if="menus.length>0" :key="index" v-for="(men, index) in menus">
          <div :key="item" v-for="(el, key, item) in men">
            <p class="format">{{ key }}&nbsp;:</p>
            <a-tree defaultExpandAll v-model="checkedKeys[index]" checkable>
              <a-tree-node v-for="elf in el" v-if="elf.menuLevel == 1" :title="elf.menuDesc" :key="elf.menuId">
                <a-tree-node v-for="elz in el" v-if="elf.menuId == elz.parentId" :title="elz.menuDesc" :key="elz.menuId" />
              </a-tree-node>
            </a-tree>
          </div>
        </div>
      </a-modal>
      <!-- 编辑 -->
      <a-modal centered :maskClosable="false" title="编辑角色" v-model="visibleEdit" @cancel="noModelEdit" @ok="okModelEdit" okText="保存" cancelText="关闭">
        <a-form :form="formRoleEdit">
          <a-form-item label="角色名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input placeholder="请输入角色" v-decorator="['roleTypeName', { initialValue: roleName, rules: [{ required: true, message: '请输入角色' }] }]"></a-input>
          </a-form-item>
        </a-form>
        <div class="tree-min" v-if="menusEdit.length>0" :key="index" v-for="(men, index) in menusEdit">
          <div :key="item" v-for="(el, key, item) in men">
            <p class="format">{{ key }}&nbsp;:</p>
            <a-tree defaultExpandAll v-model="checkedKeysEdit[index]" checkable>
              <a-tree-node v-for="elf in el" v-if="elf.menuLevel == 1" :title="elf.menuDesc" :key="elf.menuId">
                <a-tree-node v-for="elz in el" v-if="elf.menuId == elz.parentId" :title="elz.menuDesc" :key="elz.menuId" />
              </a-tree-node>
            </a-tree>
          </div>
        </div>
      </a-modal>
      <!-- table表格 -->
      <a-table id="table_blue" :pagination="pageOptions" :columns="columns" :dataSource="data">
        <template slot="action" slot-scope="text, record">
          <a-row>
            <a-col :span="8"><a href="javascript:;" @click="showModalEdit(record)">编辑</a></a-col>

            <a-col :span="8">
              <a-popconfirm :title="alertMin" @confirm="deleData(record)" placement="top" okText="确定" cancelText="取消">
                <a href="javascript:;" @click="deleCkeck(record)">删除</a>
              </a-popconfirm>
            </a-col>
          </a-row>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import request from '../utils/request';
const columns = [
  {
    title: '角色名称',
    dataIndex: 'roleTypeName',
    width: '25%'
  },
  {
    title: '更改时间',
    dataIndex: 'createdTimeStr',
    width: '25%'
  },
  {
    title: '创建人',
    dataIndex: 'createdPerson',
    width: '25%'
  },
  {
    title: '操作',
    dataIndex: '',
    scopedSlots: { customRender: 'action' },
    width: '25%'
  }
];
export default {
  name: 'mt-role',
  props: {
    baseUrl: {
      type: String,
      default: '/mtCommonApi'
    }
  },
  data() {
    return {
      alertMin: null,
      alertCode: null,
      columns, //table表头
      labelCol: {
        //栅格尺寸
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      // ----------------------------------------------------------------------新建
      oftOf: [], //最后对比选中
      oftTree: [], //最后对比数
      menus: [], // 获取到总数据
      checkedKeys: [], // 选择的数据
      iptContent: null, // 输入框内容
      visible: false, // 窗口状态
      // ------------------------------------------------------------------------新建
      // ----------------------------------------------------------------------编辑
      oftOfEdit :[],
      oftTreeEdit :[],
      checkedKeysEdit: [], // 编辑选择的数据
      visibleEdit: false, // 编辑窗口状态
      menusEdit: [], // 编辑总数据
      roleName: null, //编辑获取角色
      roleTypeId: null, //编辑获取id
      // --------------------------------------------------------编辑
      data: [], // table数据
      pageSize: 10, // 条数
      page: 1, // 当前页
      pageOptions: {
        // 分页
        current: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        total: 0,
        onShowSizeChange: (current, size) => {
          // 每页多少条
          this.pageSize = size;
          this.page = current;
          this.pageOptions.current = current;
          this.initData();
        },
        onChange: (page, pageSize) => {
          // 跳页
          this.page = page;
          this.pageOptions.current = page;
          this.initData();
        }
      }
    };
  },
  beforeCreate() {
    this.formData = this.$form.createForm(this);
    this.formRole = this.$form.createForm(this);
    this.formRoleEdit = this.$form.createForm(this);
  },
  created() {
    this.initData();
  },

  methods: {
    deleCkeck(data) {
      //删除前判断
      this.alertCode = null;
      let this_ = this;
      request({
        url: `${this_.baseUrl}/Service/API/V1/CHP/role/deleteCheck?roleTypeId=` + data.roleTypeId,
        method: 'get'
      })
        .then(res => {
          this_.alertCode = res.data;
          if (res.data === 0) {
            this_.alertMin = '角色' + data.roleTypeName + '可以删除';
          } else {
            this_.alertMin = '角色' + data.roleTypeName + '的使用人数不为0，不能删除。请先清空使用人数。';
          }
        })
        .catch(error => {
          this_.$message.error(error.msg);
        });
    },
    // --------------------------------------------------------------------------------------------------------编辑
    showModalEdit(data) {
      // 点击编辑显示model
      this.visibleEdit = true;
      this.roleTypeId = null;//当前角色id
      this.formRoleEdit.resetFields(); // 编辑重置
      this.checkedKeysEdit = []; // 编辑选中的树形数据清空
      this.menusEdit = []; // 编辑 菜单数据清空
      this.roleName = null;
      this.roleTypeId = data.roleTypeId;
      let this_ = this;
      request({
        url: `${this_.baseUrl}/Service/API/V1/CHP/role/getRoleTreeEdit?roleTypeId=` + data.roleTypeId,
        method: 'get'
      })
        .then(res => {
          this_.roleName = res.data.roleTypeName;//角色名称

          for (let i = 0; i < res.data.roleMenuMaps.length; i++) {
            var attrDataEdit = [];
            for (let j = 0; j < res.data.menuIds.length; j++) {
              attrDataEdit =res.data.menuIds[i]
            }
            this_.checkedKeysEdit.push(attrDataEdit);//选中数据
          }
          this_.menusEdit = res.data.roleMenuMaps;//树
        })
        .catch(error => {
          this.$message.error(error.msg);
        });
    },
    noModelEdit() {
      // 编辑关闭
      console.log(123)
      this.visibleEdit = false;
    },

    okModelEdit(e) {
      // 编辑保存
      e.preventDefault();
      this.formRoleEdit.validateFields((err, values) => {
        if (!err) {
          this.oftOfEdit = [];
          this.oftTreeEdit = [];
          for (let i = 0; i < this.checkedKeysEdit.length; i++) {
            this.oftOfEdit = this.oftOfEdit.concat(this.checkedKeysEdit[i]);
          }
          console.log( this.oftOfEdit)
          for (let i = 0; i < this.menusEdit.length; i++) {
            for (let val in this.menusEdit[i]) {
              this.oftTreeEdit = this.oftTreeEdit.concat(this.menusEdit[i][val]);
            }
          }

          for (var i = 0; i < this.oftOfEdit.length; i++) {
            for (var j = 0; j < this.oftTreeEdit.length; j++) {
              if (this.oftOfEdit[i] == this.oftTreeEdit[j].menuId) {
                this.oftTreeEdit[j].limitType = 1;
              }
            }
          }


          let this_ = this;
          request({
            url: `${this_.baseUrl}/Service/API/V1/CHP/role/insertRole`,
            method: 'post',
            data: {
              roleTypeId: this_.roleTypeId,
              roleTypeName: values.roleTypeName,
              roleMenuVOS: this_.oftTreeEdit
            }
          })
            .then(res => {
              this_.$message.success('修改角色成功');
              this_.visibleEdit = false;
              this_.initData();
            })
            .catch(error => {
              this_.$message.error(error.msg);
            });
        }
      });
    },
    seeAbout() {
      this.page = 1;
      this.pageOptions.current = 1;
      this.formData.validateFields((err, values) => {
      	if (!err) {
          console.log(values)
          if (values.name!=undefined&&values.name!="") {
      		this.iptContent = values.name;

          } else{
            this.iptContent = null;
          }
      	this.initData();
      	}
      });
    },

    initData() {
      // 获取数据列表
      let this_ = this;
      request({
        url: `${this_.baseUrl}/Service/API/V1/CHP/role/getRoleTypeList`,
        method: 'post',
        data: {
          name: this.iptContent,
          page: this.page,
          limit: this.pageSize
        }
      })
        .then(res => {
            this.data = res.data.list;
            this.pageOptions.total = res.data.size|| 0;
        })
        .catch(error => {
          this.$message.error(error.msg);
        });
    },
    // ---------------------------------------------------------------------------------------------------新建
    treeShape() {
      // 新建树形结构
      let this_ = this;
      request({
        url: `${this_.baseUrl}/Service/API/V1/CHP/role/getRoleTree`,
        method: 'get'
      })
        .then(res => {
          for (let i = 0; i < res.data.length; i++) {
            var attrData = [];
            this_.checkedKeys.push(attrData);
          }
          this_.menus = res.data;
        })
        .catch(error => {
          this_.$message.error(error.msg);
        });
    },

    deleData(data) {
      // 删除角色

      if (this.alertCode === 0) {
        let this_ = this;
        request({
          url: `${this_.baseUrl}/Service/API/V1/CHP/role/deleteRoleType?roleTypeId=` + data.roleTypeId,
          method: 'get'
        })
          .then(res => {
            this_.initData();
            this_.$message.success('删除角色成功');
          })
          .catch(error => {
            this_.$message.error(error.msg);
          });
      }
    },
    showModal() {
      // 点击新建显示model
      this.visible = true;
      this.formRole.resetFields(); // 新建重置
      this.checkedKeys = []; // 选中的树形数据清空

      this.menus = []; // 菜单数据清空
      this.treeShape(); // 获取树形总数据
    },
    noModel() {
      // 新建关闭
      this.visible = false;
    },
    okModel(e) {
      // 新建保存
      e.preventDefault();
      this.formRole.validateFields((err, values) => {
        if (!err) {
          this.oftOf = [];
          this.oftTree = [];
          for (let i = 0; i < this.checkedKeys.length; i++) {
            this.oftOf = this.oftOf.concat(this.checkedKeys[i]);
          }
          console.log( this.oftOf)
          for (let i = 0; i < this.menus.length; i++) {
            for (let val in this.menus[i]) {
              this.oftTree = this.oftTree.concat(this.menus[i][val]);
            }
          }

          for (var i = 0; i < this.oftOf.length; i++) {
            for (var j = 0; j < this.oftTree.length; j++) {
              if (this.oftOf[i] == this.oftTree[j].menuId) {
                this.oftTree[j].limitType = 1;
              }
            }
          }

          let this_ = this;
          request({
            url: `${this_.baseUrl}/Service/API/V1/CHP/role/insertRole`,
            method: 'post',
            data: {
              roleTypeName: values.roleTypeName,
              roleMenuVOS: this.oftTree
            }
          })
            .then(res => {
              this_.$message.success('新建角色成功');
              this_.visible = false;
              this_.initData();
            })
            .catch(error => {
              this_.$message.error(error.msg);
            });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
form .ant-select {
  min-width: 100px !important;
}
.filter_box {
  text-align: right;
  margin-bottom: 20px;
}
.container {
  padding: 20px;
}
.tree-min {
  padding: 5px;
  margin-bottom: 5px;
  border: 1px solid rgba(232, 232, 232, 1);
}
.format{
  font-size: 16px;
  font-weight: 600;
text-indent: 10px;
margin-bottom: 5px;
}
.ant-form-inline .ant-form-item {
  margin-left: 16px;
  margin-right: 0;
}
</style>
