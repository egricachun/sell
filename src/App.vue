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
// @import ÊÇstylusµÄÌØÊâÓï·¨ ¿ÉÒÔÒýÈëÈçºÎÂ·¾¶ÏÂµÄstyl
  @import "./common/stylus/mixin.styl";

// Ê¹ÓÃÎ±ÀàafterÀ´ÊµÏÖ±ßÏß1ÏñËØ£»Ö±½ÓÊ¹ÓÃborder-bottomÔÚÊÖ»úÉÏ¿´ÊÇ±È½Ï´ÖµÄ£¬ÒòÎªÈçipone6µÄdpiÊÇ2£¬ËùÒÔÏßÌõÎª2ÏñËØ
// &±íÊ¾ËûµÄ¸¸ÔªËØ ¼´.tab-item£»> ÎªºóÅÅÑ¡ÔñÆ÷
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
