<template>
  <div class="global-loading-wrapper">
    <div class="loader-main">
      <img :src="require('../../../images/loading.gif')" alt="loading">
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.global-loading-wrapper
  position fixed
  z-index 99999
  top 0
  bottom 0
  left 0
  right 0
  margin auto
  height 100vh
  width 100vw
  background white
  text-align center
  cursor url('https://avatars.githubusercontent.com/u/17562019?s=400&u=70cae2720ca2798c3076a620623b5d65b056fd19&v=4'), auto !important
  &::after
    content ""
    display inline-block
    height 100%
    width 0
    vertical-align middle
  .loader-main
    display inline-block
    vertical-align middle
    img
      width 40rem
</style>
