import { RealTimeValidationService } from '../../../app/services/real-time-validation';
import { ValidationError } from '../../../app/utils/errors';

describe('RealTimeValidationService', () => {
    describe('validateLaborRates', () => {
        it('should throw error for invalid labor rates', async () => {
            await expect(
                RealTimeValidationService.validateLaborRates(null)
            ).rejects.toThrow(ValidationError);
        });
    });
}); 