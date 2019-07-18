<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片表单区域 -->
    <el-card class="box-card">
      <!-- 搜索栏区域 -->
      <div :gutter="20" class="card-search">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">
              <el-button slot="append" icon="el-icon-search" @click="queryUserInfo"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addDialogFormVisible = true">添加用户</el-button>
          </div>
        </el-col>
      </div>
      <!-- 用户表格区域 -->
        <el-table :data="usersListData" stripe style="width: 100%" border>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editUserData(scope.row.id)"
              ></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleUserData(scope.row.id)"></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      <!-- 分页器区域 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size.sync="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
        <el-form
          :model="userForm"
          :rules="rules"
          ref="addUserFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="userForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="userForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddUserForm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑用户列表信息弹出框 -->
      <el-dialog title="修改用户信息" :visible.sync="editDialogFormVisible">
        <el-form :model="userForm" :rules="rules" ref="editUserFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="userForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditUserForm(userForm.id)">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>


<script>
export default {
  data() {
    // 手机号校验
    var validateMobile = (rule, value, callback) => {
      var regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (!regMobile.test(value)) {
        callback(new Error("请输入正确手机号"));
      } else {
        return callback();
        // this.$refs.userFormRef.validateField("mobile");
      }
    };
    return {
      // 用户列表数据
      usersListData: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 添加用户对话框是否打开
      addDialogFormVisible: false,
      // 编辑对话框是否打开
      editDialogFormVisible: false,
      // 添加用户表单数据
      userForm: {
        id: 0,
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "change"
          }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validateMobile, trigger: "change" }
        ]
      }
    };
  },
  methods: {
    // 获取用户表格数据
    async getUsersList() {
      let { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      //   console.log(res)
      this.usersListData = res.data.users;
      this.total = res.data.total;
    },
    // 改变用户状态
    async userStateChanged(data) {
      let { data: res } = await this.$http.put(
        "users/" + data.id + "/state/" + data.mg_state
      );
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.$message.close();
      this.$message.success(res.meta.msg);
      this.getUsersList();
    },
    // 页码大小处理回调
    handleSizeChange() {
      this.getUsersList();
    },
    // 跳转页码处理回调
    handleCurrentChange() {
      this.getUsersList();
    },
    // 添加用户功能
    submitAddUserForm() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return false;
        var { data: res } = await this.$http.post("users", this.userForm);
        if (res.meta.status != 201) return this.$message.error(res.meta.msg);
        this.$message.success("添加用户成功");
        this.getUsersList();
        this.addDialogFormVisible = false;
      });
    },
    // 查询用户信息
    queryUserInfo() {
      this.getUsersList();
    },
    // 编辑用户列表信息
    async editUserData(id) {
      let { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.userForm = res.data;
      this.editDialogFormVisible = true;
    },
    // 提交编辑用户列表信息
    submitEditUserForm(id) {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return false;
        let { data: res } = await this.$http.put("users/" + id, {
          email: this.userForm.email,
          mobile: this.userForm.mobile
        });
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success("更新用户成功");
        this.getUsersList();
        this.editDialogFormVisible = false;
      });
    },
    // 删除用户数据
    async deleUserData(id) {
      let {data:res} = await this.$http.delete('users/'+id)
      if(res.meta.status !== 200) return this.$message.error("删除用户失败")
      this.$message.success("删除用户成功");
      this.getUsersList();
    }
  },
  // 加载用户表格数据
  created() {
    this.getUsersList();
  },
  watch: {
    addDialogFormVisible: function() {
      if (!this.addDialogFormVisible) {
        this.userForm = { username: "", password: "", email: "", mobile: "" };
        return this.$refs.addUserFormRef.resetFields();
      }
    },
    editDialogFormVisible: function() {
      if (!this.editDialogFormVisible) {
        this.userForm = { username: "", password: "", email: "", mobile: "" };
        return this.$refs.editUserFormRef.resetFields();
      }
    }
  }
};
</script>

<style lang="less" scoped>
div {
  .el-breadcrumb {
    font-size: 14px;
    margin-bottom: 15px;
  }
  .el-card {
    .card-search {
      overflow: hidden;
      margin-left: -20px;
      margin-bottom: 15px;
      .grid-content {
        margin-left: 20px;
      }
    }
    .el-table {
      font-size: 12px;
    }
    .el-pagination {
      margin-top: 15px;
    }
  }
}
</style>
