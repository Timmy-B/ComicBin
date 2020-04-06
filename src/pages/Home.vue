<template>
  <div class="home">
    <!-- <Statistic /> -->
    <RecentlyAdded/>
  </div>
</template>
<script>
// @ is an alias to /src

// import Statistic from '@/components/Statistic.vue'
import RecentlyAdded from '@/components/RecentlyAdded.vue'

export default {
  name: 'Home',
  components: {
    // Statistic,
    RecentlyAdded,
  }
}
</script>
