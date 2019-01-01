<template>
  <div>
    <x-header :left-options="{backText: ''}">优惠活动列表</x-header>
    <div>
      <ul class="activity-list">
        <li v-for="item in 5">
          <div>
            <img src="../../../static/images/home/banner@3x.png" alt="">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.activity-list{
  margin-top: 44px;
  padding: 10px
}
.activity-list > li img {
  width:100%;
  height: 90px;
  border-radius: 4px
}
</style>
