<template>
  <div>
    <div v-for="clause in clauses" v-bind:key="clause.index" class="d-flex mt-3">
      <div class="d-flex">
        <div :style="indentStyle">{{ clause.index }}.</div>
        <div>
          <span>{{ clause.content }}</span>
          <div v-if="clause.clauses" :style="indentOffsetStyle">
            <clause-section
              v-bind:ClauseSection="clause.clauses"
              :clauses="clause.clauses"
              :offset="offset + 9"
            ></clause-section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClauseSection',
  props: ['clauses', 'ClauseSection', 'offset'],
  computed: {
    isXs() {
      return this.$vuetify.breakpoint.xs;
    },
    indentStyle() {
      return {
        minWidth: `${(this.isXs ? 32 : 37) + this.offset}px`,
      };
    },
    indentOffsetStyle() {
      return {
        marginLeft: this.isXs ? '-12px' : 'unset',
      };
    },
  },
};
</script>
