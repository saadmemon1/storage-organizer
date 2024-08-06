import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    try {
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
      );

      const { success, score } = response.data;

      if (success && score > 0.5) {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error verifying reCAPTCHA' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}