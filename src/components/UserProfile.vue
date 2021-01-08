<template>
  <div id="login">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            Profile Page
          </h1>
          <h2 class="subtitle">Username:{{ user.username }}</h2>
        </div>
      </div>
    </section>
    <div class="p-3 viewPolls">
      <a v-if="isGuest" class="button is-light">View Polls</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "UserProfile",
  computed: {
    ...mapGetters({
      user: "getUser",
      isGuest: "isGuest",
    }),
  },
};
</script>
<style>
.viewPolls {
  display: none;
}
@media only screen and (max-width: 1023px) {
  .viewPolls {
    display: flex;
    justify-content: center;
  }
}
</style>
