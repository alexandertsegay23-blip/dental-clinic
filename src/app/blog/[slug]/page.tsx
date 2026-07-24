import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FadeIn } from '@/components/FadeIn';
import { Calendar, Clock, ArrowLeft, ArrowRight } from '@/components/social-icons';
import { getAll } from '@/lib/storage';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_color: string;
  author: string;
  is_published: number;
  published_at: string;
  created_at: string;
  category?: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAll<any>('blog_posts');
  return posts.filter((p: any) => p.is_published !== 0).map((post: any) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const posts = await getAll<any>('blog_posts');
  const post = posts.find((p: any) => p.slug === slug && p.is_published !== 0);
  if (!post) return {};
  const settings = (await getAll<any>('settings')).reduce((acc: Record<string, string>, s: any) => {
    acc[s.key] = s.value;
    return acc;
  }, {});
  const clinicName = settings.clinic_name || 'Dental Clinic';
  return {
    title: `${post.title} — ${clinicName} Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const posts = await getAll<any>('blog_posts');
  const post = posts.find((p: any) => p.slug === slug && p.is_published !== 0);
  if (!post) notFound();

  const related = posts
    .filter((p: any) => p.slug !== slug && p.is_published !== 0)
    .slice(0, 3);

  // Split content into paragraphs and handle markdown-style headers
  const sections = post.content.split('\n\n').filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/40 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <Link href="/blog" className="inline-flex items-center gap-2 text-text-inverse/60 hover:text-text-inverse mb-6 transition-colors text-sm">
              <ArrowLeft size={16} /> Back to Blog
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs bg-secondary/20 text-text-inverse px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                {post.category || 'General'}
              </span>
            </div>
            <h1 className="display text-text-inverse mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-inverse/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center text-text-inverse text-xs font-bold">
                  {post.author.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="text-text-inverse font-medium text-sm">{post.author}</div>
                  <div className="text-text-inverse/40 text-xs">Author</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(post.published_at || post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                {post.content.split(/\s+/).length > 500 ? '5 min read' : '3 min read'}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <FadeIn>
            {/* Cover placeholder */}
            <div className={`w-full h-64 rounded-2xl bg-gradient-to-br ${post.cover_color || 'from-primary to-secondary'} flex items-center justify-center mb-12`}>
              <div className="text-text-inverse/20 text-8xl font-bold">{post.title[0]}</div>
            </div>

            {/* Article content */}
            <div className="prose-custom space-y-6">
              {sections.map((section: string, i: number) => {
                if (section.startsWith('**') && section.endsWith('**')) {
                  return (
                    <h2 key={i} className="text-2xl font-bold text-primary pt-4">
                      {section.replace(/\*\*/g, '')}
                    </h2>
                  );
                }
                if (section.startsWith('*') && section.endsWith('*') && !section.includes('\n')) {
                  return (
                    <p key={i} className="text-lg italic text-text/70">
                      {section.replace(/\*/g, '')}
                    </p>
                  );
                }
                if (section.startsWith('|')) {
                  // Simple table
                  const rows = section.split('\n').filter(r => !r.startsWith('|---'));
                  return (
                    <div key={i} className="overflow-x-auto">
                      <table className="w-full text-sm my-6">
                        <tbody>
                          {rows.map((row: string, ri: number) => (
                            <tr key={ri} className={ri === 0 ? 'font-bold text-primary' : 'text-text/70'}>
                              {row.split('|').filter(Boolean).map((cell: string, ci: number) => (
                                <td key={ci} className="px-4 py-3 border border-border">{cell.trim()}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                if (section.startsWith('- ')) {
                  const items = section.split('\n').filter(Boolean);
                  return (
                    <ul key={i} className="space-y-2 pl-6">
                      {items.map((item: string, li: number) => (
                        <li key={li} className="flex items-start gap-3 text-text/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                          <span>{item.replace(/^-\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="text-text/70 leading-relaxed">
                    {section.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </p>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="py-16 bg-section-alt">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <FadeIn>
              <h2 className="heading-2 text-primary mb-8">Related Articles</h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((rp: any) => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group bg-card-bg rounded-xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`h-32 bg-gradient-to-br ${rp.cover_color || 'from-primary to-secondary'} flex items-center justify-center`}>
                    <div className="text-text-inverse/20 text-5xl font-bold">{rp.title[0]}</div>
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-primary font-semibold">{rp.category || 'General'}</span>
                    <h3 className="text-base font-bold text-primary mt-1 leading-snug group-hover:text-secondary transition-colors">
                      {rp.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-text/40">
                      <Clock size={12} />
                      {rp.content.split(/\s+/).length > 500 ? '5 min read' : '3 min read'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-primary text-text-inverse text-center">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <h2 className="heading-2 mb-4">Have More Questions?</h2>
            <p className="body-lg text-text-inverse/70 mb-8">Book a consultation and get personalized advice from our specialists.</p>
            <Link href="/appointment" className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all">
              Book Consultation <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
