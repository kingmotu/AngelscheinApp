import type { categoryIds } from './CategoryModel';

export interface IQuestionModel {
  id: string;
  question:string;
  answer_1: string;
  answer_2: string;
  answer_3: string;
  key: number;
  key_text: string;
  image?: string;
  category: categoryIds;
}

export class QuestionModel implements IQuestionModel {
  public id: string;
  public question: string;
  public answer_1: string;
  public answer_2: string;
  public answer_3: string;
  public key: number;
  public key_text: string;
  public image?: string;
  public category: categoryIds;

  constructor();
  constructor(obj: IQuestionModel);
  // eslint-disable-next-line
  constructor(obj?: any) {
    this.id = (obj && obj.id) || "";
    this.question = (obj && obj.question) || "";
    this.answer_1 = (obj && obj.answer_1) || "";
    this.answer_2 = (obj && obj.answer_2) || "";
    this.answer_3 = (obj && obj.answer_3) || "";
    this.key = (obj && obj.key) || 0;
    this.key_text = (obj && obj.key_text) || "";
    this.category = (obj && obj.category) || "afk";
    if (obj && obj.image) {
      this.image = obj.image;
    }
  }
}
