export type ImageBase = {
  path: string; // Path do Python vira string no JSON
};

export type Image = ImageBase & {
  id: number;
};

// ImageCreate ainda não faz sentido no cliente — ver observação #4 abaixo
