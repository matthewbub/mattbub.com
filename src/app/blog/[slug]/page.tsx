import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { formatDate, getBlogPosts } from "@/lib/blog";

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);
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
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `/blog/${post.slug}`,
      images: [
        {
          url: image || `/og?title=${encodeURIComponent(title)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image || `/og?title=${encodeURIComponent(title)}`],
    },
  };
}

export default async function Blog({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? post.metadata.image
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `/blog/${post.slug}`,
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
