<template>
  <div class="slot-pad h-screen bg-violet-100">
    <div class="pl-5 pr-5">Welcome back {{ user?.displayName }}</div>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    middleware: "auth",
    layout: "default",
  });

  const user = useCurrentUser();
</script>

<style>
  .slot-pad {
    padding: 35px 20px 35px 320px;
  }
</style>
