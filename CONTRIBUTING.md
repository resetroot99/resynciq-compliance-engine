# Contributing to ReSyncIQ Compliance Engine

Thank you for your interest in contributing to ReSyncIQ! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code.

## How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

### Pull Request Process

1. Update documentation
2. Add tests for new features
3. Ensure CI passes
4. Get review from maintainers

### Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
```

### Coding Standards

- Use ESLint configuration
- Follow existing code style
- Write meaningful commit messages
- Add JSDoc comments
- Keep functions small and focused

### Testing

- Write unit tests for new features
- Maintain test coverage
- Test edge cases
- Run full test suite before submitting PR

## License

By contributing, you agree that your contributions will be licensed under the project's license.

## AI Component Development

### Model Training
1. Place new model training scripts in `ai-service/training`
2. Use the provided training pipeline for consistency
3. Document model versions and changes in `MODELS.md`

### Model Deployment
1. Update the model version in `.env`
2. Run the deployment script: `npm run deploy`
3. Verify model status: `npm run check-models`

### Testing AI Components
1. Write unit tests for AI service endpoints
2. Use the provided test data in `test-data/ai`
3. Verify model accuracy and performance

## Core Principles
1. **Proactive, Not Reactive** – AI doesn't just flag issues; it auto-corrects them for approval.
2. **Insurer-Specific Customization** – The system must adapt to different insurer rules dynamically.
3. **First-Time Right** – The goal is to reduce rejections & resubmissions with predictive approval modeling.
4. **Seamless Automation** – Minimize human effort by making AI-driven auto-corrections intuitive.
5. **User-Centric** – The interface must be clear, professional, and frictionless for adjusters & repair shops.

## System Overview
ComplianceIQ revolutionizes insurance estimate review and compliance by integrating AI-driven automation with CCC ONE APIs. Our web-based Reviewer Dashboard offers automated corrections, real-time recommendations, and predictive approval insights, significantly reducing manual effort and improving accuracy. 