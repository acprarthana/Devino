const axios = require('axios');

const candidatePorts = [5000, 5001, 5002];
let baseURL = null;

const findServer = async () => {
  for (const port of candidatePorts) {
    try {
      const res = await axios.get(`http://localhost:${port}/api/health`, { timeout: 2000 });
      if (res.data && res.data.success) {
        baseURL = `http://localhost:${port}/api`;
        console.log(`✅ Backend reachable at http://localhost:${port}`);
        return;
      }
    } catch (err) {
      // console.log(`port ${port} failed`, err.message);
    }
  }
  throw new Error('Backend not reachable on ports 5000-5002');
};

const run = async () => {
  await findServer();

  console.log('\n1) /api/health');
  const health = await axios.get(`${baseURL}/health`);
  console.log(' -', health.data);

  console.log('\n2) /api/templates');
  const templatesRes = await axios.get(`${baseURL}/templates`);
  console.log(' - templates', templatesRes.data.templates.length);

  if (!templatesRes.data.templates.length) {
    throw new Error('No templates found; seeding required');
  }

  const template = templatesRes.data.templates[0];

  console.log('\n3) register / login');
  const stamp = Date.now();
  const email = `devino-${stamp}@example.com`;
  const password = 'Pass123!';

  await axios.post(`${baseURL}/auth/register`, { username: 'devino-test', email, password });
  const login = await axios.post(`${baseURL}/auth/login`, { email, password });
  const token = login.data?.accessToken;
  if (!token) throw new Error('login did not return accessToken');

  const auth = axios.create({ baseURL, headers: { Authorization: `Bearer ${token}` }});

  console.log(' - login success, user:', login.data.user.email);

  console.log('\n4) create project');
  const projectResp = await auth.post('/projects', {
    projectType: template.projectType,
    templateId: template._id,
  });
  const project = projectResp.data.project;
  console.log(` - created project ${project._id}, currentStage=${project.currentStage}
`);

  console.log('5) get project by id');
  const gotProject = await auth.get(`/projects/${project._id}`);
  console.log(' - project status', gotProject.data.project.currentStage);

  console.log('6) submit stage 1 code');
  const submitResp = await auth.post(`/projects/${project._id}/stage/1`, {
    codeSnippet: '// test code',
  });
  console.log(' - submission', submitResp.data.aiResult ? submitResp.data.aiResult.approved : 'no ai result');

  console.log('7) get updated project progress');
  const updated = await auth.get(`/projects/${project._id}`);
  console.log(' - after submit currentStage=', updated.data.project.currentStage, 'progress=', updated.data.project.progressPercentage);

  console.log('\n✅ All checks passed.');
};

run().catch((error) => {
  console.error('❌ verification failed:', error.message || error);
  process.exit(1);
});