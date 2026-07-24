'use client';

import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { Calendar, Clock, ArrowRight, Sparkles } from '@/components/social-icons';
import { useEffect, useState } from 'react';

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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Derive categories from posts
  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category).filter((c): c is string => Boolean(c))))];

  const featured = posts.find(p => p.is_published !== 0);
  const rest = posts.filter(p => p.is_published !== 0);

  const filtered = activeCategory === 'All'
    ? rest
    : rest.filter(p => p.category === activeCategory);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-primary text-lg">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/40 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="overline text-text-inverse block mb-4">Education & Tips</span>
            <h1 className="display text-text-inverse mb-6">Dental Health Blog</h1>
            <p className="body-lg text-text-inverse/70 max-w-2xl mx-auto">
              Expert advice, patient guides, and the latest in dental care — written by our team of specialists.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
      <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <FadeIn>
              <div className="bg-card-bg rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Cover */}
                  <div className={`h-64 lg:h-auto bg-gradient-to-br ${featured.cover_color || 'from-primary to-secondary'} flex items-center justify-center`}>
                    <Sparkles size={72} className="text-text-inverse/20" />
                  </div>
                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                        Featured
                      </span>
                      <span className="text-xs text-text/40">{featured.category || 'General'}</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4 leading-tight">
                      {featured.title}
                    </h2>
                    <p className="text-text/60 mb-6 leading-relaxed">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-text/40 mb-6">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(featured.published_at || featured.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {featured.content.split(/\s+/).length > 500 ? '5 min read' : '3 min read'}
                      </div>
                    </div>
                    <Link
                      href={`/blog/${featured.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                    >
                      Read Article <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Category filter */}
      {categories.length > 1 && (
        <section className="bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
            <FadeIn className="flex flex-wrap gap-2 justify-center">
              {categories.filter(c => c !== 'All' || !featured).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-primary text-text-inverse'
                      : 'bg-card-bg text-text/60 border border-border hover:border-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </FadeIn>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center text-text/60 py-12">No blog posts available.</div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.08}>
              {filtered.map(post => (
                <StaggerItem key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="group block bg-card-bg rounded-xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    {/* Cover */}
                    <div className={`h-40 bg-gradient-to-br ${post.cover_color || 'from-primary to-secondary'} flex items-center justify-center relative overflow-hidden`}>
                      <div className="text-text-inverse/20 text-6xl font-bold">{post.title[0]}</div>
                      <div className="absolute top-3 left-3">
                        <span className="text-xs bg-text-inverse/20 text-text-inverse px-2 py-1 rounded-full backdrop-blur-sm">{post.category || 'General'}</span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-secondary transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-text/60 mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-text/40">
                        <span>{post.author}</span>
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {post.content.split(/\s+/).length > 500 ? '5 min read' : '3 min read'}
                        </div>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-section-alt">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="heading-2 text-primary mb-4">Never Miss a Dental Tip</h2>
            <p className="body-lg text-text/60 mb-8">
              Subscribe to our newsletter for the latest oral health advice and clinic updates.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 border border-border rounded-lg bg-card-bg text-text focus:outline-none focus:ring-2 focus:ring-primary" />
              <button className="px-6 py-3 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-text/30 mt-3">No spam. Unsubscribe anytime.</p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
