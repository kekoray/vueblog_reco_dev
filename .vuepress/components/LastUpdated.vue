<template>
</template>

<script>
export default {
  props: ['slot-key'],
  mounted () {
      this.$page.lastUpdated = "2023-05-25 02:00:00";
  }
};
</script>
