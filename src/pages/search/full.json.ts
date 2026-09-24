import { readingIndex } from '../../utils/reading-index';
export async function GET() {
  const items = await readingIndex();
  return Response.json(Object.fromEntries(items.map(item => [item.slug, item])));
}
