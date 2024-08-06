import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { token } = await request.json();
    const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error('reCAPTCHA secret key is not set');
      return NextResponse.json({ success: false, message: 'reCAPTCHA configuration error' }, { status: 500 });
    }
    
    console.log('Sending request to reCAPTCHA API with token:', token.substring(0, 20) + '...');
    
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    console.log('Full reCAPTCHA API response:', JSON.stringify(response.data, null, 2));

    const { success, score, 'error-codes': errorCodes } = response.data;

    if (success && score > 0.5) {
      return NextResponse.json({ success: true, score, errorCodes });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'reCAPTCHA verification failed',
        score,
        errorCodes 
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