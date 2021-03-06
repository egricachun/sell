<template>
  <div class="goods">
  <!-- vue获取dom对象用ref，名字要用中划线链接，不可用驼峰  -->
    <!-- 左侧菜单栏 -->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
      <li v-for="(item, index) in goods" class="menu-item" :class="{'current': currentIndex === index}" @click="selectMenu(index,$event)">
        <span class="text border-1px">
          <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
        </span>
      </li>
      </ul>
    </div>
    <!-- 右侧商品 -->
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
      <!-- 书写习惯，当需要一个class专用于被js选择时，在最后加上hook -->
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food, $event)">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" />
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @cartAdd="_drop" :food = "food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 底部购物车 抛物小球 -->
    <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    <!-- 商品详情 -->
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  // 引入滚动库
  import BScroll from 'better-scroll';
  import shopcart from '@components/shopcart/shopcart';
  import cartcontrol from '@components/cartcontrol/cartcontrol';
  import food from '@components/food/food';
  const ERR_OK = 0;
  export default {
    props: {
      // 商家信息
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [], // 商品信息
        listHeight: [], // 存储每个分类距该容器的高度
        scrollY: 0, // 商品列表距该列表的长度
        selectedFood: {} // 点击查看详情的商品
      };
    },
    computed: {
      // 左侧索引应在的位置,当scrollY发生变化，currentIndex也会实时发生变化
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      // 选择商品进购物车
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    // 请求json.data数据
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => {
            // 想要计算跟dom相关的东西 要确保dom已经完全渲染，而dom真正发生变化 是在$nextTick函数后，所以操作dom要在该接口中执行
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
    },
    methods: {
      // 初始化滚动
      _initScroll() {
        // 这里要用驼峰写法
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          // better-scroll实现原理是坚挺了touch等事件，同时阻止了默认事件，click:true表示允许click事件
          click: true
        });
        // probeType:3表示scroll滚动时，能事实返回滚动的位置
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3,
          click: true
        });
        // 监听scroll事件
        this.foodsScroll.on('scroll', (pos) => {
          // 返回事实位置，Math.round转化为整数;abs转化为正值
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      // 计算每一分类商品距该容器的高度，放在listHeight数组中
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      // 点击左侧菜单栏
      selectMenu(index, event) { // event用于解决better-scroll在pc模式下无阻止默认事件，同时为元素加上@click事件导致的：click执行了两次的问题
        if (!event._constructed) {
          // 自己开发的click，_constructex为true;浏览器原生（默认）的点击事件无该属性
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300); // 滚动到指定元素，滚动时间
      },
      // 选择商品打开详情
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      },
      // cartcontrol选择商品子组件触发的事件
      _drop(target) {
        // this.$refs.shopcart(这个shopcart是ref="shopcart")可访问到shopcart(这个是shopcart)子组建
        this.$refs.shopcart.drop(target);
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  // class的性能比标签好，速度比标签快
  @import "../../common/stylus/mixin.styl"
	.goods
		display: flex
		position: absolute
		top: 174px
		bottom: 46px
		width: 100%
		overflow: hidden
		.menu-wrapper
			flex: 0 0 80px // 等分 缩放情况 占位空间
			width: 80px
			background-color: #f3f5f7
			.menu-item
				display: table
				height: 54px
				width: 56px
				padding: 0 12px
				line-height: 14px
				&.current
					position: relative
					z-index: 10
					margin-top: -1px
					background-color: #fff
					font-weight: 700
					.text
						border-none()
				.text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
          .icon
          	display: inline-block
          	vertical-align: top
          	width: 12px
          	height: 12px
          	margin-right: 2px
          	background-size: 12px 12px
          	background-repeat: no-repeat
          	&.decrease //加有& 和icon同级
          		bg-image('decrease_3')
          	&.discount
          		bg-image('discount_3')
          	&.special
          		bg-image('special_3')
          	&.invoice
          		bg-image('invoice_3')
          	&.guarantee
          		bg-image('guarantee_3')
		.foods-wrapper
			flex: 1
			.title
				padding-left: 14px
				height: 26px
				line-height: 26px
				border-left: 2px solid #d9dde1
				font-size: 12px
				color: rgb(147, 153, 159)
				background-color: #f3f5f7
			.food-item
				display: flex
				margin: 18px
				padding-bottom: 18px
				border-1px(rgba(7, 17, 27, 0.1))
				&:last-child
					border-none()
					margin-bottom: 0
				.icon
					flex: 0 0 57px
					margin-right: 10px
				.content
					flex:1
					.name
						margin: 2px 0 8px 0
						height: 14px
						line-height: 14px
						font-size: 14px
						color: rgb(7, 17, 27)
					.desc, .extra
						line-height 10px
						font-size: 10px
						color: rgb(147, 153, 159)
					.desc
            line-height: 12px     
						margin-bottom: 8px
					.extra
						.count
							margin-right: 12px
					.price
						font-weight: 700
						line-height: 24px
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
						right: 0
						bottom: 12px						
</style>