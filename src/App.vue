<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
    	<div class="tab-item">
    	  <router-link to="/goods">goods</router-link>
    	</div>
    	<div class="tab-item">
        <router-link to="/ratings">ratings</router-link>
    	</div>
    	<div class="tab-item">
        <router-link to="/seller">seller</router-link>
    	</div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
	import header from './components/header/header.vue';
	const ERR_OK = 0;
	export default {
	  data() {
	    return {
	      seller: {}
	    };
	  },
	  created() {
	    this.$http.get('/api/seller').then(response => {
	      if (response.errno !== ERR_OK) {
	        this.seller = response.body.data;
	      }
	    });
	  },
	  components: {
	    'v-header': header
	  }
	};
</script>


<style lang="stylus" rel="stylesheet/stylus">
// @import 是stylus的特殊语法 可以引入如何路径下的styl
  @import "./common/stylus/mixin.styl";

// 使用伪类after来实现边线1像素；直接使用border-bottom在手机上看是比较粗的，因为如ipone6的dpi是2，所以线条为2像素
// &表示他的父元素 即.tab-item；> 为后排选择器
// 不需考虑代码的兼容写法，vue-loader>node_modules>postcss会解决代码的兼容问题（自动添加兼容代码）
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
