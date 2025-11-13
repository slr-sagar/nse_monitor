import type { NextApiRequest, NextApiResponse } from 'next';
import { nseClient } from '@/lib/nseApi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const url = 'https://www.nseindia.com/api/NextApi/apiClient/indexTrackerApi?functionName=getIndicesHeatMap&&index=NIFTY%2050';
    const data = await nseClient.fetchData(url);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
