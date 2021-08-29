<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"/>
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="goodsparams"/>
      <detail-comment-info :comment-info="commonInfo"/>
    </scroll>
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

import Scroll from "components/common/scroll/Scroll";

import {getDetail,Goods,Shop,GoodsParam} from "network/detail";

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
      commonInfo:{}
    }
  },
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    Scroll,
  },
  created(){
    //1，保存传入的iid
    console.log(this.$route.query.iid);
     this.iid = this.$route.query.iid

    //2，根据iid请求详情数据
    getDetail(this.iid).then(res =>{
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
        this.commonInfo = data.rate.list[0]
      }

      this.detailInfo = data.detailInfo
    })
  },
  methods:{
    imageLoad(){
      this.$refs.scroll.refresh()
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
  height: calc(100% - 44px);
}
</style>
