<template>
  <div class="header">
    <h1>RTA Learning Tool</h1>
    <div>{{ lessonId ? lessonId.split('-').join(' ') : null }}</div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props:['lessonId'],
  data () {
    return {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
