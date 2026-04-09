import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import {
  getWorkExperience,
  getProjects,
  getCertifications,
  getProfessionalSummary,
  getSkills,
} from '../mcp/tools/careerTools';

export const chatRouter = Router();

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_work_experience',
      description: "Get Jordan's work experience and job history",
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_projects',
      description: "Get information about Jordan's notable projects and achievements",
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_certifications',
      description: "Get information about Jordan's professional certifications",
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_professional_summary',
      description: "Get Jordan's professional summary",
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_skills',
      description: "Get Jordan's technical and professional skills",
      parameters: { type: 'object', properties: {} },
    },
  },
];

const toolHandlers: Record<string, () => unknown> = {
  get_work_experience: getWorkExperience,
  get_projects: getProjects,
  get_certifications: getCertifications,
  get_professional_summary: getProfessionalSummary,
  get_skills: getSkills,
};

chatRouter.post('/chat', async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: 'No message provided' });
    return;
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'user', content: message },
  ];

  while (true) {
    const response = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages,
      tools,
    });

    const choice = response.choices[0];
    messages.push(choice.message);

    if (choice.finish_reason === 'stop') {
      res.json({ response: choice.message.content });
      return;
    }

    for (const toolCall of choice.message.tool_calls ?? []) {
      const handler = toolHandlers[toolCall.function.name];
      const result = handler ? handler() : { error: 'Unknown tool' };
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }
  }
});
