/**
 * brain-knowledge.js — Local Knowledge Base with Semantic Search
 *
 * Stores and retrieves knowledge entries in Supabase (brain_knowledge table)
 * with TF-IDF-based local search — zero AI tokens for retrieval.
 *
 * Features:
 *   - Add entries with tags, source, category
 *   - Full-text search across all entries
 *   - TF-IDF relevance scoring (no embeddings needed)
 *   - Auto-extraction of key terms
 *   - Category-based browsing
 *   - Import from brain_context for bootstrapping
 *   - Conversation memory: stores AI interactions as knowledge
 *   - RAG-ready: generates context snippets for AI prompts
 */

const Store = require('electron-store');

class BrainKnowledge {
  constructor(brainContext) {
    this.brainContext = brainContext;
    this.store = new Store({ name: 'brain-console-knowledge' });
    this.localIndex = new Map(); // In-memory inverted index
    this.documents = [];         // Cached docs for search
    this.idfCache = {};          // IDF values
    this.initialized = false;
  }

  async initialize() {
    if (!this.brainContext.supabase) {
      // Fall back to local-only mode
      this.documents = this.store.get('knowledge_entries', []);
      this._buildIndex();
      this.initialized = true;
      return;
    }

    // Ensure table exists by trying to query it
    try {
      const { data, error } = await this.brainContext.supabase
        .from('brain_knowledge')
        .select('*')
        .limit(500);

      if (error) {
        // Table might not exist — use local storage fallback
        console.log('[Knowledge] brain_knowledge table not found, using local storage');
        this.documents = this.store.get('knowledge_entries', []);
      } else {
        this.documents = data || [];
        // Sync to local cache
        this.store.set('knowledge_entries', this.documents);
      }
    } catch {
      this.documents = this.store.get('knowledge_entries', []);
    }

    this._buildIndex();
    this.initialized = true;
    console.log(`[Knowledge] Initialized with ${this.documents.length} entries`);
  }

  // ============ CRUD ============

  /**
   * Add a knowledge entry
   * @param {object} entry - { title, content, category, tags, source, metadata }
   */
  async add(entry) {
    const doc = {
      id: entry.id || this._generateId(),
      title: entry.title || '',
      content: entry.content || '',
      category: entry.category || 'general',
      tags: entry.tags || [],
      source: entry.source || 'manual',
      metadata: entry.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Extract key terms automatically
    doc.key_terms = this._extractKeyTerms(doc.title + ' ' + doc.content);

    // Store in Supabase if available
    if (this.brainContext.supabase) {
      try {
        const { error } = await this.brainContext.supabase
          .from('brain_knowledge')
          .upsert({
            ...doc,
            tags: JSON.stringify(doc.tags),
            key_terms: JSON.stringify(doc.key_terms),
            metadata: JSON.stringify(doc.metadata),
          }, { onConflict: 'id' });
        if (error) console.error('[Knowledge] Insert error:', error.message);
      } catch (e) {
        console.error('[Knowledge] Supabase error:', e.message);
      }
    }

    // Always maintain local cache
    const existing = this.documents.findIndex(d => d.id === doc.id);
    if (existing >= 0) {
      this.documents[existing] = doc;
    } else {
      this.documents.push(doc);
    }
    this.store.set('knowledge_entries', this.documents);
    this._buildIndex();

    return doc;
  }

  /**
   * Search knowledge base with TF-IDF relevance scoring
   */
  search(query, limit = 10) {
    if (!query || !this.documents.length) return [];

    const queryTerms = this._tokenize(query.toLowerCase());
    const scores = [];

    for (let i = 0; i < this.documents.length; i++) {
      const doc = this.documents[i];
      let score = 0;

      // TF-IDF scoring
      const docText = `${doc.title || ''} ${doc.content || ''} ${(doc.tags || []).join(' ')}`.toLowerCase();
      const docTerms = this._tokenize(docText);
      const docLength = docTerms.length || 1;

      for (const term of queryTerms) {
        const tf = docTerms.filter(t => t === term).length / docLength;
        const idf = this.idfCache[term] || 0;
        score += tf * idf;

        // Boost: exact match in title
        if (doc.title && doc.title.toLowerCase().includes(term)) score += 0.5;
        // Boost: tag match
        if (doc.tags?.some(t => t.toLowerCase() === term)) score += 0.3;
      }

      // Recency boost (newer = slightly higher)
      if (doc.created_at) {
        const ageHours = (Date.now() - new Date(doc.created_at).getTime()) / 3600000;
        score += Math.max(0, 0.1 - (ageHours / 24000)); // Decays over ~1000 days
      }

      if (score > 0) {
        scores.push({ doc, score });
      }
    }

    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, limit).map(s => ({
      ...s.doc,
      relevance: Math.round(s.score * 1000) / 1000,
    }));
  }

  /**
   * Get entries by category
   */
  getByCategory(category) {
    return this.documents.filter(d => d.category === category);
  }

  /**
   * List all categories with counts
   */
  getCategories() {
    const cats = {};
    for (const doc of this.documents) {
      const c = doc.category || 'general';
      cats[c] = (cats[c] || 0) + 1;
    }
    return cats;
  }

  /**
   * Delete an entry
   */
  async delete(id) {
    if (this.brainContext.supabase) {
      await this.brainContext.supabase.from('brain_knowledge').delete().eq('id', id);
    }
    this.documents = this.documents.filter(d => d.id !== id);
    this.store.set('knowledge_entries', this.documents);
    this._buildIndex();
    return { success: true, deleted: id };
  }

  /**
   * Get stats about the knowledge base
   */
  getStats() {
    const categories = this.getCategories();
    const sources = {};
    let totalChars = 0;
    let oldestDate = null;
    let newestDate = null;

    for (const doc of this.documents) {
      const s = doc.source || 'unknown';
      sources[s] = (sources[s] || 0) + 1;
      totalChars += (doc.content || '').length;

      const d = new Date(doc.created_at);
      if (!oldestDate || d < oldestDate) oldestDate = d;
      if (!newestDate || d > newestDate) newestDate = d;
    }

    return {
      total_entries: this.documents.length,
      total_characters: totalChars,
      categories,
      sources,
      index_terms: this.localIndex.size,
      oldest_entry: oldestDate?.toISOString() || null,
      newest_entry: newestDate?.toISOString() || null,
    };
  }

  // ============ ADVANCED FEATURES ============

  /**
   * Store a conversation exchange as knowledge
   */
  async learnFromConversation(userMessage, aiResponse, provider) {
    return await this.add({
      title: userMessage.slice(0, 100),
      content: `**Q:** ${userMessage}\n\n**A:** ${aiResponse}`,
      category: 'conversation',
      tags: ['auto-learned', provider || 'unknown'],
      source: 'conversation',
      metadata: {
        provider,
        message_length: userMessage.length,
        response_length: aiResponse.length,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Import all brain_context entries as knowledge
   */
  async importFromContext() {
    const ctx = await this.brainContext.getFullContext();
    let imported = 0;

    for (const [key, value] of Object.entries(ctx)) {
      const content = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
      await this.add({
        id: `ctx_${key.replace(/[^a-zA-Z0-9]/g, '_')}`,
        title: key,
        content,
        category: 'context',
        tags: key.split('.'),
        source: 'brain_context',
      });
      imported++;
    }

    return { imported, total: this.documents.length };
  }

  /**
   * Generate RAG context for an AI prompt — retrieves relevant knowledge
   * and formats it as a compact context block
   */
  generateRAGContext(query, maxTokens = 800) {
    const results = this.search(query, 5);
    if (!results.length) return '';

    let context = '--- RELEVANT KNOWLEDGE ---\n';
    let tokenEstimate = 10;

    for (const r of results) {
      const entry = `[${r.category}] ${r.title}: ${r.content}\n`;
      const entryTokens = Math.round(entry.length / 4);

      if (tokenEstimate + entryTokens > maxTokens) break;
      context += entry;
      tokenEstimate += entryTokens;
    }

    context += '--- END KNOWLEDGE ---\n';
    return context;
  }

  // ============ INTERNAL ============

  _buildIndex() {
    this.localIndex.clear();
    this.idfCache = {};

    const N = this.documents.length || 1;
    const df = {}; // Document frequency per term

    // Build document frequency
    for (const doc of this.documents) {
      const text = `${doc.title || ''} ${doc.content || ''} ${(doc.tags || []).join(' ')}`.toLowerCase();
      const terms = new Set(this._tokenize(text));
      for (const term of terms) {
        df[term] = (df[term] || 0) + 1;
        if (!this.localIndex.has(term)) this.localIndex.set(term, []);
        this.localIndex.get(term).push(doc.id);
      }
    }

    // Calculate IDF
    for (const [term, count] of Object.entries(df)) {
      this.idfCache[term] = Math.log(N / count);
    }
  }

  _tokenize(text) {
    return text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2)
      .filter(t => !this._isStopWord(t));
  }

  _isStopWord(word) {
    const stops = new Set([
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was',
      'one', 'our', 'out', 'has', 'have', 'had', 'this', 'that', 'with', 'from',
      'they', 'been', 'said', 'each', 'which', 'their', 'will', 'other', 'about',
      'many', 'then', 'them', 'these', 'some', 'would', 'make', 'like', 'into',
      'could', 'time', 'very', 'when', 'come', 'made', 'than', 'been', 'its',
    ]);
    return stops.has(word);
  }

  _extractKeyTerms(text) {
    const terms = this._tokenize(text.toLowerCase());
    const freq = {};
    for (const t of terms) { freq[t] = (freq[t] || 0) + 1; }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([term]) => term);
  }

  _generateId() {
    return `kb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}

module.exports = { BrainKnowledge };
