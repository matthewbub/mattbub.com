/// <reference types="vite/client" />
/// <reference types="@mdx-js/react" />

declare module "*.mdx" {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}

declare module "*.md" {
  const content: string;
  export default content;
}
