<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import '@/assets/css/styles.css'
import Lessons from '@/components/Lessons.vue'
import Lesson from '@/components/Lesson.vue'

export default {
  name: 'App',
  components: {
    Lessons,
    Lesson
  }
}
</script>

<style>

</style>
