<template>
  <div class="container">
    <div class="title">
      <img :src="'http://localhost:3000/images/' + 'baidu.png'" alt="" />
    </div>
    <div>
      <form action="http://www.baidu.com/s" method="get" target="_blank">
        <div class="search">
          <input
            class="input"
            type="text"
            name="wd"
            autocomplete="new-password"
          />
          <el-button
            class="btn"
            icon="el-icon-search"
            native-type="submit"
            value="Search"
          />
        </div>
      </form>
    </div>
    <div class="weblist">
      <div class="icon" v-for="homePage in homePages" :key="homePage">
        <a :href="homePage.url" target="_blank">
          <img
            :src="'http://localhost:3000/images/' + homePage.imgName"
            alt=""
          />
        </a>
        <p>{{ homePage.website }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      dialogVisible: false,
      homePages: {},
    };
  },
  methods: {
    getHomePageIcon() {
      this.$http
        .get("common")
        .then((res) => {
          let data = res.data;
          this.homePages = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getHomePageIcon();
    this.$nextTick(() => {
      document.oncontextmenu = new Function("event.returnValue=false");
      document.onselectstart = new Function("event.returnValue=false");
      document.onkeydown = document.onkeyup = document.onkeypress = function (
        event
      ) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 123) {
          e.returnValue = false;
          return false;
        }
      };
    });
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  background: url(.././assets/HomePage/darksky.jpg) no-repeat;
  background-size: 100% 100vh;
  text-align: center;
  .title {
    height: 125px;
    img {
      margin-top: 20px;
      width: 13.5%;
    }
  }
  .search {
    display: flex;
    justify-content: center;
    .input,
    .btn {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      height: 40px;
      background-color: transparent;
      border: 1px solid white;
      color: white;
      font-size: 16px;
      outline: none;
    }
    .btn:hover {
      color: rgb(23, 188, 243);
    }
    .input {
      width: 35%;
      padding-left: 10px;
      border-radius: 5px 0px 0px 5px;
      border-right: none;
    }
    .btn {
      width: 5%;
      border-radius: 0px 5px 5px 0px;
    }
    .input:hover {
      border-left: 1px solid rgb(23, 188, 243);
      border-top: 1px solid rgb(23, 188, 243);
      border-bottom: 1px solid rgb(23, 188, 243);
    }
    .btn:hover {
      border: 1px solid rgb(23, 188, 243);
    }
  }
  .weblist {
    width: 50%;
    height: 60%;
    background-color: rgba($color: #000000, $alpha: 0.4);
    margin: 50px auto;
    display: flex;
    flex-wrap: wrap;
    .icon {
      width: 25%;
      padding-top: 29px;
      a {
        img {
          width: 35px;
          border-radius: 5px;
          cursor: pointer;
        }
      }
      p {
        margin-top: 10px;
        padding: 0;
        font-size: 14px;
        color: rgb(231, 231, 231);
        cursor: pointer;
      }
    }
  }
}
</style>
