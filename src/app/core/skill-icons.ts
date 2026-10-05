import { Skill, SkillCategory } from './models';

/** An icon reference: a Simple Icons brand key or a Material Symbol name. */
export interface IconRef {
  brand?: string;
  symbol?: string;
}

/** Category glyphs — also the fallback for skills without their own mark. */
export const CATEGORY_ICONS: Record<SkillCategory, string> = {
  Languages: 'code',
  Frontend: 'web',
  Backend: 'dns',
  Cloud: 'cloud',
  Data: 'database',
  Tools: 'construction',
  Design: 'palette'
};

/**
 * Per-skill icon. Brand marks where Simple Icons ships one; otherwise a
 * Material Symbol that names the concept. Unlisted skills fall back to their
 * category glyph. New brands/symbols must also be added to scripts/gen-icons.mjs.
 */
const SKILL_ICONS: Record<string, IconRef> = {
  'sk-csharp': { symbol: 'tag' },
  'sk-typescript': { brand: 'typescript' },
  'sk-javascript': { brand: 'javascript' },
  'sk-dart': { brand: 'dart' },
  'sk-sql': { symbol: 'table_view' },
  'sk-cpp': { brand: 'cplusplus' },
  'sk-angular': { brand: 'angular' },
  'sk-ng-material': { symbol: 'widgets' },
  'sk-primeng': { brand: 'primeng' },
  'sk-tailwind': { brand: 'tailwindcss' },
  'sk-blazor': { brand: 'blazor' },
  'sk-mudblazor': { symbol: 'dashboard' },
  'sk-telerik': { brand: 'progress' },
  'sk-flutter': { brand: 'flutter' },
  'sk-bootstrap': { brand: 'bootstrap' },
  'sk-react': { brand: 'react' },
  'sk-html5': { brand: 'html5' },
  'sk-css': { brand: 'css' },
  'sk-dotnet': { brand: 'dotnet' },
  'sk-aspnet-core': { brand: 'dotnet' },
  'sk-aspnet-mvc': { brand: 'dotnet' },
  'sk-webapi': { symbol: 'api' },
  'sk-ef': { brand: 'dotnet' },
  'sk-ddd': { symbol: 'hub' },
  'sk-clean-arch': { symbol: 'layers' },
  'sk-microservices': { symbol: 'apps' },
  'sk-event-driven': { symbol: 'bolt' },
  'sk-nservicebus': { symbol: 'swap_horiz' },
  'sk-kafka': { brand: 'apachekafka' },
  'sk-ireb': { symbol: 'assignment' },
  'sk-er-modeling': { symbol: 'schema' },
  'sk-aws': { symbol: 'cloud' },
  'sk-azure': { symbol: 'cloud_circle' },
  'sk-docker': { brand: 'docker' },
  'sk-kubernetes': { brand: 'kubernetes' },
  'sk-helm': { brand: 'helm' },
  'sk-terraform': { brand: 'terraform' },
  'sk-gitlab': { brand: 'gitlab' },
  'sk-github-actions': { brand: 'githubactions' },
  'sk-azure-devops': { symbol: 'all_inclusive' },
  'sk-git': { brand: 'git' },
  'sk-sonarqube': { brand: 'sonar' },
  'sk-grafana': { brand: 'grafana' },
  'sk-keycloak': { brand: 'keycloak' },
  'sk-firebase': { brand: 'firebase' },
  'sk-mssql': { symbol: 'database' },
  'sk-mysql': { brand: 'mysql' },
  'sk-mongodb': { brand: 'mongodb' },
  'sk-ravendb': { symbol: 'database' },
  'sk-firestore': { brand: 'firebase' },
  'sk-aws-rds': { symbol: 'storage' },
  'sk-appwrite': { brand: 'appwrite' },
  'sk-visualstudio': { symbol: 'integration_instructions' },
  'sk-vscode': { symbol: 'code_blocks' },
  'sk-rider': { brand: 'rider' },
  'sk-postman': { brand: 'postman' },
  'sk-figma': { brand: 'figma' },
  'sk-uiux': { symbol: 'design_services' },
  'sk-jira': { brand: 'jira' },
  'sk-confluence': { brand: 'confluence' },
  'sk-miro': { brand: 'miro' },
  'sk-agile': { symbol: 'sprint' },
  'sk-azure-openai': { symbol: 'smart_toy' },
  'sk-azure-ai-search': { symbol: 'manage_search' },
  'sk-ms-agent-framework': { symbol: 'smart_toy' },
  'sk-mcp': { brand: 'modelcontextprotocol' },
  'sk-weaviate': { symbol: 'hexagon' },
  'sk-claude-code': { brand: 'claude' },
  'sk-mermaid': { brand: 'mermaid' },
  'sk-xcode': { brand: 'xcode' },
  'sk-devexpress': { brand: 'devexpress' },
  'sk-rxjs': { brand: 'reactivex' },
  'sk-msmq': { symbol: 'move_to_inbox' },
  'sk-adyen': { brand: 'adyen' },
  'sk-material-design': { brand: 'materialdesign' }
};

export function skillIcon(skill: Skill): IconRef {
  return SKILL_ICONS[skill.id] ?? { symbol: CATEGORY_ICONS[skill.category] };
}
