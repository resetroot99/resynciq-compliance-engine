import { rest } from 'msw';
import { CONFIG } from '../../app/config/config';

export const handlers = [
    rest.post(`${CONFIG.API_BASE_URL}/validate/labor-rates`, (req, res, ctx) => {
        return res(
            ctx.json({
                isValid: true,
                details: {}
            })
        );
    }),
    // Add other handlers...
]; 