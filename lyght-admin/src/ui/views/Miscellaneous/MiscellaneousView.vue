<template>
  <page-container :navs="navs">
    <template #rendered>
      <v-row>
        <v-col v-for="content in contents" v-bind:key="content" cols="12" sm="8">
          <div class="text-body">{{ content }}</div>
        </v-col>

        <v-col cols="12" sm="5">
          <div class="text-subtitle mb-5">Thoughts about bees?</div>
          <v-card class="pa-5 lighten-2 rounded-xl">
            <div class="text-body">{{ thought }}</div>
            <bee-loading></bee-loading>
          </v-card>
        </v-col>

        <v-col cols="12" sm="8">
          <div class="text-subtitle mb-5">Anyone else care for our beloved bees? I'm glad you ask!</div>

          <div class="text-body">
            All the way in the UK, Flo & Joan wrote
            <a href="https://www.youtube.com/watch?v=p2Ne-TYHZXA" target="_blank" class="primary--text">
              Gotta Save Them Bees
            </a>
            to advocate saving the bees.
          </div>
        </v-col>

        <v-col cols="12" sm="8">
          <div class="text-body">
            2 Chainz sat down with
            <a href="https://www.youtube.com/watch?v=p2Ne-TYHZXA" target="_blank" class="primary--text">
              luxury beekeeping service Best Bees
            </a>
            to discover why bees are essential to the global economy and the future of our planet. Living well and doing
            good.
          </div>
        </v-col>
      </v-row>
    </template>
  </page-container>
</template>

<script>
import PageContainer from '@/ui/shared/Layouts/PageContainer.vue';
import BeeLoading from '@/ui/shared/Loaders/BeeLoading.vue';
import beeThoughts from './beeThoughts';

export default {
  name: 'Miscellaneous',
  components: {
    PageContainer,
    BeeLoading,
  },
  data() {
    return {
      navs: ['miscellaneous'],
      contents: [
        'Those funky flies with stripes. Yes you got that right, bees!',
        'You might run the other way when you see a bee because you are worried about getting stung, but those tiny little creatures are actually good for the environment. Most of the food we eat relies on their pollination. We wouldn’t be able to survive without them.',
      ],
    };
  },
  computed: {
    thought() {
      return beeThoughts[Math.floor(Math.random() * beeThoughts.length)];
    },
  },
};
</script>
