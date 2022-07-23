<template>
  <el-container>
    <div class="mask"></div>
    <div class="loginAndRegister">
      <div class="toRegister">
        <div class="title">创建账户</div>
        <div class="inputs">
          <el-form
            :rules="rules"
            status-icon
            ref="registerfrom"
            :model="registerfrom"
          >
            <el-form-item prop="username">
              <el-input
                autocomplete="new-password"
                v-model="registerfrom.username"
                placeholder="请输入用户邮箱"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="yzm">
              <div style="display: flex">
                <el-input
                  v-model="registerfrom.yzm"
                  autocomplete="new-password"
                  placeholder="请输入邮箱验证码"
                  style="margin-right: 10px"
                  clearable
                ></el-input>
                <el-button :disabled="disabled" @click="checkyzm()">{{
                  yzmBtnInfo
                }}</el-button>
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="registerfrom.password"
                placeholder="请输入6位以上的密码"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="checkPassword">
              <el-input
                v-model="registerfrom.checkPassword"
                placeholder="确认密码"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <div style="display: flex">
                <div class="regbtn">
                  <el-button @click="register('registerfrom')">创建</el-button>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="toLogin">
        <div class="info">
          <p style="font-size: 22px; font-weight: bold">欢迎回来！</p>
          <p>与我们保持联系，请登录你的账户。</p>
          <router-link to="/login"
            ><el-button round>登录</el-button></router-link
          >
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
export default {
  data() {
    // 邮箱格式校验
    var checkusername = (rule, value, callback) => {
      var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!regEmail.test(this.registerfrom.username)) {
        this.validMail = false;
        callback(new Error("邮箱格式不正确！"));
      } else {
        this.validMail = true;
        callback();
      }
    };
    // 密码校验
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerfrom.checkPassword !== "") {
          this.$refs.registerfrom.validateField("checkPassword");
        }
        callback();
      }
    };
    // 确认密码校验
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerfrom.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    // 验证码校验
    var checkYzm = (rule, value, callback) => {
      if (this.registerfrom.yzm === undefined) {
        callback(new Error("请输入验证码！"));
      } else {
        if (this.mailyzm != this.registerfrom.yzm) {
          callback(new Error("验证码输入错误！"));
        } else {
          callback();
        }
      }
    };
    return {
      registerfrom: {},
      yzmBtnInfo: "发送验证码",
      disabled: false,
      isTrigger: false,
      mailyzm: "",
      validMail: true,
      rules: {
        username: [
          { required: true, message: "请输入用户邮箱！", trigger: "blur" },
          { validator: checkusername, trigger: "blur" },
        ],
        password: [
          { validator: validatePass, trigger: "blur" },
          { required: true, message: "请输入密码！", trigger: "blur" },
          { min: 6, message: "密码长度应有6个以上的字符", trigger: "blur" },
        ],
        checkPassword: [
          { validator: validatePass2, trigger: "blur" },
          { required: true, message: "请确认密码！", trigger: "blur" },
        ],
        yzm: [{ validator: checkYzm, trigger: "blur" }],
      },
    };
  },
  methods: {
    checkyzm() {
      var mail = this.registerfrom.username;
      if (!mail || !this.validMail) {
        // this.$message({
        //   type: "warning",
        //   message: "请输入有效的邮箱进行校验！",
        // });
        return false;
      } else {
        // 倒计时
        if (this.isTrigger) return;
        let n = 60;
        let inval = setInterval(() => {
          if (n === 0) {
            this.yzmBtnInfo = "重新获取验证码";
            this.isTrigger = false;
            clearInterval(inval);
          } else {
            this.isTrigger = true;
            this.yzmBtnInfo = `${n--}秒后重发`;
          }
        }, 1000);

        // 向后台发送数据
        this.$http
          .get("utils/checkMail", {
            params: {
              mail: mail,
            },
          })
          .then((res) => {
            let data = res.data;
            this.mailyzm = data.yzm;
            if (data.code == 1) {
              this.$message({
                type: "warning",
                message: data.msg,
              });
            } else if (data.code == 2) {
              this.$message({
                type: "success",
                message: data.msg,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    register(formName) {
      var usermail = this.registerfrom.username;
      var password = this.registerfrom.password;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http
            .post("users/register", {
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

                let tologin = setInterval(() => {
                  this.$router.push("/login");
                  clearInterval(tologin);
                }, 3000);
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
  created() {},
};
</script>
<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100vh;
  background: url(.././assets/HomePage/blacksky.jpg) no-repeat;
  background-size: 100% 100vh;
  .mask {
    width: 100%;
    height: 100vh;
    z-index: 2;
    background-color: rgba($color: rgb(219, 219, 219), $alpha: 0.1);
  }
  .loginAndRegister {
    position: absolute;
    z-index: 3;
    width: 800px;
    height: 400px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    cursor: pointer;
    display: flex;
    .toLogin {
      width: 240px;
      height: 100%;
      background-color: rgba($color: #006699, $alpha: 1);
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      .info {
        width: 180px;
        color: #fff;
        margin: 100px auto;
        .el-button {
          background: transparent;
          width: 100%;
          color: #fff;
        }
      }
    }
    .toRegister {
      width: 560px;
      height: 100%;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      background-color: rgba($color: rgb(129, 129, 129), $alpha: 0.1);
      .title {
        height: 86px;
        line-height: 86px;
        text-align: center;
        font-size: 26px;
        color: #fff;
        font-weight: 500;
      }
      .inputs {
        width: 70%;
        margin: 0 auto;
        // /deep/
        .el-input__inner {
          height: 40px;
          background-color: transparent;
          color: #fff;
        }
        .regbtn {
          width: 100%;
          color: #fff;
          .el-button {
            width: 100%;
            background: transparent;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>