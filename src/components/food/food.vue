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
          <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Vue from 'vue';
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
</style>