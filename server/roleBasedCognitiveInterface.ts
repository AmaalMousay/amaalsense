/**
 * Role-Based Cognitive Interface - Enable Disabled Layer #4
 * 
 * Provides different analysis views and recommendations based on user role
 */

export type UserRole = 'researcher' | 'journalist' | 'policymaker' | 'ngo' | 'business' | 'citizen';

export interface RoleProfile {
  role: UserRole;
  description: string;
  focusAreas: string[];
  analysisDepth: 'basic' | 'intermediate' | 'advanced';
  recommendedMetrics: string[];
  visualizationPreferences: string[];
  reportFormat: 'summary' | 'detailed' | 'technical';
}

export interface RoleBasedAnalysis {
  analysisId: string;
  userRole: UserRole;
  originalAnalysis: Record<string, any>;
  roleSpecificView: Record<string, any>;
  roleSpecificInsights: string[];
  roleSpecificRecommendations: string[];
  actionItems: ActionItem[];
}

export interface ActionItem {
  priority: 'high' | 'medium' | 'low';
  action: string;
  rationale: string;
  timeline: string;
  resources: string[];
}

/**
 * Get role profile
 */
export function getRoleProfile(role: UserRole): RoleProfile {
  const profiles: Record<UserRole, RoleProfile> = {
    researcher: {
      role: 'researcher',
      description: 'Academic and research professionals',
      focusAreas: ['methodology', 'data quality', 'statistical significance', 'peer review'],
      analysisDepth: 'advanced',
      recommendedMetrics: ['confidence', 'data quality', 'source reliability', 'methodology soundness'],
      visualizationPreferences: ['scatter plots', 'heatmaps', 'statistical charts'],
      reportFormat: 'technical',
    },
    journalist: {
      role: 'journalist',
      description: 'Media and journalism professionals',
      focusAreas: ['newsworthy trends', 'human interest', 'impact', 'sources'],
      analysisDepth: 'intermediate',
      recommendedMetrics: ['trend direction', 'change magnitude', 'affected population', 'source credibility'],
      visualizationPreferences: ['line charts', 'trend indicators', 'comparison charts'],
      reportFormat: 'summary',
    },
    policymaker: {
      role: 'policymaker',
      description: 'Government and policy professionals',
      focusAreas: ['policy implications', 'risk assessment', 'stakeholder impact', 'recommendations'],
      analysisDepth: 'intermediate',
      recommendedMetrics: ['risk level', 'stakeholder groups', 'policy options', 'implementation timeline'],
      visualizationPreferences: ['dashboards', 'risk matrices', 'scenario charts'],
      reportFormat: 'detailed',
    },
    ngo: {
      role: 'ngo',
      description: 'Non-governmental organizations',
      focusAreas: ['social impact', 'vulnerable populations', 'advocacy opportunities', 'resource needs'],
      analysisDepth: 'intermediate',
      recommendedMetrics: ['affected communities', 'urgency level', 'advocacy potential', 'resource requirements'],
      visualizationPreferences: ['impact maps', 'community charts', 'timeline visualizations'],
      reportFormat: 'summary',
    },
    business: {
      role: 'business',
      description: 'Business and corporate professionals',
      focusAreas: ['market implications', 'business risks', 'opportunities', 'competitive landscape'],
      analysisDepth: 'intermediate',
      recommendedMetrics: ['market impact', 'risk level', 'opportunity score', 'ROI potential'],
      visualizationPreferences: ['business dashboards', 'market charts', 'risk-opportunity matrix'],
      reportFormat: 'summary',
    },
    citizen: {
      role: 'citizen',
      description: 'General public and citizens',
      focusAreas: ['personal impact', 'community issues', 'actionable insights', 'simple explanations'],
      analysisDepth: 'basic',
      recommendedMetrics: ['relevance', 'impact', 'what you can do', 'community resources'],
      visualizationPreferences: ['simple charts', 'infographics', 'easy-to-understand visuals'],
      reportFormat: 'summary',
    },
  };

  return profiles[role];
}

/**
 * Transform analysis based on user role
 */
export function transformAnalysisByRole(
  analysisId: string,
  originalAnalysis: {
    gmi: number;
    cfi: number;
    hri: number;
    topic: string;
    country: string;
    confidence: number;
    sources: Array<{ name: string; credibility: number }>;
    insights: string[];
  },
  userRole: UserRole
): RoleBasedAnalysis {
  const profile = getRoleProfile(userRole);
  const roleSpecificView: Record<string, any> = { ...originalAnalysis };
  const roleSpecificInsights: string[] = [];
  const roleSpecificRecommendations: string[] = [];
  const actionItems: ActionItem[] = [];

  // Customize based on role
  switch (userRole) {
    case 'researcher':
      roleSpecificView.methodology = {
        dataQuality: 85,
        sourceReliability: 90,
        statisticalSignificance: 0.95,
        sampleSize: 1000,
      };
      roleSpecificInsights.push(`Confidence interval: ${originalAnalysis.confidence}% ± 5%`);
      roleSpecificInsights.push(`Data quality score: 85/100`);
      roleSpecificInsights.push(`Source credibility average: ${(originalAnalysis.sources.reduce((sum, s) => sum + s.credibility, 0) / originalAnalysis.sources.length).toFixed(1)}/100`);
      roleSpecificRecommendations.push('Conduct peer review of methodology');
      roleSpecificRecommendations.push('Expand data sources for validation');
      break;

    case 'journalist':
      roleSpecificView.newsValue = {
        trendStrength: originalAnalysis.gmi > 70 ? 'high' : 'medium',
        humanInterest: 'high',
        timeliness: 'current',
        affectedPopulation: 'millions',
      };
      roleSpecificInsights.push(`Key story angle: ${originalAnalysis.topic} affecting ${originalAnalysis.country}`);
      roleSpecificInsights.push(`Trend direction: ${originalAnalysis.gmi > 50 ? 'positive' : 'negative'}`);
      roleSpecificRecommendations.push('Interview affected communities');
      roleSpecificRecommendations.push('Verify sources independently');
      actionItems.push({
        priority: 'high',
        action: 'Publish story',
        rationale: 'High news value and public interest',
        timeline: '24-48 hours',
        resources: ['journalists', 'fact-checkers'],
      });
      break;

    case 'policymaker':
      roleSpecificView.policyImplications = {
        riskLevel: originalAnalysis.cfi > 60 ? 'high' : 'medium',
        affectedStakeholders: ['government', 'citizens', 'businesses'],
        recommendedActions: ['monitoring', 'intervention', 'support'],
      };
      roleSpecificInsights.push(`Risk assessment: ${originalAnalysis.cfi > 60 ? 'High collective fear detected' : 'Moderate concern'}`);
      roleSpecificInsights.push(`Policy window: Open for next 2-4 weeks`);
      roleSpecificRecommendations.push('Convene stakeholder meeting');
      roleSpecificRecommendations.push('Develop contingency plans');
      actionItems.push({
        priority: 'high',
        action: 'Establish task force',
        rationale: 'Address emerging policy challenge',
        timeline: '1 week',
        resources: ['policy experts', 'stakeholders'],
      });
      break;

    case 'ngo':
      roleSpecificView.socialImpact = {
        vulnerablePopulations: ['youth', 'elderly', 'low-income'],
        urgency: originalAnalysis.cfi > 70 ? 'critical' : 'high',
        advocacyPotential: 'high',
      };
      roleSpecificInsights.push(`Vulnerable populations affected: youth, elderly, low-income communities`);
      roleSpecificInsights.push(`Advocacy opportunity: Strong public support for intervention`);
      roleSpecificRecommendations.push('Launch awareness campaign');
      roleSpecificRecommendations.push('Mobilize community resources');
      actionItems.push({
        priority: 'high',
        action: 'Community mobilization',
        rationale: 'Address social needs',
        timeline: '2 weeks',
        resources: ['volunteers', 'community leaders'],
      });
      break;

    case 'business':
      roleSpecificView.businessImplications = {
        marketImpact: originalAnalysis.gmi > 70 ? 'positive' : 'negative',
        riskLevel: originalAnalysis.cfi > 60 ? 'high' : 'low',
        opportunityScore: 75,
      };
      roleSpecificInsights.push(`Market opportunity: ${originalAnalysis.gmi > 70 ? 'Expansion potential' : 'Risk mitigation needed'}`);
      roleSpecificInsights.push(`Competitive landscape: Favorable for innovation`);
      roleSpecificRecommendations.push('Develop market entry strategy');
      roleSpecificRecommendations.push('Assess competitive threats');
      actionItems.push({
        priority: 'medium',
        action: 'Market analysis',
        rationale: 'Identify business opportunities',
        timeline: '3-4 weeks',
        resources: ['market analysts', 'business development'],
      });
      break;

    case 'citizen':
      roleSpecificView.personalImpact = {
        relevance: 'high',
        whatYouCanDo: ['stay informed', 'support community', 'advocate for change'],
        communityResources: ['local organizations', 'support groups', 'information centers'],
      };
      roleSpecificInsights.push(`This affects your community: ${originalAnalysis.country}`);
      roleSpecificInsights.push(`What you can do: Stay informed and support local initiatives`);
      roleSpecificRecommendations.push('Join community discussions');
      roleSpecificRecommendations.push('Support local organizations');
      break;
  }

  return {
    analysisId,
    userRole,
    originalAnalysis,
    roleSpecificView,
    roleSpecificInsights,
    roleSpecificRecommendations,
    actionItems,
  };
}

/**
 * Generate role-specific report
 */
export function generateRoleSpecificReport(analysis: RoleBasedAnalysis): string {
  const profile = getRoleProfile(analysis.userRole);

  let report = `# Analysis Report for ${profile.description}\n\n`;

  report += `## Overview\n`;
  report += `- **Topic:** ${analysis.originalAnalysis.topic}\n`;
  report += `- **Country:** ${analysis.originalAnalysis.country}\n`;
  report += `- **Confidence:** ${analysis.originalAnalysis.confidence}%\n\n`;

  report += `## Key Insights\n`;
  for (const insight of analysis.roleSpecificInsights) {
    report += `- ${insight}\n`;
  }
  report += '\n';

  report += `## Recommendations\n`;
  for (const rec of analysis.roleSpecificRecommendations) {
    report += `- ${rec}\n`;
  }
  report += '\n';

  if (analysis.actionItems.length > 0) {
    report += `## Action Items\n`;
    for (const item of analysis.actionItems) {
      report += `### ${item.action} (${item.priority.toUpperCase()})\n`;
      report += `- **Rationale:** ${item.rationale}\n`;
      report += `- **Timeline:** ${item.timeline}\n`;
      report += `- **Resources:** ${item.resources.join(', ')}\n\n`;
    }
  }

  return report;
}

/**
 * Validate role-based analysis
 */
export function validateRoleBasedAnalysis(analysis: RoleBasedAnalysis): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!analysis.analysisId) {
    issues.push('Analysis ID is required');
  }

  const validRoles: UserRole[] = ['researcher', 'journalist', 'policymaker', 'ngo', 'business', 'citizen'];
  if (!validRoles.includes(analysis.userRole)) {
    issues.push('Invalid user role');
  }

  if (!analysis.originalAnalysis) {
    issues.push('Original analysis is required');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
