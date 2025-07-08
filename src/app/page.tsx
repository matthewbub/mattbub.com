import { BlogPosts } from "@/components/posts";

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">Matt Bub</h1>
      <p className="mb-4">
        {`I'm a software engineer working on web and mobile applications. I enjoy working on the full stack, learning new skills and working with good folks to build great software.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
