export type TagBase = {
  name: string;
  importance: number;
};

// TagCreate
export type TagCreate = TagBase;

// TagUpdate (tudo opcional)
export type TagUpdate = Partial<TagBase>;

// TagResponse
export type Tag = TagBase & {
  id: number;
};
