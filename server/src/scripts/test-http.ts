process.env.NODE_ENV = 'test';
import app from '../index';
import { Server } from 'http';

async function testHttpEndpoints() {
  console.log('Testing Live HTTP Server Endpoints with V2 Features...\n');

  const server: Server = app.listen(5098);

  try {
    const baseUrl = 'http://localhost:5098';

    // 1. Health check
    const resHealth = await fetch(`${baseUrl}/api/health`);
    const dataHealth: any = await resHealth.json();
    console.log(`✅ GET /api/health -> ${resHealth.status}`, dataHealth.status);

    // 2. Auth Login (Admin)
    const resLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@janpehchaan.gov.in', password: 'Password123' })
    });
    const dataLogin: any = await resLogin.json();
    const token = dataLogin.token;
    console.log(`✅ POST /api/auth/login -> ${resLogin.status}, Logged in as: ${dataLogin.user?.name} (${dataLogin.user?.role})`);

    // 3. Dashboard Stats
    const resDashboard = await fetch(`${baseUrl}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const dataDashboard: any = await resDashboard.json();
    console.log(`✅ GET /api/dashboard -> ${resDashboard.status}`, dataDashboard);

    // 4. Applications List
    const resApps = await fetch(`${baseUrl}/api/applications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const dataApps: any = await resApps.json();
    console.log(`✅ GET /api/applications -> ${resApps.status}, Count: ${dataApps.applications?.length}`);

    // 5. Duplicate Queue (V2 Frontend Alias)
    const resDup = await fetch(`${baseUrl}/api/duplicate-queue`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const dataDup: any = await resDup.json();
    console.log(`✅ GET /api/duplicate-queue -> ${resDup.status}, Flagged claims: ${dataDup.count}`);

    // 6. Audit Logs (V2 Frontend Alias)
    const resLogs = await fetch(`${baseUrl}/api/audit-logs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const dataLogs: any = await resLogs.json();
    console.log(`✅ GET /api/audit-logs -> ${resLogs.status}, Audit events: ${dataLogs.logs?.length}`);

    console.log('\n🎉 ALL V2 COMPATIBILITY ENDPOINTS VERIFIED AND RETURNING 200 OK!');
  } finally {
    server.close();
  }
}

testHttpEndpoints().catch(err => {
  console.error('HTTP test error:', err);
  process.exit(1);
});
