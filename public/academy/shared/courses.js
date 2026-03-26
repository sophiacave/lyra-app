/**
 * Like One Academy — Course Manifest
 * All 10 courses with ordered lesson arrays.
 * Referenced by lesson-nav.js for navigation.
 */
window.ACADEMY_COURSES = {
  "claude-for-beginners": {
    slug: "claude-for-beginners",
    title: "Claude for Beginners",
    lessons: [
      { slug: "what-claude-can-do", title: "What Claude Can Do For You" },
      { slug: "your-first-conversation", title: "Your First Conversation" },
      { slug: "basics-quiz", title: "Check Your Understanding" },
      { slug: "email-calendar-magic", title: "Email & Calendar Magic" },
      { slug: "documents-and-data", title: "Documents & Data" },
      { slug: "workflow-quiz", title: "Workflow Knowledge Check" },
      { slug: "custom-instructions", title: "Custom Instructions & Memory" },
      { slug: "build-your-assistant", title: "Build Your Personal Assistant" },
      { slug: "final-assessment", title: "Final Assessment" }
    ]
  },
  "ai-foundations": {
    slug: "ai-foundations",
    title: "AI Foundations",
    lessons: [
      { slug: "what-is-a-neuron", title: "What Is a Neuron?" },
      { slug: "build-a-network", title: "Build a Network" },
      { slug: "neural-net-quiz", title: "Neural Net Quiz" },
      { slug: "anatomy-of-a-prompt", title: "Anatomy of a Prompt" },
      { slug: "prompt-playground", title: "Prompt Playground" },
      { slug: "prompt-battle", title: "Prompt Battle" },
      { slug: "words-as-numbers", title: "Words as Numbers" },
      { slug: "embedding-explorer", title: "Embedding Explorer" },
      { slug: "similarity-challenge", title: "Similarity Challenge" }
    ]
  },
  "ai-for-business": {
    slug: "ai-for-business",
    title: "AI for Business Owners",
    lessons: [
      { slug: "ai-without-jargon", title: "AI Without Jargon" },
      { slug: "what-ai-can-and-cannot-do", title: "What AI Can and Cannot Do" },
      { slug: "the-roi-calculator", title: "The ROI Calculator" },
      { slug: "find-your-ai-opportunities", title: "Find Your AI Opportunities" },
      { slug: "build-vs-buy", title: "Build vs Buy" },
      { slug: "ai-tools-landscape", title: "AI Tools Landscape" },
      { slug: "your-first-week-with-ai", title: "Your First Week with AI" },
      { slug: "ai-policy-template", title: "AI Policy Template" },
      { slug: "measuring-ai-success", title: "Measuring AI Success" },
      { slug: "business-ai-quiz", title: "Business AI Quiz" }
    ]
  },
  "claude-mastery": {
    slug: "claude-mastery",
    title: "Claude Mastery",
    lessons: [
      { slug: "meet-claude", title: "Meet Claude" },
      { slug: "context-window-explorer", title: "Context Window" },
      { slug: "temperature-lab", title: "Temperature Lab" },
      { slug: "system-prompts", title: "System Prompts" },
      { slug: "chain-of-thought", title: "Chain of Thought" },
      { slug: "few-shot-mastery", title: "Few-Shot Prompting" },
      { slug: "prompt-engineering-game", title: "Prompt Game" },
      { slug: "tool-use-basics", title: "Tool Use" },
      { slug: "mcp-servers", title: "MCP Servers" },
      { slug: "building-agents", title: "Building Agents" }
    ]
  },
  "automation-architect": {
    slug: "automation-architect",
    title: "Automation Architect",
    lessons: [
      { slug: "triggers-and-actions", title: "Triggers and Actions" },
      { slug: "your-first-automation", title: "Your First Automation" },
      { slug: "automation-quiz", title: "Automation Quiz" },
      { slug: "what-is-an-api", title: "What Is an API?" },
      { slug: "api-playground", title: "API Playground" },
      { slug: "api-quiz", title: "API Quiz" },
      { slug: "smart-routing", title: "Smart Routing" },
      { slug: "build-ai-workflow", title: "Build AI Workflow" },
      { slug: "workflow-quiz", title: "Workflow Quiz" }
    ]
  },
  "first-ai-agent": {
    slug: "first-ai-agent",
    title: "Build Your First AI Agent",
    lessons: [
      { slug: "chatbot-vs-agent", title: "Chatbot vs Agent" },
      { slug: "the-agent-loop", title: "The Agent Loop" },
      { slug: "tools-and-capabilities", title: "Tools and Capabilities" },
      { slug: "design-your-agent", title: "Design Your Agent" },
      { slug: "the-system-prompt", title: "The System Prompt" },
      { slug: "memory-matters", title: "Memory Matters" },
      { slug: "tool-calling-basics", title: "Tool Calling Basics" },
      { slug: "error-handling", title: "Error Handling" },
      { slug: "evaluating-your-agent", title: "Evaluating Your Agent" },
      { slug: "agent-quiz", title: "Agent Quiz" }
    ]
  },
  "ai-stack-builder": {
    slug: "ai-stack-builder",
    title: "AI Stack Builder",
    lessons: [
      { slug: "stack-anatomy", title: "Stack Anatomy" },
      { slug: "supabase-101", title: "Supabase 101" },
      { slug: "make-com-101", title: "Make.com 101" },
      { slug: "edge-functions", title: "Edge Functions" },
      { slug: "webhooks-deep-dive", title: "Webhooks Deep Dive" },
      { slug: "auth-and-tokens", title: "Auth and Tokens" },
      { slug: "database-patterns", title: "Database Patterns" },
      { slug: "vercel-deploy", title: "Vercel Deploy" },
      { slug: "wire-it-all", title: "Wire It All" },
      { slug: "launch-checklist", title: "Launch Checklist" }
    ]
  },
  "mcp-masterclass": {
    slug: "mcp-masterclass",
    title: "MCP & AI Tool Integration",
    lessons: [
      { slug: "what-is-mcp", title: "What Is MCP?" },
      { slug: "mcp-architecture", title: "MCP Architecture" },
      { slug: "servers-vs-tools", title: "Servers vs Tools" },
      { slug: "your-first-server", title: "Your First Server" },
      { slug: "tool-definitions", title: "Tool Definitions" },
      { slug: "resources-and-prompts", title: "Resources and Prompts" },
      { slug: "connecting-to-claude", title: "Connecting to Claude" },
      { slug: "real-world-servers", title: "Real-World Servers" },
      { slug: "security-and-best-practices", title: "Security and Best Practices" },
      { slug: "mcp-quiz", title: "MCP Quiz" }
    ]
  },
  "rag-vector-search": {
    slug: "rag-vector-search",
    title: "RAG & Vector Search",
    lessons: [
      { slug: "what-are-embeddings", title: "What Are Embeddings?" },
      { slug: "vector-databases-101", title: "Vector Databases 101" },
      { slug: "chunking-strategies", title: "Chunking Strategies" },
      { slug: "the-rag-loop", title: "The RAG Loop" },
      { slug: "build-your-first-rag", title: "Build Your First RAG" },
      { slug: "prompt-augmentation", title: "Prompt Augmentation" },
      { slug: "hybrid-search", title: "Hybrid Search" },
      { slug: "evaluation-metrics", title: "Evaluation Metrics" },
      { slug: "advanced-patterns", title: "Advanced Patterns" },
      { slug: "rag-quiz", title: "RAG Quiz" }
    ]
  },
  "the-automation-lab": {
    slug: "the-automation-lab",
    title: "The Automation Lab",
    lessons: [
      { slug: "what-is-an-agent", title: "What Is an Agent?" },
      { slug: "agent-anatomy", title: "Agent Anatomy" },
      { slug: "memory-systems", title: "Memory Systems" },
      { slug: "agent-communication", title: "Agent Communication" },
      { slug: "orchestration-patterns", title: "Orchestration Patterns" },
      { slug: "conflict-resolution", title: "Conflict Resolution" },
      { slug: "build-a-team", title: "Build a Team" },
      { slug: "cron-and-scheduling", title: "Cron and Scheduling" },
      { slug: "monitoring-and-healing", title: "Monitoring and Healing" },
      { slug: "the-conscience-layer", title: "The Conscience Layer" }
    ]
  }
};
