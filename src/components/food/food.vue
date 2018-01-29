<!-- 样式、布局一致就可做成一个组件，哪怕是结构很简单 -->
<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <!-- 加入购物车增减控键 -->
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <!-- 加入购物车按钮 该属性不存在或者为0-->
          <transition name="fade">
            <div @click.stop.prevent="addFirst($event)" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <!-- 商品信息，有些商品有，有些无 -->
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <!-- 评价 -->
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <!-- 控件 -->
          <ratingselect @ratingtypeSelect="ratingtypeSelect_p" @contentToggle="contentToggle_p" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <!-- 评论列表 -->
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
            <!-- v-show可以绑定一个方法 -->
              <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar" />
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  // 不带大括号用的是export default定义模块 是默认的，且只能有一个，而{formatDate}要带大括号是因为date.js中用的是export定义模块，但可以export多个模块，所以要用{}指定是那个模块
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import {formatDate} from '@common/js/date'; // 引入转换日期格式方法
  import cartcontrol from '@components/cartcontrol/cartcontrol';
  import split from '@components/split/split';
  import ratingselect from '@components/ratingselect/ratingselect';

  // const POSITIVE = 0;
  // const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      // 所需查看详情的商品
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false, // 是否显示商品详情浮层
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      // 命名习惯：会被外部调用的方法不加下划线，组件自己私有的前面加下划线
      show() {
        this.showFlag = true;
        // 点击不同商品，显示详情时候，都初始化评价组件的值（评价类型、是否只看有内容的）
        this.selectType = ALL;
        this.onlyContent = true;
        // 初始结束
        // 添加滚动
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      // 隐藏商品详情浮层
      hide() {
        this.showFlag = false;
      },
      // 点击加入购物车按钮
      addFirst(event) { // event用于解决better-scroll在pc模式下无阻止默认事件，同时为元素加上@click事件导致的：click执行了两次的问题
        // 自己开发的click，_constructex为true;浏览器原生（默认）的点击事件无该属性
        if (!event._constructed) {
          return;
        }
        // this.$emit('cart.add', event.target);
        // 触发父组件事件（方法，数据），从而调用抛物小球
        this.$emit('cartAdd', event.target);
        // 上条代码运行后 ebent.target的display马上变成了none,抛物小球就获取不到位置了，解决方法是给该element的消失加上动画，这样element没有立刻修消失，就能获取到他的位置了
        Vue.set(this.food, 'count', 1); // food中原本没有count字段，可用Vue.set方法添加，但要引入vue
      },
      // 评论列表按照分类进行显示
      needShow(type, text) {
        // 是否只显示有内容的
        if (this.onlyContent && !text) {
          return false;
        }
        // 显示哪种类型
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      },
      // 监听子组件的事件，选择了那个评价类型
      ratingtypeSelect_p(value) {
        this.selectType = value;
        // 内容高度变了，要refresh设置BScroll，使高度重置
        // 使用$nextTick,上调语句只是更改了数据，vue的dom更新是异步的，放在一个更新队列中，要确保refresh在dom更新后运行，否则无效
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      // 监听子组件的事件，选择了那个评价类型
      contentToggle_p() {
        this.onlyContent = !this.onlyContent;
        // 内容高度变了，要refresh设置BScroll，使高度重置
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    filters: {
      // 使用过滤器把时间戳转化成时间
      formatDate(time) {
        let date = new Date(time); // 吧时间戳转化为date类型的对象
        return formatDate(date, 'yyyy-MM-dd hh:mm'); // 调用改方法转换日期格式 最好卸载通用js中
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .food
    position: fixed
    top: 0
    left: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background-color: #fff
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
      transition: all 0.2s linear
    &.move-enter, &.move-leave-to
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100% // 当吧padding-top或padding-bottom设为100%时，它是按width计算，即padding-top等于width
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700px
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price
        font-weight: 700
        line-height: 24px
        color: red
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom : 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 10px
        color: #fff
        background: rgb(0, 160, 220)
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.2s
        &.fade-enter, &.fade-leave-to
          opacity: 0
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
      .rating-wrapper
         padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              wertical-align: top
              margin-right: 6px
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>