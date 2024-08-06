import { NextResponse } from 'next/server';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

export async function POST(req) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { token } = await req.json();

  const projectID = "storage-organizer";
  const recaptchaKey = process.env.RECAPTCHA_SECRET_KEY;
  const recaptchaAction = "submit";

  const client = new RecaptchaEnterpriseServiceClient();
  const projectPath = client.projectPath(projectID);

  const request = {
    assessment: {
      event: {
        token: token,
        siteKey: recaptchaKey,
      },
    },
    parent: projectPath,
  };

  try {
    const [response] = await client.createAssessment(request);

    if (!response.tokenProperties.valid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    if (response.tokenProperties.action !== recaptchaAction) {
      return NextResponse.json({ error: 'Action mismatch' }, { status: 400 });
    }

    return NextResponse.json({ score: response.riskAnalysis.score });
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}