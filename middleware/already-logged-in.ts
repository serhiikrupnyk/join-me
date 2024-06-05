export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await getCurrentUser();

  // redirect the user to the home page
  if (user) {
    return await navigateTo("/home");
  }
});
