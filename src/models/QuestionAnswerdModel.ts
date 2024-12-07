import type { categoryIds } from "./CategoryModel";

export interface IQuestionAnswerdModel {
  /**
   * Id of the question
   */
  questionId: string;
  /**
   * Counts of answers clicked.
   * Index === answerId - 1;
   * index 0-2
   */
  answers: number[];
  /**
   * Index of correct answer + 1;
   * indexKey 1-3
   */
  correctAnswerKey: 1 | 2 | 3;
  /**
   * Category id of the question
   */
  category: categoryIds;
}

export class QuestionAnswerdModel implements IQuestionAnswerdModel {
  public questionId: string;
  public answers: number[];
  public correctAnswerKey: 1 | 2 | 3;
  public category: categoryIds;
  constructor();
  constructor(obj: IQuestionAnswerdModel);
  // eslint-disable-next-line
  constructor(obj?: any) {
    this.questionId = (obj && obj.questionId) || "";
    this.answers = (obj && obj.answers) || [0, 0, 0];
    this.correctAnswerKey = (obj && obj.correctAnswerKey) || 0;
    this.category = (obj && obj.category) || "afk";
  }

  /**
   * Count of correct answers
   * @returns
   */
  answerdCorrect() {
    return this.answers[this.correctAnswerKey - 1];
  }

  /**
   * Count of wrong answers
   * @returns
   */
  answerdWrong() {
    return (
      this.answers.reduce((total, num) => total + num, 0) -
      this.answerdCorrect()
    );
  }

  increaseAnswers(inAnswerKey: 1 | 2 | 3) {
    this.answers[inAnswerKey - 1]++;
  }
}
