import { getTrashPosts } from "@/lib/blog";
import { IndexList } from "./index-list";

export function TrashPosts() {
  const allTrashPosts = getTrashPosts();

  const trashItems = allTrashPosts.map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    date: post.metadata.publishedAt,
  }));

  return (
    <IndexList
      items={trashItems}
      basePath="/trash"
      showDate={true}
      sortByDate={true}
    />
  );
}