export type TagBase = {
  name: string;
};

// TagCreate
export type TagCreate = TagBase;

// TagUpdate (tudo opcional)
export type TagUpdate = Partial<TagBase>;

// TagResponse
export type Tag = TagBase & {
  tag_id: string;
};
