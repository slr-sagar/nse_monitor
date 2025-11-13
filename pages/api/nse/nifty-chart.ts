import type { NextApiRequest, NextApiResponse } from 'next';
import { nseClient } from '@/lib/nseApi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { period = '1D' } = req.query;

  try {
    const url = `https://www.nseindia.com/api/chart-databyindex?index=NIFTY%2050&indices=true`;
    const data = await nseClient.fetchData(url);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
