<template>
  <ClientOnly>
    <div>
      <UiNavbar sticky>
        <div
          class="flex h-14 items-center justify-between bg-violet-100 pl-5 pr-5 shadow-lg shadow-indigo-500/50"
        >
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
                  :src="avatarUrl ? avatarUrl : defaultAvatarUrl"
                  :delay-ms="600"
                  class="h-7 w-7"
                />
              </UiDropdownMenuTrigger>
              <UiDropdownMenuContent class="w-56">
                <UiDropdownMenuLabel :label="user?.displayName || 'My account'" />
                <UiDropdownMenuSeparator />
                <NuxtLink to="/profile"
                  ><UiDropdownMenuItem title="Profile" icon="ph:user"
                /></NuxtLink>
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
        </div>
      </UiNavbar>
      <div class="flex">
        <aside
          id="default-sidebar"
          class="fixed h-screen w-[300px] items-center bg-violet-100 shadow-xl shadow-indigo-500/100"
        >
          <UiScrollArea class="size-full">
            <div class="flex h-screen flex-col pt-7">
              <div class="flex h-full grow flex-col px-5 pb-8">
                <div class="mb-10 flex flex-col gap-10">
                  <nav class="flex flex-col gap-1">
                    <UiButton
                      to="/home"
                      size="default"
                      variant="ghost"
                      class="justify-start gap-4 px-3 hover:bg-violet-200"
                    >
                      <Icon name="lucide:newspaper" class="size-4 text-muted-foreground" />
                      <span>Events feed</span>
                    </UiButton>
                    <UiButton
                      to="#"
                      size="default"
                      variant="ghost"
                      class="justify-start gap-4 px-3 hover:bg-violet-200"
                    >
                      <Icon name="lucide:folder-dot" class="size-4 text-muted-foreground" />
                      <span>My events</span>
                    </UiButton>
                    <UiButton
                      to="#"
                      size="default"
                      variant="ghost"
                      class="justify-start gap-4 px-3 hover:bg-violet-200"
                    >
                      <Icon name="lucide:square-plus" class="size-4 text-muted-foreground" />
                      <span>Create event</span>
                    </UiButton>
                    <UiButton
                      to="#"
                      size="default"
                      variant="ghost"
                      class="justify-start gap-4 px-3 hover:bg-violet-200"
                    >
                      <Icon name="lucide:list" class="size-4 text-muted-foreground" />
                      <span>Categories</span>
                    </UiButton>
                  </nav>
                </div>
              </div>
            </div>
          </UiScrollArea>
        </aside>
        <slot />
      </div>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
  import { signOut } from "firebase/auth";
  import { doc, onSnapshot } from "firebase/firestore";
  import type { UserData } from "~/types/users";

  const db = useFirestore();
  const user = await getCurrentUser();
  const auth = useFirebaseAuth();
  const userData = ref<UserData | null>(null);
  const avatarUrl = ref(userData.value?.avatarUrl || "");

  const logout = async () => {
    await signOut(auth!);
    await navigateTo("/login", { replace: true });
  };

  onMounted(() => {
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        userData.value = doc.data() as UserData;
      }
    });

    // Cleanup listener on component unmount
    return () => unsub();
  });

  watch(
    () => userData.value,
    (newUserData) => {
      avatarUrl.value = newUserData?.avatarUrl || "";
    }
  );
</script>

<style></style>
