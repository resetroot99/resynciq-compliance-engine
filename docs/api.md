# API Documentation

## Estimate Processing
- **POST** `/api/process`
  - Description: Process an estimate with AI.
  - Request Body:
    ```json
    {
      "estimateId": "12345",
      "insurerId": "GEICO"
    }
    ```
  - Response:
    ```json
    {
      "status": "success",
      "data": { ... }
    }
    ```

## Compliance Validation
- **POST** `/api/validate`
  - Description: Validate an estimate against insurer rules.
  - Request Body:
    ```json
    {
      "estimateId": "12345",
      "insurerId": "GEICO"
    }
    ```
  - Response:
    ```json
    {
      "status": "success",
      "data": { ... }
    }
    ``` 