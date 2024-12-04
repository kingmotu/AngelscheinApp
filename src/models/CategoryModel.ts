export type categoryIds = "afk" | "sfk" | "gwk" | "grk" | "gsk";

export interface ICategoryModel {
  id: categoryIds;
  text: string;
}

export class CategoryModel implements ICategoryModel {
  public id: categoryIds;
  public text: string;

  constructor();
  constructor(obj: ICategoryModel);
  // eslint-disable-next-line
  constructor(obj?: any) {
    this.id = (obj && obj.id) || "afk";
    this.text = (obj && obj.text) || "";
  }
}
