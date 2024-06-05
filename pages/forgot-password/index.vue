<template>
  <UiContainer class="flex min-h-dvh items-center justify-center">
    <div class="w-full max-w-[340px]">
      <div class="text-center">
        <h1 class="text-3xl font-semibold lg:text-4xl">Forgot password</h1>
        <p class="mt-2 text-lg text-muted-foreground">Let us help you sign in to your account</p>
      </div>
      <form @submit="submit" class="mt-10">
        <fieldset :disabled="isSubmitting" class="grid gap-5">
          <UiVeeInput
            icon="lucide:mail"
            name="email"
            label="Email *"
            placeholder="Email"
            type="email"
          />
          <UiButton type="submit" class="w-full"> Send instructions </UiButton>
          <UiDivider label="or" />
          <UiButton to="/login" type="submit" class="w-full" variant="outline">
            Go to sign in
          </UiButton>
        </fieldset>
      </form>
    </div>
  </UiContainer>
</template>

<script lang="ts" setup>
  import { sendPasswordResetEmail } from "firebase/auth";

  definePageMeta({
    middleware: "already-logged-in",
  });

  const auth = useFirebaseAuth();

  const { handleSubmit, isSubmitting } = useForm({
    validationSchema: toTypedSchema(ForgotPasswordSchema),
  });

  const submit = handleSubmit(async (values, ctx) => {
    const loading = useSonner.loading("Loading...", {
      description: "We are sending the instructions to your email",
    });
    try {
      await sendPasswordResetEmail(auth!, values.email, {
        url: "http://localhost:3000",
      });
      useSonner.success("Please check your email", {
        id: loading,
      });
      return await navigateTo("/login", { replace: true });
    } catch (e: any) {
      console.log(e.message);
      useSonner.error(e.message, {
        id: loading,
      });
    }
  });
</script>
