// Hit counter for the RU page. Needs a KV namespace bound as HITS on the Pages project.
// ponytail: plain read-modify-write in KV. Simultaneous hits can undercount by one and
// KV is eventually consistent — fine for a homepage counter. Move to a Durable Object
// only if the number ever has to be exact.
export async function onRequest({ env }) {
  if (!env.HITS) return new Response('no store', { status: 503 });
  const count = (Number(await env.HITS.get('ru')) || 0) + 1;
  await env.HITS.put('ru', String(count));
  return Response.json({ count }, { headers: { 'cache-control': 'no-store' } });
}
