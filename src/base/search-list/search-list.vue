<template>
  <div class="search-list">
    <ul>
      <li v-for="(item, index) in searches"></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>

</style>
