import fs from 'fs';
import path from 'path';

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  keyword: string;
  tags: string[];
  draft?: boolean;
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

function parseFrontmatter(raw: string): { data: Record<string, string | string[] | boolean>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const data: Record<string, string | string[] | boolean> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else if (value === 'true' || value === 'false') {
      data[key] = value === 'true';
    } else {
      data[key] = value.replace(/^["']|["']$/g, '');
    }
  }
  return { data, body: match[2].trim() };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
    const { data, body } = parseFrontmatter(raw);
    return {
      slug,
      title: String(data.title || slug),
      description: String(data.description || ''),
      date: String(data.date || '1970-01-01'),
      keyword: String(data.keyword || ''),
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      draft: Boolean(data.draft),
      content: body,
    } satisfies BlogPost;
  });

  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf8');
  const { data, body } = parseFrontmatter(raw);
  if (data.draft) return null;
  return {
    slug,
    title: String(data.title || slug),
    description: String(data.description || ''),
    date: String(data.date || '1970-01-01'),
    keyword: String(data.keyword || ''),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    draft: Boolean(data.draft),
    content: body,
  };
}
