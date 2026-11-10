import type { MaybeRefOrGetter } from "vue";

export interface HeadInput {
  title: MaybeRefOrGetter<string>;
  description?: MaybeRefOrGetter<string>;
}
