<template>
  <div class="ratingselect">
  	<div class="rating-type border-1px">
  		<span class="block positive" :class="{'active': selectType === 2}">{{desc.all}}<span class="count">22</span></span>
  		<span class="block positive" :class="{'active': selectType === 0}">{{desc.positive}}<span class="count">25</span></span>
  		<span class="block negative" :class="{'active': selectType === 1}">{{desc.negative}}<span class="count">32</span></span>
  	</div>
  	<div class="switch">
  	  <i></i>
  		<span class="text">只看有内容的评价</span>
  	</div>
  </div>
</template>
<script type="text/ecmascript-6">
  // const POSITIVE = 0;
  // const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      // 评价信息
      rating: {
        type: Array,
        default() {
          return [];
        }
      },
      // 选择的类型
      selectType: {
        type: Number,
        default: ALL
      },
      // 是否只看看有内容的
      onlyContent: {
        type: Boolean,
        default: false
      },
      // 类型的文字描述
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        border-radius: 1px
        font-size: 12px
        color: rgb(77, 85, 93)
        &.active
          color: #fff
        .count
          margin-left: 2px
          line-height: 16px
          font-size: 8px
        &.positive
          background-color: rgba(0, 160, 220, 0.2)
          &.active
            background-color: rgb(0, 160, 220)
        &.negative
          background-color: rgba(77, 85, 93, 0.2)
          &.active
            background-color: rgb(77, 85, 93)
</style>