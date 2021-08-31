<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 class="tab-control"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 :class="{fixed:isTabFiexd}" v-show="isTabFiexd"></tab-control>
<!--    在scroll内定义了传参probeType(监听滚动类型) 和 发射事件scroll(返回参数)-->
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingup="pullingupload">
      <home-swiper :banner="banner" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommend="recommend"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']"
                   class="tab-control"
                   @tabClick="tabClick"
                   ref="tabControl2"
                    :class="{fixed:isTabFiexd}"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="bactopClick" v-show="isBackTopShow"/>
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from "./childComps/RecommendView";
import FeatureView from './childComps/FeatureView'
//公共组件
import NavBar from "components/common/navbar/NavBar";
import Scroll from "components/common/scroll/Scroll";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/content/backTop/BackTop";
import {itemListenerMixin,backTopMixin} from "common/mixin";
//网路请求函数
import {getHomeMultidata,getHomeGoods} from 'network/home'

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
    },
    mixins:[
      itemListenerMixin,
      backTopMixin
    ],
    data(){
      return {
        banner:[],
        recommend:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]},
        },
        currentType:'pop',
        tabOffsetTop :0,
        isTabFiexd:false,
        saveY:0,
      }
    },
    created(){    //函数调用结束，会释放所有变量，所以必须将数据保存到data种
      //1，请求多个数据, request和home之间，有一层js，专门负责这个页面的网络请求
      this.getHomeMultidata()

      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      //使用事件总线，监听GoodsListItem的图片加载，来计算content高度
      // this.$bus.$on('itemimgload',()=>{
      //   console.log('事件总线');
      //   this.$refs.scroll.scroll.refresh()
      // })

      //2,获取tabControl组件的offsetTop
      // 所有组件都有一个元素$el,用于获取组件元素
      // console.log(this.$refs.tabControl);
      // console.log(this.$refs.tabControl.$el);
      // console.log(this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop);
    },
    computed:{
      showGoods(){
        return  this.goods[this.currentType].list
      }
    },
    activated() {
      // 将scroll定位到离开之前的Y坐标
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      //重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
      this.$refs.scroll.refresh()   //重新计算scroll
    },
    deactivated() {
      //1,获取离开时候 scroll 的Y坐标
      this.saveY = this.$refs.scroll.getScrollY()
      // console.log(this.saveY);

      //2,在离开页面的时候，取消全局事件的监听
      this.$bus.$off('itemimgload',this.itemImgListener)
    },
    methods:{
      /**
       * 事件监听相关方法
       */
      tabClick(index){
        // this.currentType = Object.keys(this.goods)[index]
        switch (index){
          case 0:
            this.currentType='pop'
            break
          case 1:
            this.currentType='new'
            break
          case 2:
            this.currentType='sell'
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      contentScroll(position){
        //1, 判断BackTop是否显示
        this.listenShouBackTop(position)

        //2,判断tabControl是否吸顶（position:fiexd）
        this.isTabFiexd = (-position.y) > this.tabOffsetTop
      },
      pullingupload(){
        console.log('上拉加载更多');
        this.getHomeGoods(this.currentType)

        this.$refs.scroll.refresh()
      },
      swiperImageLoad(){
        //监听轮播图加载完成之后，计算tabcontrol的高度
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
      /**
       * 网络请求相关方法
       */
      getHomeMultidata(){
        getHomeMultidata().then(res =>{
          this.banner = res.data.banner.list
          // console.log(this.recommend);
          this.recommend= res.data.recommend.list
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page+1
        getHomeGoods(type,page).then((res)=>{
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page +=1

          //上拉加载更多，调用finishPullUp函数
          this.$refs.scroll.finishPullUp()

        }).catch((err)=>{
          console.log(err);
        })
      },
    }
  }
</script>

<style scoped>
/*#home {*/
/*  !*padding-top: 44px;*!*/
/*  height: 100vh;*/
/*}*/
#home {
  /*padding-top: 44px;*/
  height: 100vh;

  /*相对定位*/
  position: relative;
}
/*.content{*/
/*  height: calc(100% - 93px);*/
/*  overflow: hidden;*/
/*  margin-top: 44px;*/
/*}*/
.content{
  overflow: hidden;

  /*绝对定位*/
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.tab-control {
  position: relative;
  /*top: 43px;*/
  background-color: #fff;
  /*在最顶上*/
  z-index: 9;
}

.home-nav {
  background-color: var(--color-tint);
  color: #f6f6f6;

  /*在使用浏览器原生滚动时，为了让导航不更随一起滚动*/
  /*position:fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 9;*/
  /*position:sticky;top:0;*/
}

</style>
