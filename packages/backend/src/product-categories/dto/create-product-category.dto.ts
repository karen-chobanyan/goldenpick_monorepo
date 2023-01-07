export class CreateProductCategoryDto {
  _id?: string;
  name: string;
  images?: [{ url?: string; }?];
  parent?: string;
  owner?: string;
}
