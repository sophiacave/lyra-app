import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getAgentStatus() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_AGENT_REGISTRY_ID,
    filter: {
      property: 'Status',
      select: { equals: 'Active' }
    },
    sorts: [{ property: 'Agent Name', direction: 'ascending' }]
  });

  return response.results.map(page => ({
    name: page.properties['Agent Name']?.title?.[0]?.plain_text || 'Unknown',
    role: page.properties['Role']?.select?.name || 'Unassigned',
    status: page.properties['Status']?.select?.name || 'Unknown',
    score: page.properties['Performance Score']?.number || 0
  }));
}

export async function getTasks(limit = 5) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_TASKS_ID,
    filter: {
      property: 'Status',
      select: { does_not_equal: 'Done' }
    },
    page_size: limit,
    sorts: [{ property: 'Priority', direction: 'ascending' }]
  });

  return response.results.map(page => ({
    id: page.id,
    title: page.properties['Task Name']?.title?.[0]?.plain_text || 'Untitled',
    status: page.properties['Status']?.select?.name || 'Unknown',
    priority: page.properties['Priority']?.select?.name || 'Normal'
  }));
}

export async function getFinancialGoals() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_FINANCIAL_GOALS_ID
  });

  return response.results.map(page => ({
    name: page.properties['Goal Name']?.title?.[0]?.plain_text || 'Unknown',
    target: page.properties['Target Amount']?.number || 0,
    current: page.properties['Current Amount']?.number || 0,
    status: page.properties['Status']?.select?.name || 'Unknown'
  }));
}

export async function logWin(text) {
  return notion.pages.create({
    parent: { database_id: process.env.NOTION_WINS_WALL_ID },
    properties: {
      'Win': { title: [{ text: { content: text } }] },
      'Date': { date: { start: new Date().toISOString().split('T')[0] } }
    }
  });
}

export async function logIdea(text) {
  return notion.pages.create({
    parent: { database_id: process.env.NOTION_IDEA_GARDEN_ID },
    properties: {
      'Idea': { title: [{ text: { content: text } }] },
      'Status': { select: { name: 'Seed' } }
    }
  });
}

export async function createTask(title, priority = 'Normal') {
  return notion.pages.create({
    parent: { database_id: process.env.NOTION_TASKS_ID },
    properties: {
      'Task Name': { title: [{ text: { content: title } }] },
      'Status': { select: { name: 'To Do' } },
      'Priority': { select: { name: priority } }
    }
  });
}

export default notion;
