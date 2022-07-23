<template>
  <el-container>
    <div class="mask"></div>
    <div class="loginAndRegister">
      <div class="toRegister">
        <div class="info">
          <p style="font-size: 22px; font-weight: bold">你好，朋友！</p>
          <p>注册你的账户，我们一起探索。</p>
          <router-link to="/register"
            ><el-button round>注册</el-button></router-link
          >
        </div>
      </div>
      <div class="toLogin">
        <div class="title">账户登录</div>
        <div class="inputs">
          <el-form
            :rules="rules"
            status-icon
            ref="loginfrom"
            :model="loginfrom"
          >
            <el-form-item prop="username">
              <el-input
                autocomplete="new-password"
                v-model="loginfrom.username"
                placeholder="用户邮箱"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginfrom.password"
                placeholder="密码"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="yzm">
              <div style="display: flex">
                <el-input
                  clearable
                  v-model="loginfrom.yzm"
                  placeholder="验证码"
                  style="margin-right: 10px"
                ></el-input>
                <div @click="getyzm()" v-html="codeyzm"></div>
              </div>
            </el-form-item>
            <el-form-item class="loginbtn">
              <el-button @click="login('loginfrom')">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
export default {
  data() {
    // 验证码校验
    var checkYzm = (rule, value, callback) => {
      if (this.loginfrom.yzm === undefined) {
        callback(new Error("请输入验证码！"));
      } else {
        if (this.yzmtext != this.loginfrom.yzm.toLowerCase()) {
          callback(new Error("验证码输入错误！"));
          this.getyzm();
        } else {
          callback();
        }
      }
    };
    return {
      codeyzm: "",
      yzmtext: "",
      loginfrom: {},
      rules: {
        username: [
          { required: true, message: "请输入用户邮箱！", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码！", trigger: "blur" },
        ],
        yzm: [{ validator: checkYzm, trigger: "blur" }],
      },
    };
  },
  methods: {
    getyzm() {
      this.$http
        .get("utils/getCaptcha")
        .then((res) => {
          let { data, text } = res.data;
          this.codeyzm = data;
          this.yzmtext = text.toLowerCase();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    login(formName) {
      var usermail = this.loginfrom.username;
      var password = this.loginfrom.password;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 登录之前清除token
          localStorage.removeItem("token");
          this.$http
            .post("users/login", {
              password: password,
              usermail: usermail,
            })
            .then((res) => {
              let data = res.data;
              if (data.code == 200) {
                this.$message({
                  type: "success",
                  message: data.msg,
                });
                //使用vuex对全局token进行状态管理
                this.$store.dispatch("set_token", data.token);
                this.$store.dispatch("set_userId", data.userid);
                this.$store.dispatch("set_userName", data.username);

                let tomain = setInterval(() => {
                  this.$router.push("/main");
                  clearInterval(tomain);
                }, 3000);
              } else if (data.code == 404) {
                this.$message({
                  type: "warning",
                  message: data.msg,
                });
                this.getyzm();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
  },
  created() {
    this.getyzm();
  },
};
</script>
<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100vh;
  background: url(.././assets/HomePage/blacksky.jpg) no-repeat;
  .mask {
    width: 100%;
    height: 100vh;
    z-index: 2;
    background-color: rgba($color: rgb(236, 236, 236), $alpha: 0.15);
  }
  .loginAndRegister {
    position: absolute;
    z-index: 3;
    width: 800px;
    height: 350px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    cursor: pointer;
    display: flex;
    .toRegister {
      width: 240px;
      height: 100%;
      background-color: rgba($color: #006699, $alpha: 1);
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      .info {
        width: 180px;
        margin: 100px auto;
        color: #fff;
        .el-button {
          background: transparent;
          width: 100%;
          color: #fff;
        }
      }
    }
    .toLogin {
      width: 560px;
      height: 100%;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      background-color: rgba($color: #fff, $alpha: 0.1);
      .title {
        height: 86px;
        line-height: 86px;
        text-align: center;
        font-size: 26px;
        color: #fff;
        font-weight: 500;
      }
    }
  }
}
</style>

<style lang="scss">
.inputs {
  width: 70%;
  margin: 0 auto;
  .el-input__inner {
    height: 40px;
    background-color: transparent;
    color: #fff;
  }
  .loginbtn {
    .el-button {
      width: 100%;
      background: transparent;
      color: #fff;
    }
  }
}
</style>