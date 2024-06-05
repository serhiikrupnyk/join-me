<template>
  <UiContainer class="flex min-h-dvh items-center justify-center">
    <div class="w-full max-w-[340px]">
      <div class="text-center">
        <h1 class="text-3xl font-semibold lg:text-4xl">Create account</h1>
        <p class="mt-2 text-lg text-muted-foreground">Start using JoinMe today!</p>
      </div>
      <form @submit="submit" class="mt-10">
        <fieldset :disabled="isSubmitting" class="grid gap-5">
          <UiVeeInput
            icon="lucide:user"
            name="firstName"
            label="First name *"
            placeholder="First name"
          />
          <UiVeeInput
            icon="lucide:user"
            name="lastName"
            label="Last name *"
            placeholder="Last name"
          />
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
          <UiButton type="submit" class="w-full"> Create account </UiButton>
          <UiDivider label="or" />
          <UiButton @click="signUpWithGoogle" type="submit" class="w-full" variant="outline">
            <Icon name="logos:google-icon" /> Sign up with Google
          </UiButton>
        </fieldset>
      </form>
      <p class="text-center text-sm mt-10">
        Already have an account?
        <NuxtLink to="/login" class="text-sm font-semibold text-primary hover:underline"
          >Sign in here</NuxtLink
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
  import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";

  definePageMeta({
    middleware: "already-logged-in",
  });

  const auth = useFirebaseAuth();

  const { handleSubmit, isSubmitting } = useForm({
    validationSchema: toTypedSchema(RegisterSchema),
  });

  const submit = handleSubmit(async (values, ctx) => {
    const loading = useSonner.loading("Loading...", {
      description: "Creating your account",
    });
    try {
      const { user } = await createUserWithEmailAndPassword(auth!, values.email, values.password);
      await updateProfile(user, { displayName: values.firstName + " " + values.lastName });
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
      description: "Creating your account",
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
  }
</script>
