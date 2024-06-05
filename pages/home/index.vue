<template>
  <div>
    <UiNavbar sticky>
      <UiContainer class="flex h-14 items-center justify-between border border-b-0">
        <p class="font-semibold">Join Me</p>
        <div class="flex items-center gap-2">
          <UiButton
            size="icon-sm"
            variant="ghost"
            title="Toogle theme"
            @click="$colorMode.preference = $colorMode.value == 'dark' ? 'ligth' : 'dark'"
          >
            <span class="sr-only">Toogle theme</span>
            <Icon
              class="h-5 w-5"
              :name="$colorMode.value == 'dark' ? 'lucide:sun' : 'lucide:moon'"
            />
          </UiButton>
          <UiDropdownMenu>
            <UiDropdownMenuTrigger asChild>
              <UiAvatar
                src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                alt="Colm Tuite"
                fallback="CT"
                :delay-ms="600"
                class="h-7 w-7"
              />
            </UiDropdownMenuTrigger>
            <UiDropdownMenuContent class="w-56">
              <UiDropdownMenuLabel :label="user?.displayName || 'My account'" />
              <UiDropdownMenuSeparator />
              <UiDropdownMenuItem title="Profile" icon="ph:user" />
              <UiDropdownMenuItem title="Billing" icon="ph:credit-card" />
              <UiDropdownMenuItem title="Settings" icon="ph:gear" />
              <UiDropdownMenuSeparator />
              <UiDropdownMenuSub>
                <UiDropdownMenuSubTrigger
                  title="Invite Users"
                  icon="ph:user-plus"
                  textValue="Invite Users"
                />
                <UiDropdownMenuSubContent>
                  <UiDropdownMenuItem title="Email" icon="ph:envelope" />
                  <UiDropdownMenuItem title="Facebook" icon="logos:facebook" />
                  <UiDropdownMenuItem title="Twitter" icon="logos:twitter" />
                  <UiDropdownMenuSeparator />
                  <UiDropdownMenuItem title="More" icon="ph:plus-circle" />
                </UiDropdownMenuSubContent>
              </UiDropdownMenuSub>
              <UiDropdownMenuSeparator />
              <UiDropdownMenuItem title="Support" icon="ph:lifebuoy" />
              <UiDropdownMenuSeparator />
              <UiDropdownMenuItem @click="logout" title="Sign out" icon="ph:sign-out" />
            </UiDropdownMenuContent>
          </UiDropdownMenu>
        </div>
      </UiContainer>
    </UiNavbar>
    <UiContainer> Welcome back {{ user?.displayName }} </UiContainer>
  </div>
</template>

<script lang="ts" setup>
  import { signOut } from "firebase/auth";

  definePageMeta({
    middleware: "auth",
  });

  const user = useCurrentUser();
  const auth = useFirebaseAuth();

  const logout = async () => {
    await signOut(auth!);
    await navigateTo("/login", { replace: true });
  };
</script>
