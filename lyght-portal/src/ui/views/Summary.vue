<template>
  <div>
    <div class="text-title">Summary</div>
    <div class="text-hint">{{ pageDescription }}</div>
  </div>
</template>

<script>
export default {
  name: 'Summary',
  data() {
    return {
      pageDescription:
        'Projects that you have purchased and invested in will be displayed on this page. You can view the status of the solar farm in real time. You will also be able to view available solar farms for future plans.',
    };
  },
};
</script>
