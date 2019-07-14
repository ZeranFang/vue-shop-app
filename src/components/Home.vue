<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/images/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollpase">|||</div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <el-submenu :index="item.id + ''" v-for="item in menuLists" :key="item.id">
            <template slot="title">
              <i :class="iconLists[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="toggleUsersList(subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
            <!-- <el-submenu index="1-4">
              <template slot="title">选项4</template>
            </el-submenu>-->
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 二级路由展示路口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuLists: [],
      iconLists: {
        "125": "iconfont icon-users",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      isCollapse: false,
      activeMenu: "1"
    };
  },
  methods: {
    async getMenusList() {
      let { data: res } = await this.$http.get("menus");
      // console.log(res);
      if (res.meta.status != "200") return this.$message.error(res.meta.msg);
      this.menuLists = res.data;
    },
    logout: function() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    toggleCollpase: function() {
      this.isCollapse = !this.isCollapse;
    },
    toggleUsersList(path) {
      this.activeMenu = "/" + path;
      window.sessionStorage.setItem("path", this.activeMenu);
    }
  },
  mounted() {
    this.getMenusList();
    var path = window.sessionStorage.getItem("path");
    this.activeMenu = path;
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
        color: #fff;
        font-size: 20px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .toggle-button {
      background-color: #4a5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
    .el-menu {
      border-right: none;
      .el-submenu {
        i {
          margin-right: 10px;
        }
      }
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
