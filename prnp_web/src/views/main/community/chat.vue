<template>
  <div class="chat">
    <div class="title">一次性消息</div>
    <div class="message">
      <div class="list" v-for="(item, i) in messageList" :key="i">
        <p class="tips" v-if="item.type === 1">{{ item.msg }}</p>
        <div v-else-if="item.type === 2 && item.uid == uid">
          <div class="msgs">
            <span class="msg">{{ item.msg }}</span>
            <span style="font-weight: 20px">{{ item.username }}</span>
          </div>
        </div>
        <div v-else>
          <div class="msg-l">
            <span style="font-weight: 20px">{{ item.username }}</span>
            <span class="msg">{{ item.msg }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="input">
      <el-input
        type="textarea"
        :rows="2"
        v-model="msg"
        placeholder="发一条评论吧"
      ></el-input>
      <el-button type="success" @click="send">发送</el-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import moment from "moment";

export default {
  name: "App",
  data() {
    return {
      switchType: 1,
      uid: this.$store.state.USERID,
      username: this.$store.state.USERNAME,
      socket: "",
      msg: "",
      messageList: [],
      users: [],
      bridge: [],
    };
  },
  mounted() {
    let vm = this;
    let user = localStorage.getItem("WEB_IM_USER");
    user = (user && JSON.parse(user)) || {};
    vm.uid = user.uid;
    vm.username = user.username;

    document.onkeydown = function (event) {
      var e = event || window.event;
      if (e && e.keyCode == 13) {
        //回车键的键值为13
        vm.send();
      }
    };
    // 刷新or退出
    window.onbeforeunload = function (e) {
      vm.socket.send(
        JSON.stringify({
          uid: vm.uid,
          username: vm.username,
          type: 2,
          bridge: [],
        })
      );
    };
  },
  computed: {
    currentMessage() {
      let vm = this;
      let data = vm.messageList.filter((item) => {
        if (item.type === 1) {
          return item;
        } else if (item.bridge.length) {
          return item.bridge.sort().join(",") == vm.bridge.sort().join(",");
        }
      });
      data.map((item) => {
        item.status = 0;
        return item;
      });
      return data;
    },
  },
  methods: {
    send() {
      this.msg = this.msg.trim();
      if (!this.msg) {
        this.$message({ type: "error", message: "说句话呀" });
        return;
      }
      this.sendMessage(100, this.msg);
    },
    sendMessage(type, msg) {
      this.socket.send(
        JSON.stringify({
          uid: this.uid,
          username: this.username,
          type: type,
          msg: msg,
          bridge: this.bridge,
        })
      );
      this.msg = "";
    },
    conWebSocket() {
      let vm = this;
      if (window.WebSocket) {
        vm.socket = new WebSocket("ws://localhost:5000");
        let socket = vm.socket;
        let username = vm.username;
        let uid = vm.uid;
        socket.onopen = function (e) {
          vm.$message({ type: "success", message: "连接服务器成功" });
          if (!vm.uid) {
            vm.uid = uid;
            vm.username = username;
            localStorage.setItem(
              "WEB_IM_USER",
              JSON.stringify({
                uid: vm.uid,
                username: vm.username,
              })
            );
          }
          vm.sendMessage(1);
        };
        socket.onclose = function (e) {
          console.log("服务器关闭");
        };
        socket.onerror = function () {
          console.log("连接出错");
        };
        // 接收服务器的消息
        socket.onmessage = function (e) {
          let message = JSON.parse(e.data);
          vm.messageList.push(message);
          if (message.users) {
            vm.users = message.users;
          }

          vm.$nextTick(function () {
            var div = document.getElementById("im-record");
            div.scrollTop = div.scrollHeight;
          });
        };
      }
    },
  },
  created() {
    this.conWebSocket();
    this.uid = this.$store.state.USERID;
  },
};
</script>

<style lang='scss' scoped>
.chat {
  width: 100%;

  color: rgb(71, 71, 71);
  .title {
    padding: 20px;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    border-bottom: 1px solid rgb(226, 225, 225);
  }
  .message {
    padding: 20px;
    height: 400px;
    background-color: rgb(238, 238, 238);
    border-left: 1px solid rgb(219, 219, 219);
    border-right: 1px solid rgb(219, 219, 219);
    overflow: auto;
    .list {
      width: 100%;
      p {
        margin: 0;
        padding: 5px;
      }
      .tips {
        padding: 0;
        margin: 0;
        font-size: 12px;
        color: rgb(122, 121, 121);
        text-align: center;
      }
      .msgs,
      .msg-l {
        height: 60px;
        line-height: 60px;
        color: rgb(23, 128, 105);
        .msg {
          position: relative;
          height: 20px;
          line-height: 20px;
          border-radius: 5px;
          padding: 10px;
          background-color: #47b897;
          color: #fff;
        }
        .msg::before {
          content: "";
          position: absolute;
          border: 8px solid;
          top: 10px;
        }
      }
      .msgs {
        display: flex;
        justify-content: flex-end;
        .msg {
          margin: 10px 20px 0 0;
        }
        .msg::before {
          border-color: transparent transparent transparent #47b897;
          right: -16px;
        }
      }
      .msg-l {
        .msg {
          margin: 10px 0 0 20px;
        }
        .msg::before {
          border-color: transparent #47b897 transparent transparent;
          left: -16px;
        }
      }
    }
  }
  .input {
    border-top: 1px solid rgb(226, 225, 225);
    background-color: #fff;
    padding: 20px;
    display: flex;
    justify-content: flex-end;
    .el-button {
      background-color: #47b897;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
