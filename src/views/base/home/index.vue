<template>
  <!-- 走马灯 -->
  <div>
    <div class="carousel">
      <el-carousel
        :interval="4000"
        arrow="always"
        type="card"
        height="400px"
      >
        <el-carousel-item
          v-for="item in recommendCarouselList"
          :key="item.id"
        >
          <img
            v-if="item.imgUrl !== ''"
            style="width: 100%; height: 100%;"
            :src="item.imgUrl"
            @click="EnterToForum(item.id)"
          >
          <img
            v-else
            src="../../../assets/images/404.jpg"
            style="width: 100%; height: 100%;"
            @click="EnterToForum(item.id)"
          >
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 推荐社团 -->
    <div class="recommend">
      <el-row>
        <el-col>
          <el-divider />
          <h3 style="text-align: center;">推荐社团</h3>
          <el-divider />
          <div
            v-for="(item, i) in recommendedList"
            :key="i"
            class="card"
          >
            <div class="image">
              <img :src="item.avatarUrl">
            </div>
            <div class="content">
              <div class="title">{{ item.name }}</div>
              <div class="sub-title">社长：{{ item.chiefName }}</div>
              <div class="bottom">
                <button @click="LookForDetail(item.id,item.name,item.chiefName,item.avatarUrl)">查看详情</button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { recommended } from '@/api/club'
import { getRecommendActivities } from '@/api/forum'
import clubImg1 from '@/assets/images/club1.jpg'
import clubImg2 from '@/assets/images/club2.jpeg'
import clubImg3 from '@/assets/images/club3.jpeg'
import { getInfo } from '@/api/user'
export default {
  data() {
    return {
      // 获取推荐列表参数
      queryInfo: {
        page: 1,
        limit: 6,
        sort: 'update_at',
        order: 'desc'
      },
      // 走马灯图片列表
      carouselImgList: [clubImg1, clubImg2, clubImg3],
      recommendNum: {
        number: 3
      },
      recommendCarouselList: [],
      // 公告列表
      recommendedList: [],
      clubDetail: {}
    }
  },
  created() {
    this.getInfo()
    this.getRecommendedList()
    this.getRecommendActivities()
  },
  methods: {
    // 获取推荐列表
    getRecommendedList() {
      recommended(this.queryInfo).then(response => {
        this.recommendedList = response.data.items
      })
    },

    // 获取推荐活动走马灯图片
    getRecommendActivities() {
      getRecommendActivities(this.recommendNum).then(response => {
        if (response.status === 200) {
          this.recommendCarouselList = response.data
        } else {
          return this.$message.error('获取走马灯失败')
        }
      })
    },

    // 跳转到主页
    pushToHomePage() {
      this.$store.dispatch('user/changeRoles', 'student')
    },

    // 获取用户信息
    getInfo() {
      getInfo().then(response => {
        if (response.data.roles[0] === 'student') {
          this.pushToHomePage()
        } else if (response.data.roles[0] === 'admin') {
          this.$router.push({ path: 'adminHome' })
        }
        // console.log(response.data.roles[0])
      })
    },

    // 跳转到社团信息详细页面
    LookForDetail(id, name, chiefName, avatarUrl) {
      this.$router.push({
        path: '/clubDetail',
        query: {
          id: id,
          name: name,
          chiefName: chiefName,
          avatarUrl: avatarUrl
        }
      })
    },
    EnterToForum(id) {
      this.$router.push({ path: '/forum/activityDetail', query: { id: id }})
    }
  }
}
</script>

<style lang="scss" scoped>
.carousel {
  margin: 0px auto;
  padding: 10px;
  width: 90%;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 400px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-link {
  float: right;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}
html,
body {
  height: 100%;
}
body {
  /* display: grid; */
  place-items: center;
  background: #f2f2f2;
}
.cards {
  display: inline;
  margin: 0 auto;
}
.card {
  margin: 0px;
  padding: 5px;
  float: left;
  position: relative;
  height: 340px;
  width: 33%;
  background: white;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.15);
  transition: 0.4s linear;
}
.card:hover {
  box-shadow: 0px 1px 35px 0px rgba(0, 0, 0, 0.3);
}
.card .image {
  background: black;
  height: 85%;
  overflow: hidden;
}
.image img {
  height: 100%;
  width: 100%;
  transform: 0.3s;
}
.card:hover .image img {
  opacity: 0.6;
  transform: scale(1.1);
}
.card .content {
  position: absolute;
  bottom: 0px;
  background-color: white;
  width: 100%;
  text-align: center;
  padding: 20px 30px;
}
.content .title {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
}
.content .sub-title {
  font-size: 18px;
  font-weight: 500;
  color: #909399;
  margin-bottom: 10px;
}
.bottom span {
  color: #666666;
  word-break: break-all;
  font-size: 16px;
  text-align: justify;
  line-height: 1.8em;
}
.bottom button {
  float: left;
  padding: 7px 15px;
  font-size: 17px;
  background: #409eff;
  color: white;
  font-weight: 500;
  border: none;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.3s ease;
}
.bottom button:hover {
  transform: scale(0.9);
  background: #409eff;
}
.recommend {
  width: 90%;
  margin: 0 auto;
}
</style>
