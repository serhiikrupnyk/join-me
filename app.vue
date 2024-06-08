<template>
  <div>
    <NuxtLayout :name="user ? defaultLayout : emptytLayout">
      <NuxtLoadingIndicator />
      <NuxtPage />
      <UiVueSonner />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  const defaultLayout = "default";
  const emptytLayout = "empty";
  const user = useCurrentUser();
</script>
