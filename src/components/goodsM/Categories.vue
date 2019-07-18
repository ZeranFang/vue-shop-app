<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <div class="grid-content bg-purple">
        <el-button type="primary">添加分类</el-button>
      </div>

      <!-- 分类表格展示区域 -->
      <template>
        <el-table :data="cateListData" border style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
        </el-table>
      </template>

      <!-- 底部分页区域 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
        // 所有商品分类名称
        cateListData:{}
    };
  },
  created(){
      
  }
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  font-size: 14px;
  margin-bottom: 15px;
}
.el-card {
  .grid-content {
    margin-bottom: 15px;
  }
  .el-table {
    font-size: 12px;
  }
  .el-pagination {
    margin-top: 15px;
  }
}
</style>
