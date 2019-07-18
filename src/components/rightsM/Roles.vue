<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加角色弹出框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible" @close="addDialogFormColsed">
      <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRoleForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限弹出框 -->
    <el-dialog title="分配权限" :visible.sync="distDialogVisible" @close="distDialogClosed">
      <el-tree
        :data="rightsListData"
        show-checkbox
        default-expand-all
        :default-checked-keys="treeNodeKeys"
        node-key="id"
        ref="rightsTree"
        highlight-current
        :props="rightsTreeProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDistForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色弹出框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogFormVisible" @close="editDialogFormColsed">
      <el-form
        :model="editRoleForm"
        :rules="editRoleRules"
        ref="editRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditRoleForm(editRoleForm.id)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 卡片内容区域 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="addDialogFormVisible = true">添加角色</el-button>
      </el-row>
      <el-table :data="rolesListData" stripe style="width: 100%" border>
        <!-- 展开权限标签表格 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row
              v-for="(item1,i1) in props.row.children"
              :key="item1.id"
              :class="[i1 == 0? 'bd-top':'','vcenter','bd-bottom']"
            >
              <!-- 一级权限标签 -->
              <el-col :span="5">
                <el-tag closable @close="removeRoleById(props.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二/三级权限标签 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 == 0? '':'bd-top','vcenter']"
                >
                  <!-- 二级权限标签 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRoleById(props.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限标签 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRoleById(props.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 表格表单内容区域 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="props">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRole(props.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleRole(props.row)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="distRights(props.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 添加角色弹出框
      addDialogFormVisible: false,
      // 修改角色弹出框
      editDialogFormVisible: false,
      // 分配权限弹出框
      distDialogVisible: false,
      // 所有角色列表数据
      rolesListData: [],
      // 添加角色表单
      addRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      // 编辑角色表单
      editRoleForm: {
        id: 0,
        roleName: "",
        roleDesc: ""
      },
      // 所有权限列表数据
      rightsListData: [],
      // 权限树配置项
      rightsTreeProps: {
        label: "authName",
        children: "children"
      },
      // 角色的树形节点id
      treeNodeKeys: [],
      // 提交权限的角色ID
      RoleID: 0,
      // 添加角色验证
      addRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      // 修改角色验证
      editRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 获取角色列表数据
    async getRolesData() {
      let { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolesListData = res.data;
    },
    // 展开框 根据ID删除权限标签
    async removeRoleById(role, rightId) {
      let confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续??",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      let { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      this.$message.success("删除权限成功");
      role.children = res.data;
    },
    // 监听添加角色弹出框的关闭
    addDialogFormColsed() {
      this.$refs.addRoleFormRef.resetFields();
    },
    // 提交添加角色
    submitAddRoleForm() {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return false;
        let { data: res } = await this.$http.post("roles", this.addRoleForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加角色失败");
        }
        this.$message.success("添加角色成功");
        this.addDialogFormVisible = false;
        this.getRolesData();
      });
    },
    // 删除角色
    async deleRole(Role) {
      let { data: res } = await this.$http.delete("roles/" + Role.id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色失败");
      }
      this.$message.success("删除角色成功");
      this.getRolesData();
    },
    // 编辑角色
    editRole(Role) {
      this.editRoleForm.id = Role.id;
      this.editRoleForm.roleName = Role.roleName;
      this.editRoleForm.roleDesc = Role.roleDesc;
      this.editDialogFormVisible = true;
    },
    // 监听修改角色弹出框关闭
    editDialogFormColsed() {
      this.editRoleForm.roleName = "";
      this.editRoleForm.roleDesc = "";
      this.editRoleForm.id = 0;
      this.$refs.editRoleFormRef.resetFields();
    },
    // 提交编辑
    submitEditRoleForm(id) {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return false;
        let { data: res } = await this.$http.put(
          "roles/" + id,
          this.editRoleForm
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改角色信息失败");
        }
        this.$message.success("修改角色成功");
        this.editDialogFormVisible = false;
        this.getRolesData();
      });
    },
    // 分配权限按钮
    async distRights(role) {
      this.RoleID = role.id;
      let { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.rightsListData = res.data;
      this.getTreeNodeKeys(role, this.treeNodeKeys);
      this.distDialogVisible = true;
    },
    // 获取角色的树形结构KeyId
    getTreeNodeKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getTreeNodeKeys(item, arr));
    },
    // 监听分配权限弹出框关闭
    distDialogClosed() {
      this.treeNodeKeys = [];
    },
    // 提交分配权限
    async submitDistForm() {
      let keys = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys()
      ];
      var rids = keys.join(",");
      let { data: res } = await this.$http.post(`roles/${this.RoleID}/rights`, {
        rids: rids
      });
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.distDialogVisible = false;
      this.getRolesData();
    }
  },
  created() {
    this.getRolesData();
  }
};
</script>

<style lang="less" scoped>
div {
  .el-breadcrumb {
    font-size: 14px;
    margin-bottom: 15px;
  }
  .el-table {
    margin-top: 10px;
    font-size: 12px;
  }
  .el-tag {
    margin: 7px;
  }
  .bd-bottom {
    border-bottom: 1px solid #eee;
  }
  .bd-top {
    border-top: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
}
</style>
