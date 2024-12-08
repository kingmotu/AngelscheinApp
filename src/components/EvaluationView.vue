<template>
  <v-container class="fill-height">
    <v-expansion-panels>
      <v-expansion-panel
        v-for="category in categoryList"
        :key="`cat-${category.id}`"
      >
        <v-expansion-panel-title>{{ category.text }}</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card
            v-for="answerdQuestion in getAnswerdQuestionByCategory(category.id)"
            :key="`aq-${answerdQuestion.question.id}`"
            class="mx-auto"
            width="w-100"
          >
            <template #title>
              <div class="card-title">
                <h5>
                  {{ answerdQuestion.question.question }}
                </h5>
                <div v-if="answerdQuestion.question.image">
                  <img
                    :src="getImageUrl(answerdQuestion.question.image)"
                    class="h-auto"
                    :class="{ 'w-25': !mobile, 'w-100': mobile }"
                  />
                </div>
              </div>
            </template>

            <v-card-text class="bg-surface-light pt-4">
              <template
                v-for="answersId in 3"
                :key="`aq-${answerdQuestion.question.id}-answer-${answersId}`"
              >
                <div class="d-flex py-2">
                  <div class="flex-grow-1">
                    {{
                      answerdQuestion.question[
                        `answer_${answersId}` as keyof QuestionModel
                      ]
                    }}
                  </div>
                  <div
                    class="d-flex px-2 justify-end align-center"
                    :class="{
                      'bg-red': answersId !== answerdQuestion.question.key,
                      'bg-green': answersId === answerdQuestion.question.key,
                    }"
                    style="min-width: 50px"
                  >
                    {{ answerdQuestion.answers.answers[answersId - 1] }}
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
import { QuestionAnswerdModel } from "@/models/QuestionAnswerdModel";
import type { QuestionModel } from "@/models/QuestionModel";
import { DataService } from "@/services";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const answerdQuestions = ref<QuestionAnswerdModel[]>([]);
const categoryList = ref<CategoryModel[]>([]);
const mergedData = ref<
  {
    categoryId: string;
    question: QuestionModel;
    answers: QuestionAnswerdModel;
  }[]
>([]);

onMounted(() => {
  answerdQuestions.value = DataService.AnswerdQuestionList;
  categoryList.value = DataService.CategorieList;
  const allQuestions = DataService.Questions;
  answerdQuestions.value.forEach((aq) => {
    const question = allQuestions.find((q) => q.id === aq.questionId);
    if (question) {
      mergedData.value.push({
        categoryId: question.category,
        question,
        answers: aq,
      });
    }
  });
});

const getAnswerdQuestionByCategory = (inCategoryId: categoryIds) => {
  return mergedData.value.filter((q) => q.categoryId === inCategoryId);
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
</style>
