import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { formatDate, getTrashPosts, type BlogPost } from "@/lib/blog";

export async function generateStaticParams() {
  const posts = getTrashPosts();

  return posts.map((p: BlogPost) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getTrashPosts().find((p: BlogPost) => p.slug === slug);
  if (!post) {
    return null;
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;

  return {
    title: `[TRASH] ${title}`,
    description: `[INCOMPLETE/NOT WORTH POSTING] ${description}`,
    openGraph: {
      title: `[TRASH] ${title}`,
      description: `[INCOMPLETE/NOT WORTH POSTING] ${description}`,
      type: "article",
      publishedTime,
      url: `/trash/${post.slug}`,
      images: [
        {
          url: image || `/og?title=${encodeURIComponent(`[TRASH] ${title}`)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `[TRASH] ${title}`,
      description: `[INCOMPLETE/NOT WORTH POSTING] ${description}`,
      images: [image || `/og?title=${encodeURIComponent(`[TRASH] ${title}`)}`],
    },
  };
}

export default async function TrashPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getTrashPosts().find((p: BlogPost) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <section>
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
        <p className="text-red-800 dark:text-red-200 text-sm font-medium">
          ⚠️ This post is in the trash - it&apos;s considered incomplete or not worth posting (from Theo&apos;s perspective).
        </p>
      </div>
      
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: `[TRASH] ${post.metadata.title}`,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: `[INCOMPLETE/NOT WORTH POSTING] ${post.metadata.summary}`,
            image: post.metadata.image
              ? post.metadata.image
              : `/og?title=${encodeURIComponent(`[TRASH] ${post.metadata.title}`)}`,
            url: `/trash/${post.slug}`,
            author: {
              "@type": "Person",
              name: "Matt Bub",
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter mb-1">
        {post.metadata.title}
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
        {formatDate(post.metadata.publishedAt)}
      </p>
      <article className="prose prose-compact">
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}