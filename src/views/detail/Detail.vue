<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="navbar"/>
    <scroll class="content" :probe-type="3" ref="scroll" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="goodsparams"/>
      <detail-comment-info ref="comment" :comment-info="commenInfo"/>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>

    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>

    <back-top @click.native="bactopClick" v-show="isBackTopShow"/>


  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "views/detail/childComps/DetailShopInfo";
import DetailGoodsInfo  from "views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";
import {itemListenerMixin,backTopMixin} from "common/mixin";

import BackTop from "components/content/backTop/BackTop";
import {debounce} from "common/utils";
import GoodsList from "components/content/goods/GoodsList"
// import GoodsListItem from "components/content/GoodsListItem"

import Scroll from "components/common/scroll/Scroll";

import {getDetail,getRecommend,Goods,Shop,GoodsParam} from "network/detail";

export default {
  name: "Detail",
  data(){
    return {
      iid:null,
      topImages:[],
      goods:{},
      shop:{},
      detailInfo:{},
      goodsparams:{},
      commenInfo:{},
      recommends:[],
      themeTopYs:[],
      getThemeTopY:null,
      currentIndex:0,
    }
  },
  mixins:[
    itemListenerMixin,
    backTopMixin
  ],
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    // GoodsListItem
  },
  destroyed() {
    this.$bus.$off('itemimgload',this.itemImgListener)
  },
  created(){
    //1，保存传入的iid
    // console.log(this.$route.query.iid);
     this.iid = this.$route.query.iid

    //2，根据iid请求详情数据
    getDetail(this.iid).then(res =>{
      console.log(res);
      // 1,获取顶部的轮播图数据
      const data = res.result
      this.topImages = data.itemInfo.topImages

      //2，使用构造函数，将网络请求的数据，整合到一个对象，传进去的数据顺序不能乱！
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

      //获取商家信息
      this.shop = new Shop(data.shopInfo)

      //获取商品参数，衣服尺码等数据
       this.goodsparams = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      //获取商品评论信息
      console.log(data);
      if (data.rate.cRate !==0){
        this.commenInfo = data.rate.list[0]
      }

      this.detailInfo = data.detailInfo

      //$nextTick 将回调延迟到下次 DOM 更新循环之后执行
      //根据最新的数据，对应的DOM已经被渲染出来，但是图片依然没有加载完(不包含图片)
      // offsetTop值不对的时候，都是因为图片的问题
      // this.$nextTick(()=>{
      //   this.themeTopYs = []
      //
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      //   console.log(this.themeTopYs);
      // })

      //给getThemeTopY赋值,使用防抖，然后在图片加载的地方直接调用函数
      this.getThemeTopY = debounce(()=>{
        //通过push到themeTopYs数组
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE);     //给最后一个值，push一个最大值

        // console.log(this.themeTopYs);
      },100)
    })

    //3,根据新的网址，网络请求，获取详情的推荐数据，在这里对goodslistitem组件进行复用
    getRecommend().then(res=>{
      // console.log(res);
      this.recommends =res.data.list
    })
  },

  methods:{
    imageLoad(){
      this.$refs.scroll.refresh()

      //根据图片加载，来计算参数，评论，推荐，等scroll的高度（防抖）
      this.getThemeTopY()
    },
    titleClick(index){
      // console.log(index);
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
    },
    //滚动函数
    contentScroll(position){
      //获取y值
      const positionY = -position.y

      //2,把y值和组件高度进行对比 [0, 2877, 3729, 4019]，
      // 获取数组的位数
      let lenth = this.themeTopYs.length

      //因为第二种做法，在数组最后加了个最大值，用不上的，所以lenth-1，不对最大值做判断！！
      for (let i= 0;i<lenth-1;i++){
        // if (this.currentIndex != i && ((i < lenth -1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])||(i === lenth - 1 && positionY >= this.themeTopYs[i]))){
        //   this.currentIndex  = i
        //
        //   this.$refs.navbar.currentIndex = this.currentIndex
        // }

        if(this.currentIndex != i && (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
          this.currentIndex = i
          this.$refs.navbar.currentIndex = this.currentIndex
        }
      }

      //显示是否回到顶部
      this.listenShouBackTop(position)
    },
    //加入购物车
    addToCart(){
      //1,获取购物车需要展示的信息
      const product = {}
      product.iid = this.iid
      product.image = this.topImages[0]
      product.title = this.detailInfo.title
      product.desc = this.goods.desc
      product.price = this.detailInfo.realPrice

      //2,将商品加入到购物车里面
      // this.$store.carList.push(product)
      this.$store.commit('addCart',product)
    }
  }
}
</script>

<style scoped>
#detail{
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content{
  height: calc(100% - 93px);
}
</style>
