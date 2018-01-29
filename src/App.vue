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
    <!-- keep-alive  router切换，组件状态保留。实现原理：加载过的组件会把它的状态保存在内存中，切换时，如何组件加载过且保留在内存中，就从内存中把组件状态恢复-->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
	import {urlParse} from '@common/js/util.js';
	import header from '@components/header/header.vue';
	const ERR_OK = 0;
	export default {
	  data() {
	    return {
	      seller: {
	        // 获得id给seller，把那个在路由中带上,表示进入的是哪间店铺
	        id: (() => {
	          let queryParam = urlParse();
	          console.log(queryParam);
	          return queryParam.id;
	        })()
	      }
	    };
	  },
	  created() {
	    this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
	      if (response.body.errno === ERR_OK) {
	        // 直接赋值seller的id会配除掉,可用Object.assign（es6的语法）进行赋值，这样可以扩展属性
	        // 最后获得的数据，相当于在有id（this.seller)的基础上添加了其他属性（response.data）
	        this.seller = Object.assign({}, this.seller, response.body.data);
	        console.log(this.seller.id);
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
  @import "./common/stylus/mixin.styl"

// 使用伪类after来实现边线1像素；直接使用border-bottom在手机上看是比较粗的，因为如ipone6的dpi是2，所以线条为2像素
// &表示他的父元素 即.tab-item；> 为后排选择器
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
