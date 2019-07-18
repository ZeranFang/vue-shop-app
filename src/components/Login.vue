<template>
  <div class="cmp_login">
    <div class="login_box">
      <div class="avatar">
        <img src="../assets/images/logo.png" alt />
      </div>
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-lock_fill"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="login_btn">
          <el-button type="primary" @click="submitLogin('loginForm')">登录</el-button>
          <el-button type="info" @click="resetLogin('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
          // { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
          // { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetLogin: function(formName) {
      this.$refs[formName].resetFields();
    },
    submitLogin: function(formName) {
      this.$refs[formName].validate(async verification => {
        // 表单校验
        if (!verification) return;
        // 成功后发送http请求
        let { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        // 将token写入sessionStroage
        window.sessionStorage.setItem("token", res.data.token);
        // 跳转到home页
        this.$router.push("/home");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.cmp_login {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 500px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    img {
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    position: absolute;
    top: 35%;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
    .login_btn {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
