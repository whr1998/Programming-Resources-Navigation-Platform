<template>
  <div>
    <el-container>
      <el-header>
        <el-select
          @change="wishByOption(value)"
          style="width: 120px"
          v-model="value"
          placeholder="资源状态"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-header>
      <el-container v-if="wishs.length ? true : false" class="recordContainer">
        <div v-for="(list, i) in wishs" :key="i" class="card">
          <router-link
            tag="a"
            target="_blank"
            :to="{ path: '/cardDetail', query: { rid: list._id } }"
            style="text-decoration: none"
          >
            <div class="info">
              <div class="img">
                <img
                  :src="'http://localhost:3000/images/' + list.toux"
                  alt=""
                />
              </div>
              <div class="detail">
                <p>{{ list.username }} 的心愿</p>
                <p>{{ list.content }}</p>
              </div>
            </div>
            <div class="tag">
              <el-tag
                v-for="(tag, i) in list.tag_list"
                :key="i"
                :type="tag.type"
                size="small"
                >{{ tag.tag }}</el-tag
              >
            </div>
            <div
              style="
                color: rgb(100, 100, 100);
                font-size: 12px;
                float: right;
                margin: 10px 20px 0 0;
              "
            >
              发布时间：{{ list.publishDate }}
            </div>
          </router-link>
        </div>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            background
            layout="total, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </el-container>
      <div class="emptycontainer">
        <el-empty
          v-if="wishs.length ? false : true"
          :description="
            '您还没有' +
            [
              value == 'audit'
                ? '审核中的'
                : false || value == 'publish'
                ? '已发布的'
                : false || value == 'reject'
                ? '被拒绝的'
                : '发布',
            ] +
            '心愿哦'
          "
        >
          <router-link to="/community/wish">
            <el-button
              style="height: 40px; background-color: #47b897; color: white"
              icon="el-icon-s-promotion"
              >来发布心愿吧！</el-button
            >
          </router-link>
        </el-empty>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "audit",
          label: "审核中",
        },
        {
          value: "publish",
          label: "已发布",
        },
        {
          value: "reject",
          label: "已拒绝",
        },
      ],
      value: "",
      wishs: [],
      currentPage: 1, // 当前页
      total: 0, // 数据总条数
      pageSize: 4, // 每页条数
    };
  },
  methods: {
    wishByOption(value) {
      this.value = value;
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      this.$http
        .get("wish/getWish", {
          params: {
            pageSize,
            currentPage,
            radioName: value,
            userid: this.$store.state.USERID,
          },
        })
        .then((res) => {
          let { total, data } = res.data;
          this.wishs = data;
          this.total = total;
          if (!data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.wishByOption(value);
          }
          data ? (this.wishs = data) : (this.wishs = []);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 每页显示条数改变 就会触发这个函数
    handleSizeChange(val) {
      // // 保存每页显示的条数
      this.pageSize = val;
      // // 调用分页函数
      this.wishByOption(this.value);
    },
    // 当前页码改变 就会触发这个函数
    handleCurrentChange(val) {
      // // 保存当前页码
      this.currentPage = val;
      // // 调用分页函数
      this.wishByOption(this.value);
    },
  },
  created() {
    this.wishByOption("publish");
  },
};
</script>

<style lang="scss" scoped>
.el-container {
  min-height: 600px;
  background-color: #fff;

  .emptycontainer {
    margin: auto;
  }
  .el-input__inner:active {
    border: 1px solid red;
  }
  .recordContainer {
    display: flex;
    flex-wrap: wrap;
    .card {
      width: 46.5%;
      height: 200px;
      background-color: white;
      margin: 20px 20px 20px 20px;
      border: 1px solid rgb(236, 235, 235);

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
            object-fit: cover;
            border-radius: 50px;
          }
        }
        .detail {
          width: calc(100% - 120px);
          height: 100%;
          p {
            padding: 0;
            margin: 0;
          }
          p:first-child {
            font-weight: bold;
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
    }
  }
  .card:hover {
    box-shadow: 0 1px 6px rgba(44, 44, 44, 0.2);
    border-color: #eee;
    transition: all 0.2s ease-in-out;
  }
}
</style>