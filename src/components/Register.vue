<template>
  <div id="register">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            Register Page
          </h1>
        </div>
      </div>
    </section>
    <section>
      <div class="columns">
        <div class="column"></div>
        <div class="column">
          <RegisterForm />
        </div>
        <div class="column"></div>
      </div>
    </section>
  </div>
</template>

<script>
import RegisterForm from "./../components/RegisterForm";
export default {
  name: "Register",
  components: {
    RegisterForm
  }
};
</script>

<style></style>
