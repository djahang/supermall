<template>
<div class="goods-item"  @click="itemclick">
  <img :src="showImage" alt="" @load="imgload">
  <div class="goods-info">
    <p>{{goodsItem.title}}</p>
    <span class="price">{{goodsItem.price}}</span>
    <span class="collect">{{goodsItem.cfav}}</span>
  </div>
</div>
</template>

<script>
export default {
  name: "GoodsListItem",
  data(){
    return {
      iid: this.goodsItem.iid
    }
  },
  props:{
    goodsItem:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  computed: {
    showImage() {
      // 因为 || 是懒运算  如果左边为true就不管右边了  但是换位置 左边的因为没有show就会报错
      return  this.goodsItem.image || this.goodsItem.show.img
      // 再点击事件中加给判断，if( this.$route.path.indexOf(detail) !==-1){}
      //   这样才进行路由跳转，else { return false}
    }
  },
  methods:{
    //监听图片加载事件，来重新计算content高度
    imgload(){
      this.$bus.$emit('itemimgload')
    },
    itemclick(){
      //this.$router.push('/detail/'+this.goodsItem.iid).catch(()=>{})
      // this.$router.go(0)
        this.$router.push({
          path:'/detail',
          query:{
            iid:this.goodsItem.iid
          }
        })
    }
  }
}
</script>

<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;

  width: 48%;
}

.goods-item img {
  width: 100%;
  border-radius: 5px;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: '';
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>
