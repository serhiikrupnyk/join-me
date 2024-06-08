<template>
  <ClientOnly>
    <div class="slot-pad bg-violet-100">
      <UiContainer class="w-full">
        <div class="flex w-full items-center justify-center">
          <form class="w-full">
            <UiCard
              class="w-full bg-violet-100 shadow-2xl shadow-indigo-500/100"
              title="User info"
              description="You can update your information"
            >
              <template #content>
                <UiCardContent>
                  <div class="grid w-full items-center gap-4">
                    <div class="flex flex-col space-y-1.5">
                      <UiAvatar
                        class="h-[100px] w-[100px]"
                        :src="avatarUrl ? avatarUrl : defaultAvatarUrl"
                        :alt="user.displayName"
                        :delay-ms="600"
                        @click="triggerAvatarInput"
                        style="cursor: pointer"
                        title="Change avatar"
                      />
                      <input
                        @change="handleAvatarChange"
                        id="avatarInput"
                        type="file"
                        accept="image/*"
                        :v-model="avatarFile"
                        style="display: none"
                      />
                    </div>
                    <div class="flex w-full gap-4">
                      <div class="flex w-[50%] flex-col space-y-1.5">
                        <UiLabel for="firstName">First name</UiLabel>
                        <UiInput
                          v-model="firstName"
                          required
                          id="firstName"
                          placeholder="First name"
                        />
                      </div>
                      <div class="flex w-[50%] flex-col space-y-1.5">
                        <UiLabel for="lastName">Last name</UiLabel>
                        <UiInput
                          v-model="lastName"
                          required
                          id="lastName"
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                    <div class="flex w-full gap-4">
                      <div class="flex w-[50%] flex-col space-y-1.5">
                        <UiLabel for="email">Email</UiLabel>
                        <UiInput
                          v-model="email"
                          type="email"
                          required
                          id="email"
                          placeholder="Email"
                        />
                      </div>
                      <div class="flex w-[50%] flex-col space-y-1.5">
                        <UiLabel for="phone">Phone</UiLabel>
                        <UiInput v-model="phone" type="phone" id="phone" placeholder="Phone" />
                      </div>
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="country">Country</UiLabel>
                      <UiSelect v-model="selectedCountry">
                        <UiSelectTrigger id="country" placeholder="Select" />
                        <UiSelectContent>
                          <UiInput
                            type="text"
                            v-model="searchCountryQuery"
                            placeholder="Search..."
                          />
                          <UiSelectItem
                            v-for="item in filteredCountries"
                            :key="item.name"
                            :value="item"
                          >
                            {{ item.name }}
                          </UiSelectItem>
                        </UiSelectContent>
                      </UiSelect>
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="framework">City</UiLabel>
                      <UiSelect :disabled="!selectedCountry" v-model="selectedCity">
                        <UiSelectTrigger id="framework" placeholder="Select" />
                        <UiSelectContent>
                          <UiInput type="text" v-model="searchCityQuery" placeholder="Search..." />
                          <UiScrollArea
                            ><UiSelectItem
                              v-for="item in filteredCities"
                              :key="item.name"
                              :value="item"
                            >
                              {{ item.name }}
                            </UiSelectItem></UiScrollArea
                          >
                        </UiSelectContent>
                      </UiSelect>
                    </div>
                    <div class="flex w-[100%] flex-col space-y-1.5">
                      <UiLabel for="adress">Adress</UiLabel>
                      <UiInput v-model="adress" type="adress" id="adress" placeholder="Adress" />
                    </div>
                  </div>
                </UiCardContent>
              </template>
              <template #footer>
                <UiCardFooter class="flex justify-between">
                  <UiButton @click="handleDiscardChanges" type="reset" variant="outline"
                    >Discard</UiButton
                  >
                  <UiButton @click="handleUserDataUpdate" type="submit">Update</UiButton>
                </UiCardFooter>
              </template>
            </UiCard>
          </form>
        </div>
      </UiContainer>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
  import { getAvatarFilePreviewUrl, uploadFile } from "~/utils/user/userData";
  import { City, Country } from "country-state-city";
  import { updateProfile } from "firebase/auth";
  import { doc, onSnapshot, setDoc } from "firebase/firestore";
  import type { UserData } from "~/types/users";

  definePageMeta({
    middleware: ["auth"],
    layout: "default",
  });

  const db = useFirestore();
  const storage = useFirebaseStorage();
  const user = await getCurrentUser();

  const userData = ref<UserData | null>(null);

  const selectedCountry = ref();
  const selectedCity = ref();
  const searchCountryQuery = ref("");
  const searchCityQuery = ref("");
  const countries = Country.getAllCountries();
  const firstName = ref(userData.value?.firstName || "");
  const lastName = ref(userData.value?.lastName || "");
  const email = ref(userData.value?.email || "");
  const phone = ref(userData.value?.phone || "");
  const country = ref(userData.value?.location.country || {});
  const city = ref(userData.value?.location.city || {});
  const adress = ref(userData.value?.location.adress || "");
  const avatarFile = ref(null);
  const avatarUrl = ref(userData.value?.avatarUrl || "");

  const triggerAvatarInput = () => {
    document?.getElementById("avatarInput")?.click();
  };

  const filteredCountries = computed(() => {
    if (searchCountryQuery.value.length !== 0) {
      return countries.filter((item) =>
        item.name.toLowerCase().includes(searchCountryQuery.value.toLowerCase())
      );
    }
  });

  const filteredCities = computed(() => {
    if (searchCityQuery.value.length !== 0 && selectedCountry?.value?.isoCode) {
      return City.getCitiesOfCountry(selectedCountry?.value?.isoCode)?.filter((item) =>
        item.name.toLowerCase().includes(searchCityQuery.value.toLowerCase())
      );
    }
  });

  const handleAvatarChange = (event: { target: { files: any[] } }) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      avatarFile.value = file;
      getAvatarFilePreviewUrl(file)
        .then((url) => {
          avatarUrl.value = url;
        })
        .catch((error) => {
          console.error("Error getting avatar file preview URL:", error);
        });
    }
  };

  const handleUserDataUpdate = async (event: any) => {
    event.preventDefault();
    const loading = useSonner.loading("Loading...", {
      description: "Updating your information",
    });

    const newUserData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      location: {
        country: selectedCountry.value,
        city: selectedCity.value,
        adress: adress.value,
      },
    };

    try {
      if (!user) {
        throw new Error("User is missing");
      }

      if (avatarFile.value) {
        uploadFile(storage, `/usersAvatars/${user.uid}.jpg`, avatarFile?.value)
          .then(async (url) => {
            console.log(1);

            await setDoc(
              doc(db, "users", user.uid),
              { ...newUserData, avatarUrl: url },
              { merge: true }
            );
            await updateProfile(user, {
              displayName: newUserData.firstName + " " + newUserData.lastName,
            });
            useSonner.success("Updated successfully!", {
              id: loading,
            });
          })
          .catch((error) => {
            console.error("Error uploading file:", error);
          });

        return;
      }
      await setDoc(doc(db, "users", user.uid), newUserData, { merge: true });
      await updateProfile(user, {
        displayName: newUserData.firstName + " " + newUserData.lastName,
      });
      useSonner.success("Updated successfully!", {
        id: loading,
      });
    } catch (error: any) {
      // TODO show error with toast
      useSonner.error(error.message, {
        id: loading,
      });
      console.error("Error updating user data:", error);
    }
  };

  const handleDiscardChanges = async (event: any) => {
    event.preventDefault();

    avatarUrl.value = userData?.value?.avatarUrl || "";
    firstName.value = userData?.value?.firstName || "";
    lastName.value = userData?.value?.lastName || "";
    email.value = userData?.value?.email || "";
    phone.value = userData?.value?.phone || "";
    selectedCountry.value = userData?.value?.location.country || {};
    selectedCity.value = userData?.value?.location.city || {};
    country.value = userData?.value?.location.country || {};
    city.value = userData?.value?.location.city || {};
    adress.value = userData?.value?.location.adress || "";
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
      firstName.value = newUserData?.firstName || "";
      lastName.value = newUserData?.lastName || "";
      email.value = newUserData?.email || "";
      phone.value = newUserData?.phone || "";
      selectedCountry.value = newUserData?.location.country || {};
      selectedCity.value = newUserData?.location.city || {};
      country.value = newUserData?.location.country || {};
      city.value = newUserData?.location.city || {};
      adress.value = newUserData?.location.adress || "";
    }
  );
</script>

<style>
  .slot-pad {
    padding: 35px 20px 35px 320px;
    width: 100%;
  }
</style>
