import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { token } = await request.json();
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error('reCAPTCHA secret key is not set');
      return NextResponse.json({ success: false, message: 'reCAPTCHA configuration error' }, { status: 500 });
    }
    
    console.log('Sending request to reCAPTCHA API with token:', token.substring(0, 20) + '...');
    
    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', token);

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await response.json();

    console.log('Full reCAPTCHA API response:', JSON.stringify(data, null, 2));


    if (data.success && data.score > 0.5) {
      return NextResponse.json({ success: true, score: data.score, errorCodes: data['error-codes'] });
    } else {
      return NextResponse.json({
        success: false,
        message: 'reCAPTCHA verification failed',
        score: data.score,
        errorCodes: data['error-codes']
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return NextResponse.json({
      success: false,
      message: 'Error verifying reCAPTCHA',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'This endpoint only accepts POST requests' }, { status: 405 });
}