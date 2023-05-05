import type {NextApiRequest, NextApiResponse} from 'next'
import {getAccessToken, withApiAuthRequired} from '@auth0/nextjs-auth0';
import axios, {AxiosError} from 'axios';

if (!process.env.API_KEY) throw new Error('Missing API_KEY')

export default withApiAuthRequired(
    async function handler(req: NextApiRequest, res: NextApiResponse) {
        try {
            const {accessToken} = await getAccessToken(req, res);
            // console.log(accessToken);
            // Todo: return 400 if missing param
            const query = req.body.query
            const response = await axios.post('https://ao2jyzs9o3.execute-api.eu-west-1.amazonaws.com/prod/recommendations', {query}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'x-api-key': process.env.API_KEY!
                }
            });

            res.status(200).json(response.data);
        } catch (e) {
            if (e instanceof AxiosError) console.log('AXIOS_ERROR:', e.code, e.response?.data);
            else console.log('REQUEST_ERROR', e);
            res.status(500).end();
        }
    }
);
