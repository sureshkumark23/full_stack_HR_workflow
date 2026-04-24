import { AutomationOption } from '@/types/workflow.types';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getAutomations = async (): Promise<AutomationOption[]> => {
  await delay(300);
  return [
    { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
    { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
    { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
    { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary', 'priority'] },
    { id: 'update_hris', label: 'Update HRIS Record', params: ['employeeId', 'field', 'value'] },
  ];
};
