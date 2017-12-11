<template>
  <div id="app">
    <el-container>
      <el-header><h1>XOR Example</h1></el-header>
      <el-main><Xor/></el-main>
      <el-footer><h4>Copyright © 2017 Teplyy Maksim</h4></el-footer>
    </el-container>
  </div>
</template>

<script>
import Xor from './components/Xor'

export default {
  name: 'app',
  components: {
    Xor
  }
}
</script>

<style lang="scss">
@import './styles/_reset';
@import './styles/main';

#app {
  .el-header {
    line-height: $header-height;
    text-align: center;
  }

  .el-main {
    height: calc(100vh - #{$header-height + $footer-height});
    min-height: 400px;
    min-width: 1200px;
  }

  .el-footer {
    text-align: center;
    line-height: $footer-height;
  }
}
</style>
