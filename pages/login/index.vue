<template>
  <UiContainer class="flex min-h-dvh items-center justify-center">
    <div class="w-full max-w-[340px]">
      <div class="text-center">
        <h1 class="text-3xl font-semibold lg:text-4xl">Sign in</h1>
        <p class="mt-2 text-lg text-muted-foreground">
          Welcome back! Enter your details to get started.
        </p>
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
          <UiVeeInput
            icon="lucide:lock-keyhole"
            name="password"
            label="Password *"
            placeholder="Password"
            type="password"
          />
          <p>
            <NuxtLink
              to="/forgot-password"
              class="text-sm font-semibold text-primary hover:underline"
              >Forgot password?</NuxtLink
            >
          </p>
          <UiButton type="submit" class="w-full"> Sign in</UiButton>
          <UiDivider label="or" />
          <UiButton @click="signUpWithGoogle" type="submit" class="w-full" variant="outline">
            <Icon name="logos:google-icon" /> Sign in with Google
          </UiButton>
        </fieldset>
      </form>
      <p class="text-center text-sm mt-10">
        Don't have an account?
        <NuxtLink to="/register" class="text-sm font-semibold text-primary hover:underline"
          >Create one here</NuxtLink
        >
      </p>
    </div>
  </UiContainer>
</template>

<script lang="ts">
  import { GoogleAuthProvider } from "firebase/auth";

  export const googleAuthProvider = new GoogleAuthProvider();
</script>

<script lang="ts" setup>
  import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

  definePageMeta({
    middleware: "already-logged-in",
  });

  const auth = useFirebaseAuth();

  const { handleSubmit, isSubmitting } = useForm({
    validationSchema: toTypedSchema(LoginSchema),
  });

  const submit = handleSubmit(async (values, ctx) => {
    const loading = useSonner.loading("Loading...", {
      description: "We are signing you in",
    });
    try {
      await signInWithEmailAndPassword(auth!, values.email, values.password);
      useSonner.success("Account created successfully!", {
        id: loading,
      });
      return await navigateTo("/home", { replace: true });
    } catch (e: any) {
      console.log(e.message);
      useSonner.error(e.message, {
        id: loading,
      });
    }
  });

  const signUpWithGoogle = async () => {
    const loading = useSonner.loading("Loading...", {
      description: "We are signing you in",
    });
    try {
      await signInWithPopup(auth!, googleAuthProvider);
      useSonner.success("Account created successfully!", {
        id: loading,
      });
      return await navigateTo("/home", { replace: true });
    } catch (e: any) {
      console.log(e.message);
      useSonner.error(e.message, {
        id: loading,
      });
    }
  };
</script>
