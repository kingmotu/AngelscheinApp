<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto flex-shrink-1"
      max-width="900"
    >
      <v-select
        v-model="selectedCategory"
        label="Kategorie"
        :items="categories"
        item-title="text"
        item-value="id"
        :clearable="true"
      />
      <div class="d-flex">
        <div class="flex-grow-1">
          <v-btn
            color="deep-purple-darken-2"
            size="x-large"
            @click="getRandomQuestion()"
          >
            Neu Frage
          </v-btn>
        </div>
        <div class="d-flex ga-4 justify-end align-center text-h5">
          <span class="text-green" title="Fragen richtig beantwortet">
            {{ correctCounter }}
          </span>
          <span class="text-red" title="Fragen falsch beantwortet">
            {{ wrongCounter }}
          </span>
        </div>
      </div>

      <div class="py-4" />

      <v-row v-if="randomQuestion">
        <v-col cols="12">
          <h1>{{ getCategoryLabel(randomQuestion?.category) }}</h1>
        </v-col>
        <v-col cols="12">
          <h3>{{ randomQuestion.question }}</h3>
        </v-col>
        <v-col cols="12" v-if="randomQuestion.image">
          <div>
            <img
              :src="imageUrl"
              :alt="randomQuestion.image"
              class="w-100 h-auto"
            />
          </div>
        </v-col>
        <v-col cols="12">
          <v-form validate-on="submit" @submit.prevent="submit">
            <v-radio-group v-model="radios" :disabled="validate">
              <v-radio
                :label="randomQuestion.answer_1"
                :value="1"
                :class="validAnswer(1)"
                class="my-1"
              ></v-radio>
              <v-radio
                :label="randomQuestion.answer_2"
                :value="2"
                :class="validAnswer(2)"
                class="my-1"
              ></v-radio>
              <v-radio
                :label="randomQuestion.answer_3"
                :value="3"
                :class="validAnswer(3)"
                class="my-1"
              ></v-radio>
            </v-radio-group>
            <v-btn class="mt-2" type="submit" block :disabled="disableSubmit">
              Submit
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { CategoryModel, type categoryIds } from "@/models/CategoryModel";
import { QuestionModel } from "@/models/QuestionModel";
import { DataService } from "@/services";

const categories = ref<CategoryModel[]>([]);
const selectedCategory = ref<categoryIds>();
const randomQuestion = ref<QuestionModel>();
const radios = ref<1 | 2 | 3>();
const answerText = ref<string>();
const answerId = ref<1 | 2 | 3>();
const validate = ref(false);
const disableSubmit = computed(() => {
  if (radios.value === undefined) {
    return true;
  } else if (radios.value !== undefined && validate.value === false) {
    return false;
  } else {
    return true;
  }
});

const imageUrl = computed(() => {
  let url = "";
  if (randomQuestion.value?.image) {
    url = new URL(
      `/src/assets/data/bilder/${randomQuestion.value?.image}`,
      import.meta.url
    ).href;
  }
  return url;
});

const correctCounter = ref(0);
const wrongCounter = ref(0);

onMounted(() => {
  categories.value = DataService.CategorieList;
  counters();
});

const getRandomQuestion = () => {
  validate.value = false;
  radios.value = undefined;
  if (selectedCategory.value !== undefined) {
    randomQuestion.value = DataService.RandomQuestion(selectedCategory.value);
  } else {
    randomQuestion.value = DataService.RandomQuestion();
  }
};

const getCategoryLabel = (inId?: categoryIds) => {
  return inId
    ? DataService.CategorieList.find((cat) => cat.id === inId)?.text
    : "Kategorie unbekannt";
};

const submit = (event: Event) => {
  console.log(`even`, event);
  validate.value = true;
  answerText.value = randomQuestion.value?.key_text;
  answerId.value = randomQuestion.value?.key;
  if (randomQuestion.value && radios.value) {
    DataService.AddNewAnswer(randomQuestion.value, radios.value);
  }
  counters();
};

const validAnswer = (id: number) => {
  let classString = "";
  if (validate.value === true && radios.value) {
    if (id === randomQuestion.value?.key && radios.value === id) {
      classString = "correct-answer";
    } else if (id !== randomQuestion.value?.key && radios.value === id) {
      classString = "wrong-answer";
    } else if (id === randomQuestion.value?.key && radios.value !== id) {
      classString = "correct-answer";
    }
  }
  return classString;
};

const counters = () => {
  correctCounter.value =
    DataService.AnswerdQuestionList.map(
      (item) => item?.answerdCorrect() ?? 0
    )?.reduce((total, num) => total + num, 0) ?? 0;
  wrongCounter.value =
    DataService.AnswerdQuestionList.map(
      (item) => item?.answerdWrong() ?? 0
    )?.reduce((total, num) => total + num, 0) ?? 0;
};
</script>

<style lang="scss" scoped>
.correct-answer {
  background-color: green;
}

.wrong-answer {
  background-color: red;
}
</style>
