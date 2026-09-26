// Prerendered index of every tool. The island switches to fetching this past ~200 tools
// (see PLAN.md §10); agents and scripts can read it today.
import type { APIRoute } from 'astro';
import { getCategories, getTools } from '../lib/data';
import { toIndex } from '../lib/tool-index';

export const GET: APIRoute = async () => {
  const tools = await getTools();
  const index = await toIndex(tools, await getCategories(tools));
  return new Response(JSON.stringify(index), { headers: { 'content-type': 'application/json' } });
};
