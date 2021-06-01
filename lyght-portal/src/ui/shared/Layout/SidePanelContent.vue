<template>
  <div>
    <user-profile-photo
      :data="user.data"
      :mini="mini"
      :size="$vuetify.breakpoint.md ? 60 : undefined"
    ></user-profile-photo>

    <divider-line />

    <div>
      <div v-for="item in items" v-bind:key="item.key" :class="item.active && 'foreground'">
        <router-link
          :to="item.route"
          v-ripple="{ class: 'secondary--text' }"
          class="d-flex align-center py-3 nav-item"
          :class="mini ? 'justify-center' : 'px-4'"
        >
          <div v-if="!mini" class="mr-3">
            <v-icon :color="item.active ? 'black' : 'primary'">{{ item.icon }}</v-icon>
          </div>

          <v-tooltip v-else v-model="show[item.key]" right>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" :color="item.active ? 'black' : 'primary'">{{ item.icon }}</v-icon>
            </template>
            <span class="text-body white--text">{{ $t(item.nameKey) }}</span>
          </v-tooltip>

          <div v-if="!mini" :class="item.active ? 'black--text text-subheading' : 'text-body'">
            {{ $t(item.nameKey) }}
          </div>
        </router-link>
      </div>
      <div>
        <a
          :href="helpCenter.link"
          target="_blank"
          class="d-flex align-center py-3 nav-item"
          :class="mini ? 'justify-center' : 'px-4'"
        >
          <div v-if="!mini" class="mr-3">
            <v-icon color="primary">{{ helpCenter.icon }}</v-icon>
          </div>
          <v-tooltip v-else v-model="show.helperCenter" right>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" color="primary">{{ helpCenter.icon }}</v-icon>
            </template>
            <span class="text-body white--text">{{ $t(helpCenter.nameKey) }}</span>
          </v-tooltip>

          <div v-if="!mini" class="text-body">
            {{ $t(helpCenter.nameKey) }}
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { DividerLine } from '@/components/Divider';
import UserProfilePhoto from '@/ui/shared/Forms/UserProfilePhoto.vue';

export default {
  name: 'SidePanelContent',
  components: {
    DividerLine,
    UserProfilePhoto,
  },
  props: {
    user: {
      type: Object,
      default: () => {},
    },
    mini: { type: Boolean, default: false },
  },
  watch: {
    $route() {
      this.setRouteStatus();
    },
  },
  created() {
    this.setRouteStatus();
  },
  data() {
    return {
      helpCenter: {
        icon: 'mdi-account-question',
        nameKey: 'Route-HelpCenter-Title',
        link: 'https://lyght.zendesk.com/hc/zh-tw',
      },
      show: {
        summary: false,
        account: false,
        'my-assets': false,
        projects: false,
        messages: false,
        transactions: false,
        helpCenter: false,
      },
      items: [
        {
          key: 'account',
          icon: 'mdi-account-box',
          nameKey: 'Route-Account-Title',
          route: { name: 'account' },
          active: false,
        },
        {
          key: 'my-assets',
          icon: 'mdi-warehouse',
          nameKey: 'Route-UserAssets-Title',
          route: { name: 'my-assets' },
          active: false,
        },
        {
          key: 'projects',
          icon: 'mdi-solar-panel-large',
          nameKey: 'Route-Projects-Title',
          route: { name: 'projects' },
          active: false,
        },
        // {
        //   key: 'messages',
        //   icon: 'mdi-email-multiple',
        //   nameKey: 'Messages',
        //   route: { name: 'messages' },
        //   active: false,
        // },
        {
          key: 'my-orders',
          icon: 'mdi-clipboard-text-multiple',
          nameKey: 'Route-MyOrders-Title',
          route: { name: 'my-orders' },
          active: false,
        },
      ],
    };
  },
  methods: {
    setRouteStatus() {
      this.items.forEach((item, index) => {
        const routeName = this.$route.name;
        const parentRouteName = routeName.includes('/') ? routeName.substring(0, routeName.indexOf('/')) : routeName;
        if (item.route.name === parentRouteName) {
          this.items[index].active = true;
        } else {
          this.items[index].active = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-item {
  cursor: pointer;
  text-decoration: none !important;
}
</style>
