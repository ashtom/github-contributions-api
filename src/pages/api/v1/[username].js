import { fetchDataForLastYear } from '../../../utils/api/fetch'

export default async (req, res) => {
  const { username, format } = req.query;
  const data = await fetchDataForLastYear(username, format);
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  res.json(data);
}