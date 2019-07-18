<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区域 -->
    <el-card>
      <!-- 搜索栏区域 -->
      <div :gutter="20" class="card-search">
        <el-col :span="8" class="serachGoods">
          <div class="grid-content bg-purple">
            <el-input
              placeholder="请输入内容"
              clearable
              v-model="queryGoodsForm.query"
              @clear="getGoodsListData"
            >
              <el-button slot="append" icon="el-icon-search" @click="queryGoodsInfo"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="primary">添加商品</el-button>
          </div>
        </el-col>
      </div>

      <!-- 商品表格展示区域 -->
      <template>
        <el-table :data="goodsListData.goods" border style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="150">
            <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
          </el-table-column>
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editGoodsData(scope.row.goods_id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleGoodsData(scope.row.goods_id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 底部分页区域 -->
      <template>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryGoodsForm.pagenum"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="queryGoodsForm.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="goodsListData.total"
          ></el-pagination>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有商品数据
      goodsListData: {},
      // 获取商品信息请求参数
      queryGoodsForm: {
        query: "",
        pagenum: 1,
        pagesize: 10
      }
    };
  },
  created() {
    this.getGoodsListData();
  },
  methods: {
    // 获取商品列表数据
    async getGoodsListData() {
      let { data: res } = await this.$http.get("goods", {
        params: {
          query: this.queryGoodsForm.query,
          pagenum: this.queryGoodsForm.pagenum,
          pagesize: this.queryGoodsForm.pagesize
        }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      //   console.log(res.data);
      this.goodsListData = res.data;
    },
    // 查询商品信息
    queryGoodsInfo() {
      this.getGoodsListData();
    },
    // 编辑商品信息
    editGoodsData(id) {},
    // 删除商品信息
    async deleGoodsData(id) {
        // console.log(id);
      let confirmResult = await this.$confirm(
        "此操作将永久删除该商品信息, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => {
        this.$message.info("已取消删除");
      });
    //   console.log(confirmResult);
      if (confirmResult === "confirm") {
        let { data: res } = await this.$http.delete(`goods/${id}`);
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("删除商品信息失败");
        }
        this.$message.success("删除商品成功");
        this.getGoodsListData();
      }
    },
    // 页面size改变处理事件
    async handleSizeChange(pagesize) {
      this.queryGoodsForm.pagesize = pagesize;
      this.getGoodsListData();
    },
    // 页面页码切换处理事件
    handleCurrentChange(pagenum) {
      this.queryGoodsForm.pagenum = pagenum;
      this.getGoodsListData();
    }
  }
};
</script>

<style lang="less" scoped>
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
</style>
