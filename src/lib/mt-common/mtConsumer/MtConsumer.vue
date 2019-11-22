<template>
  <div id="MtConsumer_component" class="container">
    <input class="ipt-hid" type="text" />
    <input class="ipt-hid" type="password" />
    <EditTheUser v-if="receiveEditState" :selects="selects" :receiveEdit="receiveEdit" :baseUrl = 'baseUrl' @edit="editModal" @cancelEdit="cancelEditModal"></EditTheUser>
    <NewTheUser v-if="newUser" :selects="selects" @save="saveModal" :baseUrl = 'baseUrl' @cancel="cancelModal"></NewTheUser>
    <Particulars :details="details" v-if="detailsState" @show="consumerToggle" :baseUrl = 'baseUrl'></Particulars>
    <div class="big" v-if="consumer">
      <a-form class="filter_box" :form="formData" layout="inline">
        <a-form-item><a-input style="width:100%;" v-model="iptContent" placeholder="请输入姓名" /></a-form-item>
        <a-form-item>
          <a-button icon="search" @click="seeAbout()" type="primary">查询用户</a-button>
          <a-button icon="plus" style="margin-left:20px;" type="primary" @click="showModal">新建用户</a-button>
        </a-form-item>
      </a-form>

      <a-table id="table_blue" :pagination="pageOptions" :columns="columns" :dataSource="data">
        <template slot="action" slot-scope="text, record">
          <a-row>
            <a-col :span="8"><a v-if="record.deleteFlg" href="javascript:;" @click="showModalEdit(record)">编辑</a></a-col>
            <a-col :span="8"><a v-if="record.deleteFlg" href="javascript:;" @click="detailsData(record)">详情</a></a-col>

            <a-col :span="8">
              <a-popconfirm title="确定要删除该用户吗？" @confirm="deleData(record)" placement="top" okText="确定" cancelText="取消">
                <a v-if="record.deleteFlg" href="javascript:;">删除</a>
              </a-popconfirm>
            </a-col>
          </a-row>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import Particulars from './Particulars.vue'
import EditTheUser from './EditTheUser.vue'
import NewTheUser from './NewTheUser.vue'
import request from '../utils/request'
const columns = [
  {
    title: '姓名',
    dataIndex: 'employeeName',
    width: '12%'
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    width: '15%'
  },

  {
    title: '用户组',
    dataIndex: 'roleTypeName',
    width: '15%'
  },
  {
    title: '电话',
    dataIndex: 'phone',
    width: '15%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '15%'
  },
  {
    title: '创建者',
    dataIndex: 'createUser',
    width: '12%'
  },
  {
    title: '操作',
    dataIndex: '',
    scopedSlots: { customRender: 'action' },
    width: '16%'
  }
]

export default {
  components: {
    NewTheUser,
    EditTheUser,
    Particulars
  },
  name: 'mt-consumer-page',
  props: {
    baseUrl: {
      type: String,
      default: '/mtCommonApi'
    }
  },
  data () {
    return {
      consumer: true, // 主页面状态
      newUser: false, // 新建状态
      detailsState: false, // 详情状态
      details: {}, // 详情信息
      receiveEditState: false, // 编辑信息状态
      receiveEdit: {}, // 编辑用户信息
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      },
      columns,
      iptContent: null, // 输入框内容
      selects: [], // 下拉数据
      data: [], // table数据
      pageSize: 10, // 条数
      page: 1, // 当前页
      pageOptions: {
        // 分页
        current:1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        total: 0,
        onShowSizeChange: (current, size) => {
          // 每页多少条
          this.pageSize = size
          this.page = current
          this.pageOptions.current=current
          this.initData()
        },
        onChange: (page, pageSize) => {
          // 跳页
          this.page = page
          this.pageOptions.current=page
          this.initData()
        }
      }
    }
  },
  beforeCreate () {
    this.formData = this.$form.createForm(this)
  },

  created () {
    this.initData()
  },
  methods: {
    // ------------------------------------------------ 数据列表
    initData () {
      // table数据列表接口
      let this_ = this
      request({
        url: `${this_.baseUrl}/Service/API/V1/CHP/user/managerList`,
        method: 'post',
        data: {
          keyWord: this.iptContent,
          currentPage: this.page,
          pageNum: this.pageSize
        }
      })
        .then(res => {
          this.pageOptions.total = res.data.totalCount|| 0
          this.data = res.data.userJsons
        })
        .catch(() => {
          this.$message.error('获取数据列表失败')
        })
    },
    seeAbout () {
      this.page=1
      this.pageOptions.current =1
      this.initData()
    },
    // ------------------------------------------------ 下拉列表
    selectData () {
      // 下拉数据接口
      let this_ = this
      request({
        url: `${this_.baseUrl}/Service/API/V1/CHP/role/list`,
        method: 'get'
      })
        .then(res => {
          this.selects = res.data
        })
        .catch(() => {
          this.$message.error('获取下拉角色列表失败')
        })
    },

    // ------------------------------------------------ 删除
    deleData (data) {
      // 删除model
      let thisName = this // 赋值this
      request({
        url: `${thisName.baseUrl}/Service/API/V1/CHP/user/delete/${data.userId}`,
        method: 'delete'
      })
        .then(res => {
          this.$message.success('删除成功')

          thisName.initData()
        })
        .catch(() => {
          this.$message.error('删除失败')
        })
    },

    // ------------------------------------------------ 新建
    showModal () {
      // 新建页显示传值
      this.selectData() // 调用下拉方法
      this.consumer = false // 主页隐藏
      this.newUser = true // 新建状态
    },
    cancelModal () {
      // 新建页取消按钮
      this.consumer = true // 主页显示
      this.newUser = false // 新建隐藏
    },
    saveModal () {
      // 新建保存按钮
      this.consumer = true // 主页显示
      this.newUser = false // 新建隐藏
      this.initData()
    },

    // ------------------------------------------------ 修改
    showModalEdit (data) {
      // 获取编辑用户的信息
      // 编辑显示
      let this_ = this
      this.receiveEdit = {}

      // 详情框
      request({
        url: `${this_.baseUrl}/Service/API/V1/CHP/user/detail`,
        method: 'post',
        data: {
          userId: data.userId
        }
      })
        .then(res => {
          this.receiveEdit = res.data
        })
        .catch(() => {
          this.$message.error('获取用户信息失败')
        })
    this.consumer = false // 主页隐藏
      this.receiveEditState = true // 详情显示
      this.selectData() // 调用下拉数据
    },

    cancelEditModal () {
      // 修改页取消按钮
      this.consumer = true // 主页显示
      this.receiveEditState = false // 修改隐藏
    },

    editModal () {
      // 修改保存按钮
      this.initData()
      this.consumer = true // 主页显示
      this.receiveEditState = false // 修改隐藏
    },

    // ------------------------------------------------ 详情
    consumerToggle () {
      // 详情出发x按钮
      this.consumer = true // 主页显示
      this.detailsState = false // 详情隐藏
    },
    detailsData (data) {
      // 详情页面传递值
      let this_ = this
      this.details = {}
      this.consumer = false // 主页隐藏
      this.detailsState = true // 详情显示
      // 详情框
      request({
        url: `${this_.baseUrl}/Service/API/V1/CHP/user/detail`,
        method: 'post',
        data: {
          userId: data.userId
        }
      })
        .then(res => {
          this.details = res.data
        })
        .catch(() => {
          this.$message.error('获取用户详情信息失败')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.filter_box {
  text-align: right;
  margin-bottom: 20px;
}
.container {
  padding: 20px;
  position: relative;
  .big {
    width: 100%;
    height: 100%;
  }
}
.ipt-hid {
  position: fixed;
  top: -10000px;
}
.ant-form-inline .ant-form-item{
  margin-left: 16px;
  margin-right: 0;
}
</style>
