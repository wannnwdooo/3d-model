export interface IModelSize {
  x: number;
  y: number;
  z: number;
}

export interface IModel {
  link: string;
  type: string;
  name: string;
  size?: IModelSize;
}

export interface ModelsStateInterface {
  model: IModel | null;
}

export const state: ModelsStateInterface = {
  model: null,
};
