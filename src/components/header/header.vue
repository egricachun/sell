<template>
<div class="header">
  <!-- 头部 -->
  <div class="content-wrapper">
    <div class="avatar">
      <img :src="seller.avatar" width="64" height="64" />
    </div>
    <div class="content">
      <div class="title">
        <span class="brand"></span>
        <span class="name" v-text="seller.name"></span>
      </div>
      <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
      <div class="support" v-if="seller.supports">
        <span class="icon" :class="classMap[seller.supports[0].type]"></span>
        <span class="text" v-text="seller.supports[0].description"></span>
      </div>
    </div>
    <div class="support-count" v-if="seller.supports" @click="showDetail">
      <span class="count">{{seller.supports.length}}个</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
  </div>
  <!-- 公告 -->
  <div class="bulletin-wrapper" @click="showDetail">
    <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
    <i class="icon-keyboard_arrow_right"></i>
  </div>
  <!-- 头部背景图片 -->
  <div class="background">
    <img :src="seller.avatar" width="100%" height="100%">
  </div>
  <!-- 商家详情 -->
  <transition name="fade">
    <div class="detail" v-show="detailShow">
      <!-- 使用Sticky footers布局（该方法稍复杂，但兼容性是最好的） -->
      <div class="detail-wrapper clearfix"><!-- 容器层 clearfix用于清楚浮动 -->
        <div class="detail-main"><!-- 内容 -->
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :size="48" :score="seller.score"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="support-item" v-for="(item, index) in seller.supports">
              <span class="icon" :class="classMap[index]"></span>
              <span class="text" v-text="item.description"></span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="hideDetail"><!-- 底部层 -->
        <i class="icon-close"></i>
      </div>
    </div>
  </transition>
</div>
</template>

<script type="text/ecmascript-6">
  import star from '@components/star/star';
  export default {
    props: {
      // 商家信息
      seller: {
        type: Object
      }
    },
    data() {
      return {
        detailShow: false // 是否显示商家详情
      };
    },
    methods: {
      // 显示商家详情
      showDetail() {
        this.detailShow = true;
      },
      // 隐藏商家详情
      hideDetail() {
        this.detailShow = false;
      }
    },
    created() {
      // 优惠图标数组
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    components: {
      star
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
// 使用display：inline-block时 中间会有缝隙（空白字符），可在父元素中设置font-size:0
// css中只能写相对路径，不能写@common
// font-size:0会影响省略号的显示
  @import "../../common/stylus/mixin"
  .header
    position: relative
    overflow: hidden
    color: #fff
    background-color: rgba(7, 17, 27, 0.5)
    .content-wrapper
      position: relative
      padding: 24px 12px 18px 24px
      font-size: 0
      .content
        display: inline-block
        margin-left: 16px
        .title
          margin: 2px 0 8px 0
          .brand
            display: inline-block
            vertical-align: middle
            width: 30px
            height: 18px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
            .name
              margin-left: 6px
              font-size: 16px
              line-height: 18px
              font-weight: bold
        .description
          margin-bottom: 10px
          line-height: 12px
          font-size: 12px
        .support
          .icon
            display: inline-block
            vertical-align: top
            width: 12px
            height: 12px
            margin-right: 4px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.special
              bg-image('special_1')
            &.invoice
              bg-image('invoice_1')
            &.guarantee
              bg-image('guarantee_1')
          .text
            line-height: 12px
            font-size: 10px
      .support-count
        position: absolute
        position: absolute
        right: 12px
        bottom: 14px
        padding: 0 8px
        height: 24px
        line-height: 24px
        border-radius: 14px
        background-color: rgba(0, 0, 0, 0.2)
        text-align: center
        .count
          vertical-align: top
          font-size: 10px
        .icon-keyboard_arrow_right
          margin-left: 2px
          font-size: 10px
          line-height: 24px
      .avatar
        display: inline-block
        vertical-align: top
        img
          border-radius: 2px
    .bulletin-wrapper
      position: relative
      height: 28px
      line-height: 28px
      padding: 0 22px 0 12px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      background: rgba(7, 17, 27, 0.2)
      .bulletin-title
        display: inline-block
        vertical-align: top
        margin-top: 8px
        width: 22px
        height: 12px
        bg-image('bulletin')
        background-size: 22px 12px
        background-repeat: no-repeat
      .bulletin-text
        vertical-align: top
        margin: 0 4px
        font-size: 10px
      .icon-keyboard_arrow_right
        position: absolute
        font-size: 10px
        right: 12px
        top: 8px
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      filter: blur(10px)// 产生模糊效果
    .detail
      position: fixed
      z-index: 100
      top: 0
      left: 0
      width: 100%
      height: 100%
      overflow: auto
      background-color: rgba(7, 17, 27, 0.8)
      opacity: 1
      backdrop-filter: blur(10px) // 背景模糊（只在iso上有用，安卓暂时无效）
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s
      &.fade-enter, &.fade-leave-active
        opacity: 0
        background-color: rgba(7, 17, 27, 0)  
      .detail-wrapper
        min-height: 100%
        width: 100%
        .detail-main
          margin-top: 64px
          padding-bottom: 64px
          .name
            line-height: 16px
            text-align: center
            font-size: 16px
            font-weight: 700
          .star-wrapper
            margin-top: 18px
            padding: 2px 0
            text-align: center
          .title
            display: flex
            width: 80%
            margin: 28px auto 24px auto
            .line
              flex: 1
              position:relative
              top: -6px
              border-bottom: 1px solid rgba(255, 255, 255, 0.2)
            .text
              padding: 0 12px
              font-weight: 700
              font-size: 14px
          .supports
            width: 80%
            margin: 0 auto
            .support-item
              padding: 0 12px
              margin-bottom: 12px
              font-size: 0.2
              &.last-child
                margin-bottom: 0
              .icon
                display: inline-block
                width: 16px
                height: 16px
                vertical-align: top
                margin-right: 6px
                background-size: 16px 16px
                background-repeat: no-repeat
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.special
                  bg-image('special_2')
                &.invoice
                  bg-image('invoice_2')
                &.guarantee
                  bg-image('guarantee_2')
              .text
                line-height: 16px
                font-size: 12px
          .bulletin
            width: 80%
            margin: 0 auto
            .content
              padding: 0 12px
              line-height: 24px
              font-size: 12px
      .detail-close
        position: relative
        width: 32px
        height: 32px
        margin: -64px auto 0 auto
        clear: both
        font-size: 32px
</style>