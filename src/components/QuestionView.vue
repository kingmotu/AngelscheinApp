<template>
  <v-container class="fill-height">
    <v-switch
      v-model="smOnly"
      color="primary"
      label="Nur Schonzeit und Mindestmaß Fragen"
      hide-details
    ></v-switch>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="category in categoryList"
        :key="`cat-${category.id}`"
      >
        <v-expansion-panel-title>{{ category.text }}</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card
            v-for="question in getfilterSpecialQuestionsByCategory(category.id)"
            :key="`aq-${question.id}`"
            class="mx-auto"
            width="w-100"
          >
            <template #title>
              <div class="card-title">
                <h5>
                  {{ question.question }}
                </h5>
                <div v-if="question.image">
                  <img
                    :src="getImageUrl(question.image)"
                    class="h-auto"
                    :class="{ 'w-25': !mobile, 'w-100': mobile }"
                  />
                </div>
              </div>
            </template>

            <v-card-text class="bg-surface-light pt-4">
              <template
                v-for="answersId in 3"
                :key="`question-${question.id}-answer-${answersId}`"
              >
                <div class="d-flex py-2">
                  <div
                    class="flex-grow-1"
                    :class="{ 'correct-answer': answersId === question.key }"
                  >
                    {{ question[`answer_${answersId}` as keyof QuestionModel] }}
                  </div>
                </div>
              </template>
            </v-card-text>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts" setup>
import type { categoryIds, CategoryModel } from "@/models/CategoryModel";
import type { QuestionModel } from "@/models/QuestionModel";
import { DataService } from "@/services";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const categoryList = ref<CategoryModel[]>([]);

const filteredQuestions = ref<QuestionModel[]>([]);
const smOnly = ref(false);

onMounted(() => {
  categoryList.value = DataService.CategorieList;
  filterSpecialQuestions();
});

const filterSpecialQuestions = () => {
  const allQuestions = DataService.Questions;
  filteredQuestions.value = allQuestions.filter(
    (q) =>
      q.question.toLowerCase().includes("schonzeit") ||
      q.question.toLowerCase().includes("mindestmaß")
  );
};

const getfilterSpecialQuestionsByCategory = (inCategoryId: categoryIds) => {
  return smOnly.value
    ? filteredQuestions.value.filter((q) => q.category === inCategoryId)
    : DataService.Questions.filter((q) => q.category === inCategoryId);
};

const getImageUrl = (imageName: string) => {
  let url = "";
  url = new URL(`/src/assets/data/bilder/${imageName}`, import.meta.url).href;
  return url;
};
</script>

<style lang="scss" scoped>
.card-title {
  white-space: normal !important;
}

.correct-answer {
  background-color: green;
}
</style>
