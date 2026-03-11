import { NextResponse } from 'next/server';
import { getAgentStatus, getTasks, getFinancialGoals, logWin, logIdea, createTask } from '@/lib/notion';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const pin = searchParams.get('pin');

  if (pin !== process.env.LYRA_PIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    switch (action) {
      case 'agents':
        const agents = await getAgentStatus();
        return NextResponse.json({ agents });

      case 'tasks':
        const tasks = await getTasks();
        return NextResponse.json({ tasks });

      case 'goals':
        const goals = await getFinancialGoals();
        return NextResponse.json({ goals });

      case 'briefing':
        const [briefAgents, briefTasks, briefGoals] = await Promise.all([
          getAgentStatus(),
          getTasks(3),
          getFinancialGoals()
        ]);
        return NextResponse.json({
          agents: briefAgents.length,
          priorities: briefTasks,
          goals: briefGoals,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  const { action, data, pin } = body;

  if (pin !== process.env.LYRA_PIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    switch (action) {
      case 'log_win':
        await logWin(data);
        return NextResponse.json({ success: true, message: 'Win logged! Keep building.' });

      case 'log_idea':
        await logIdea(data);
        return NextResponse.json({ success: true, message: 'Idea planted in the garden.' });

      case 'create_task':
        await createTask(data.title, data.priority);
        return NextResponse.json({ success: true, message: 'Task created.' });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
