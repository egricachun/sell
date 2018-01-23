<template>
  <div class="cartcontrol">
    <transition name="move"> <!-- 两个过渡效果同时进行 -->
      <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart"> <!-- 平移 -->
        <span class="inner icon-remove_circle_outline"></span> <!-- 滚动 -->
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    created() {
      console.log(this.food);
    },
    methods: {
      // 增加商品
      addCart(event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1); // 新增、删除某个字段时，要用Vue.set方法，这样变化才能被检测到，从而才能使dom发生变化
        } else {
          this.food.count++;
        }
        this.$emit('cartAdd', event.target);
        // this.$emit('cart.add', event.target); // 触发父组件事件（方法，数据）
      },
      // 减少
      decreaseCart(even) {
        if (!even._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    // 两个过渡效果同时进行
    .cart-decrease
      display: inline-block
      padding: 6px // 增加点击区域而又不影响样式
      transform: translate3D(0, 0, 0)
      opacity: 1
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transform: rotate(0)
        transition: all 0.4s linear;
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      &.move-enter, &.move-leave-to
        opacity: 0
        transform: translate3D(24px, 0, 0) // translate3D可开启硬件加速，动画跟更流畅
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px // 增加点击区域而又不影响样式
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>