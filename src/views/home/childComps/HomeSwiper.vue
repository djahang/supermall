<template>
 <div>
   <swiper>
     <swiper-item v-for="item in banner">
       <a :href="item.link">
         <img :src="item.image" alt="" @load="imageLoad">
       </a>
     </swiper-item>
   </swiper>
 </div>
</template>

<script>
import { Swiper, SwiperItem} from 'components/common/swiper'
export default {
  name: "HomeSwiper",
  data(){
   return {
     isload:false
   }
  },
  props:{
    banner:{
      type:Array,
      default(){
        return []
      }
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  methods:{
    imageLoad(){
      if (!this.isload){
        //监听轮播图加载完成之后，发射一次事件，isload的作用就是只发射一次，
        this.$emit('swiperImageLoad')
        this.isload =true
      }
    }
  }
}
</script>

<style scoped>

</style>
