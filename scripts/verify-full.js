const axios = require('axios');

const BASE = 'http://localhost:5000/api';

(async () => {
  try {
    console.log('1) health');
    const health = await axios.get(`${BASE}/health`);
    console.log(health.data);

    console.log('2) templates');
    const templates = await axios.get(`${BASE}/templates`);
    console.log('templates count', templates.data.templates.length);

    const template = templates.data.templates[0];
    if (!template) {
      throw new Error('No templates returned.');
    }

    console.log('3) register/login');
    const username = `auto-${Date.now()}`;
    const email = `${username}@example.com`;
    const password = 'Pass123!';

    const reg = await axios.post(`${BASE}/auth/register`, { username, email, password });
    console.log('register', reg.data);

    const loginResponse = await axios.post(`${BASE}/auth/login`, { email, password });
    const token = loginResponse.data.accessToken;
    console.log('login', loginResponse.data.user.email);

    const auth = axios.create({ baseURL: BASE, headers: { Authorization: `Bearer ${token}` } });

    console.log('4) create project');
    const projectResp = await auth.post('/projects', { projectType: template.projectType, templateId: template._id });
    const project = projectResp.data.project;
    console.log('project created id', project._id, 'currentStage', project.currentStage);

    console.log('5) fetch project');
    const projectFetch = await auth.get(`/projects/${project._id}`);
    console.log('project fetched stage', projectFetch.data.project.currentStage);

    console.log('6) submit first stage');
    const submitResult = await auth.post(`/projects/${project._id}/stage/1`, { codeSnippet: 'console.log("test");' });
    console.log('submit result approved', submitResult.data.aiResult?.approved);

    console.log('7) stage post-check');
    const projectFinal = await auth.get(`/projects/${project._id}`);
    console.log('currentStage', projectFinal.data.project.currentStage, 'progress', projectFinal.data.project.progressPercentage);

    console.log('ALL tests passed ✅');
    process.exit(0);
  } catch (e) {
    if (e.response) {
      console.error('FAILED', e.response.status, e.response.data);
    } else {
      console.error('FAILED', e.message);
    }
    process.exit(1);
  }
})();