import path from 'path';
import fs from 'fs';

function loadCareerJson(filename: string): unknown {
  const filePath = path.join(__dirname, '../../resources/career', `${filename}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function getWorkExperience(): unknown {
  return loadCareerJson('work_experience');
}

export function getProjects(): unknown {
  return loadCareerJson('projects');
}

export function getCertifications(): unknown {
  return loadCareerJson('certifications');
}

export function getProfessionalSummary(): unknown {
  return loadCareerJson('professional_summary');
}

export function getSkills(): unknown {
  return loadCareerJson('skills');
}
