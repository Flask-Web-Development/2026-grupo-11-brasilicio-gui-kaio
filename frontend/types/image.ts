export type ImageBase = {
  path: string;
};

export type Image = ImageBase & {
  image_id: string;
};

export type ImageCreate = ImageBase;

export type ImageUpdate = Partial<ImageBase>;
