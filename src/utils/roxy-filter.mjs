/**
 * @param {{title:string,text:string,category:string,tags:string[],moods:string[]}} post
 * @param {{q?:string,scope?:string,category?:string,tags?:string[],moods?:string[]}} filters
 */
export function matchesPost(post, {q='',scope='title',category='',tags=[],moods=[]}) {
 const normalize = text => String(text||'').normalize('NFKC').toLocaleLowerCase().trim();
 const haystack=normalize(scope==='full'?`${post.title} ${post.text}`:post.title);
 return normalize(q).split(/\s+/).filter(Boolean).every(term=>haystack.includes(term)) && (!category||post.category===category) && tags.every(t=>post.tags.includes(t)) && (!moods.length||moods.some(m=>post.moods.includes(m)));
}
