<template>
  <div>
    <el-empty
      style="background-color: #fff; margin: 20px 0"
      v-if="lists.length ? false : true"
      description="暂无相关资源"
    ></el-empty>
    <div class="cardlist" v-if="lists.length ? true : false">
      <div
        v-for="(list, i) in lists"
        :key="i"
        class="card"
        :style="myCardWidth"
      >
        <router-link
          tag="a"
          target="_blank"
          :to="{ path: '/cardDetail', query: { rid: list._id } }"
          style="text-decoration: none"
        >
          <div class="info">
            <div class="img">
              <img :src="'http://localhost:3000/images/' + list.icon" alt="" />
            </div>
            <div class="detail">
              <p>{{ list.name }}</p>
              <p>{{ list.intro }}</p>
            </div>
          </div>
          <div class="tag">
            <el-tag
              v-for="(tag, i) in list.tag_list"
              :key="i"
              :type="tag.tag == '精选' ? 'success' : 'info' || 'info'"
              size="small"
              >{{ tag.tag }}</el-tag
            >
          </div>
        </router-link>
        <div class="share">
          <div>
            <el-tooltip
              class="item"
              effect="dark"
              content="分享"
              placement="top"
            >
              <i class="el-icon-share"></i>
            </el-tooltip>
          </div>

          <div>
            <a :href="list.link" target="_blank"
              ><el-tooltip
                class="item"
                effect="dark"
                content="访问"
                placement="top"
              >
                <i class="el-icon-s-promotion"></i> </el-tooltip
            ></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["lists"],
  data() {
    return {
      screenWidth: "",
      myCardWidth: {
        width: "32%",
      },
    };
  },
  methods: {
    changeWidth(clientWidth) {
      if (clientWidth >= 1240) {
        this.myCardWidth.width = "32%";
      } else if (clientWidth >= 900 && clientWidth < 1240) {
        this.myCardWidth.width = "49%";
      } else {
        this.myCardWidth.width = "98%";
      }
    },
  },
  mounted() {
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth;
      this.changeWidth(this.screenWidth);
    };
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: #47b897;
}
.cardlist {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  margin-top: 15px;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 3px;
  .card {
    height: 250px;
    background-color: white;
    margin-bottom: 15px;
    border: 1px solid rgba(71, 184, 151, 0.2);
    cursor: pointer;
    .info {
      height: 60%;
      display: flex;
      .img {
        width: 120px;
        height: 100%;
        text-align: center;
        img {
          width: 80px;
          height: 80px;
          margin-top: 20px;
        }
      }
      .detail {
        width: calc(100% - 120px);
        height: 100%;
        p {
          padding: 0;
          margin: 0;
          margin-right: 20px;
        }
        p:first-child {
          font-size: 18px;
          margin-top: 20px;
          color: rgb(61, 61, 61);
        }
        p:last-child {
          color: #999999;
          font-size: 14px;
          margin-top: 10px;
        }
      }
    }
    .tag {
      height: 20%;
      display: flex;
      justify-content: flex-end;
      .el-tag {
        margin-left: 10px;
      }
      .el-tag:first-child {
        margin-left: 10px;
      }
      .el-tag:last-child {
        margin-right: 20px;
      }
    }
    .share {
      height: 20%;
      display: flex;
      line-height: 50px;
      justify-content: space-between;
      padding: 0 20px 0 20px;
      border-top: 1px solid #eeeeee;
      font-size: 16px;
      color: #62be9d;
      span {
        font-size: 16px;
        margin-left: 2px;
      }
    }
  }
  .card:hover {
    box-shadow: 0 1px 6px rgba(44, 44, 44, 0.2);
    border-color: #eee;
    transition: all 0.2s ease-in-out;
    .detail {
      p:first-child {
        color: #47b897;
      }
    }
  }
}
</style>