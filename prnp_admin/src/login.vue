<template>
  <el-container>
    <div class="mask"></div>
    <div class="container">
      <div class="title"><div>PRNP ADMIN LOGIN</div></div>
      <div class="inputs">
        <input v-model="userid" class="text" placeholder="账号" type="text" />
        <input v-model="pwd" class="text" placeholder="密码" type="text" />
        <input @click="login" class="btn" type="submit" value="登录" />
      </div>
    </div>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      admin: {
        userid: "13719286510",
        password: "123456",
      },
      userid: "",
      pwd: "",
    };
  },
  methods: {
    login() {
      if (this.userid == "" || this.pwd == "") {
        this.$message({
          type: "warning",
          message: "请输入账号或密码！",
        });
      } else {
        if (
          this.userid != this.admin.userid ||
          this.pwd != this.admin.password
        ) {
          this.$message({
            type: "warning",
            message: "账号或密码不正确！",
          });
        } else {
          this.$message({
            type: "success",
            message: "登录成功！即将跳转首页。",
          });
          let tomain = setInterval(() => {
            this.$router.push("/home");
            clearInterval(tomain);
          }, 3000);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-container {
  background: url(../public/home.jpg) no-repeat;
  .mask {
    width: 100%;
    height: 100vh;
    background-color: rgba(71, 184, 154, 0.6);
    z-index: 2;
  }
  .container:hover {
    border: 3px solid #2cf3bb;
    .title {
      font-family: Arial, Helvetica, sans-serif;
      color: #2cf3bb;
      border-right: 3px solid #2cf3bb;
    }
  }
  .container {
    position: absolute;
    font-family: STCaiyun;
    padding: 0;
    z-index: 3;
    width: 700px;
    height: 50%;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    cursor: pointer;
    border: 3px solid rgb(226, 226, 226);
    outline: none;
    border-radius: 20px;
    display: flex;
    .title {
      width: 250px;
      margin: auto 0;
      line-height: 80px;
      text-align: center;
      border-right: 3px solid rgb(226, 226, 226);
      font-size: 4em;
      font-weight: bold;
      color: rgb(226, 226, 226);
    }

    .inputs {
      width: 450px;
      margin: auto;
      .btn {
        width: 308px;
        height: 40px;
        margin: 5px 70px 0 70px;
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0);
        border: 3px solid rgb(226, 226, 226);
        color: rgb(226, 226, 226);
        font-weight: bold;
        font-size: 18px;
      }
      .btn:hover {
        background-color: rgba(44, 243, 187, 0.2);
      }
      .text {
        width: 300px;
        height: 30px;
        margin: 0 70px 40px 70px;
        display: block;
        background-color: rgba(255, 255, 255, 0);
        border: 0;
        border-bottom: 3px solid rgb(226, 226, 226);
        font-size: 18px;
        text-align: center;
        color: rgb(226, 226, 226);
        font-weight: bold;
      }
      .text::-webkit-input-placeholder {
        color: rgb(226, 226, 226);
        font-weight: bold;
      }
      .text:focus {
        border: 0;
        outline: none;
        border-bottom: 3px solid rgb(226, 226, 226);
      }
    }
  }
}
</style>