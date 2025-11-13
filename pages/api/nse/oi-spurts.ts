import type { NextApiRequest, NextApiResponse } from 'next';
import { nseClient, NSE_ENDPOINTS } from '@/lib/nseApi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await nseClient.fetchData(NSE_ENDPOINTS.OI_SPURTS);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
