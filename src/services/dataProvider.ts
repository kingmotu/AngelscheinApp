import { QuestionModel } from "@/models/QuestionModel";

import dataJson from "@/assets/data/angelschein_fragenkatalog.json";
import { CategoryModel, type categoryIds } from "@/models/CategoryModel";
import { QuestionAnswerdModel } from "@/models/QuestionAnswerdModel";

const localStorageKey = "AngelscheinApp";

class DataProvider {
  /**
   * Credits: https://refactoring.guru/design-patterns/singleton/typescript/example
   */
  private static instance: DataProvider;

  private allData: QuestionModel[] = [];
  private categorieList: CategoryModel[] = [
    { id: "afk", text: "Allgemeine Fischkunde" },
    { id: "sfk", text: "Spezielle Fischkunde" },
    { id: "gwk", text: "Gewässerkunde" },
    { id: "grk", text: "Gerätekunde" },
    { id: "gsk", text: "Gesetzeskunde" },
  ];
  private lastUsedId: number = -1;

  private answerdQuestionList: QuestionAnswerdModel[] = [];

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    this.allData = dataJson.map((question) => {
      const category = this.categorieList.find(
        (cat) => cat.text === question.category
      );
      const mappedQestion = new QuestionModel({
        answer_1: question.answer_1,
        answer_2: question.answer_2,
        answer_3: question.answer_3,
        category: category?.id ?? "afk",
        id: question.id,
        key: question.key as 1 | 2 | 3,
        key_text: question.key_text,
        question: question.question,
      });
      if (question.image !== "Kein Bild") {
        mappedQestion.image = question.image;
      }
      return mappedQestion;
    });

    this.loadAnswerdQuestionList();
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): DataProvider {
    if (!DataProvider.instance) {
      DataProvider.instance = new DataProvider();
    }

    return DataProvider.instance;
  }

  public get Questions(): QuestionModel[] {
    return this.allData;
  }

  public get CategorieList(): CategoryModel[] {
    return this.categorieList;
  }

  public get AnswerdQuestionList(): QuestionAnswerdModel[] {
    return this.answerdQuestionList;
  }

  public QuestionsByCategory(inCategoryId: categoryIds): QuestionModel[] {
    return this.allData.filter(
      (question) => question.category === inCategoryId
    );
  }

  public RandomQuestion(inCategoryId?: categoryIds): QuestionModel {
    const data = inCategoryId
      ? this.QuestionsByCategory(inCategoryId)
      : this.allData;
    return data[this.getRand(data.length)];
  }

  public AddNewAnswer(question: QuestionModel, selectedAnswerId: 1 | 2 | 3) {
    const usedItem = this.answerdQuestionList.find(
      (q) => q.questionId === question.id
    );
    if (usedItem) {
      usedItem.increaseAnswers(selectedAnswerId);
    } else {
      const newItem = new QuestionAnswerdModel();
      newItem.category = question.category;
      newItem.questionId = question.id;
      newItem.correctAnswerKey = question.key;
      newItem.increaseAnswers(selectedAnswerId);
      this.answerdQuestionList.push(newItem);
    }

    this.saveAnswerdQuestionList();
  }

  private getRand(max: number): number {
    const randomNumber = parseInt(
      ((Math.random() * 10000) % max).toFixed(0),
      10
    );
    if (randomNumber !== this.lastUsedId) {
      return randomNumber;
    } else {
      return this.getRand(max);
    }
  }

  private saveAnswerdQuestionList() {
    if (window.localStorage) {
      window.localStorage.setItem(
        localStorageKey,
        JSON.stringify(this.answerdQuestionList)
      );
    }
  }

  private loadAnswerdQuestionList() {
    if (window.localStorage) {
      const answerdList = window.localStorage.getItem(localStorageKey);
      if (answerdList) {
        const dataList = JSON.parse(answerdList);
        dataList.forEach((item: QuestionAnswerdModel) => {
          this.answerdQuestionList.push(new QuestionAnswerdModel(item));
        });
      }
    }
  }
}

export default DataProvider;
