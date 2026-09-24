import { readingIndex } from '../../utils/reading-index';
export async function getStaticPaths() {
  return (await readingIndex()).map(item => ({ params: { slug: item.slug }, props: { item } }));
}
export function GET({ props }: any) {
  const { item } = props;
  return Response.json({ title: item.title, href: item.href,
    sections: item.sections.map((section: any) => ({ ...section, text: section.text.slice(0, 400) })) });
}
