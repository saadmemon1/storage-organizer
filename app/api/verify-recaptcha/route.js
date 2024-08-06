import { NextResponse } from 'next/server';
import axios from 'axios';

export default async function verifyRecaptcha(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
    
}
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

    

    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', params.toString(), {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
  });

    const data = response.data;

    console.log('Full reCAPTCHA API response:', JSON.stringify(data, null, 2));


    if (data.success && data.score > 0.5) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({
          success: false,
          message: 'reCAPTCHA verification failed',
          errorCodes: data['error-codes']  // Make sure to log or handle these error codes appropriately
      });
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.toString() });
    }
}

export async function GET() {
  return NextResponse.json({ message: 'This endpoint only accepts POST requests' }, { status: 405 });
}