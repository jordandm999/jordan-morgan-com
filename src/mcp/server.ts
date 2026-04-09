import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { Express, Request, Response } from 'express';
import {
  getWorkExperience,
  getProjects,
  getCertifications,
  getProfessionalSummary,
  getSkills,
} from './tools/careerTools';

function createMcpServer(): McpServer {
  const server = new McpServer({
    name: 'jordan-career-mcp',
    version: '1.0.0',
  });

  server.tool('get_work_experience', "Get Jordan's work experience and job history", {}, async () => ({
    content: [{ type: 'text', text: JSON.stringify(getWorkExperience()) }],
  }));

  server.tool('get_projects', "Get information about Jordan's notable projects and achievements", {}, async () => ({
    content: [{ type: 'text', text: JSON.stringify(getProjects()) }],
  }));

  server.tool('get_certifications', "Get information about Jordan's professional certifications", {}, async () => ({
    content: [{ type: 'text', text: JSON.stringify(getCertifications()) }],
  }));

  server.tool("get_professional_summary", "Get Jordan's professional summary", {}, async () => ({
    content: [{ type: 'text', text: JSON.stringify(getProfessionalSummary()) }],
  }));

  server.tool('get_skills', "Get Jordan's technical and professional skills", {}, async () => ({
    content: [{ type: 'text', text: JSON.stringify(getSkills()) }],
  }));

  return server;
}

export function setupMcpServer(app: Express): void {
  const transports: Record<string, SSEServerTransport> = {};

  app.get('/api/mcp_server', async (_req: Request, res: Response) => {
    const transport = new SSEServerTransport('/api/mcp_server/messages', res);
    transports[transport.sessionId] = transport;

    res.on('close', () => {
      delete transports[transport.sessionId];
    });

    const server = createMcpServer();
    await server.connect(transport);
  });

  app.post('/api/mcp_server/messages', async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports[sessionId];
    if (transport) {
      await transport.handlePostMessage(req, res);
    } else {
      res.status(400).json({ error: 'Unknown session ID' });
    }
  });
}
