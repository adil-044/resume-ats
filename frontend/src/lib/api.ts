const getBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:9000';
  // Remove trailing slash if present
  const cleanUrl = envUrl.replace(/\/$/, '');
  // Ensure /api/v1 is present
  return cleanUrl.includes('/api/v1') ? cleanUrl : `${cleanUrl}/api/v1`;
};

const API_BASE_URL = getBaseUrl();

export async function analyzeResume(file: File, jobDescription: string) {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('job_description', jobDescription);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze resume');
  }

  return response.json();
}

export async function getAnalysis(taskId: string) {
  const response = await fetch(`${API_BASE_URL}/analysis/${taskId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch analysis');
  }

  return response.json();
}

export async function optimizeResume(resumeText: string, jobDescription: string) {
  const formData = new FormData();
  formData.append('resume_text', resumeText);
  formData.append('job_description', jobDescription);

  const response = await fetch(`${API_BASE_URL}/optimize`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to optimize resume');
  }

  return response.json();
}

export async function getGapQuestions(taskId: string, resumeText?: string, jobDescription?: string) {
  const formData = new FormData();
  formData.append('task_id', taskId);
  if (resumeText) formData.append('resume_text', resumeText);
  if (jobDescription) formData.append('job_description', jobDescription);

  const response = await fetch(`${API_BASE_URL}/bridge-gap/questions`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch gap questions');
  }

  return response.json();
}

export async function bridgeGapOptimize(taskId: string, answers: string) {
  const response = await fetch(`${API_BASE_URL}/bridge-gap/optimize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ task_id: taskId, answers }),
  });

  if (!response.ok) {
    throw new Error('Failed to perform bridge-gap optimization');
  }

  return response.json();
}

export async function exportResume(markdown: string) {
  const response = await fetch(`${API_BASE_URL}/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ markdown }),
  });

  if (!response.ok) {
    throw new Error('Failed to export PDF');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ATS_Optimized_Resume.pdf';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}
