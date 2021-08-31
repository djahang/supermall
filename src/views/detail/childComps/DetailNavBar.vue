<template>
  <div id="detailnavbar">
    <nav-bar>
      <div slot="left" class="back" @click="detailBack">
        <img src="~assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="titile">
        <div class="title-item"
             v-for="(item,index) in titles"
             :class="{active: index === currentIndex}" @click="itemClick(index)">
          {{item}}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>

import NavBar from "components/common/navbar/NavBar";
export default {
  name: "DetailNavBar",
  data(){
    return {
      titles:['商品','参数','评论','推荐'],
      currentIndex:0
    }
  },
  components:{
    NavBar
  },
  methods:{
    itemClick(index){
      this.currentIndex = index
      this.$emit('titleClick',index)
    },
    detailBack(){
      // this.$router.push('/home').catch(()=>{})
      // this.$router.go(-1)  使用back 和go（-1） 都可以
        this.$router.back()
    }
  }
}
</script>

<style scoped>
.titile {
  display: flex;
  font-size: 13px;
}
.back img{
margin-top: 12px;
}

.title-item{
  flex: 1;
}

.active{
  color: red;
}

</style>
