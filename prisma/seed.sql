-- Initial compliance rules
INSERT INTO "ComplianceRule" (
  id, name, description, category, severity, parameters, active, "createdAt", "updatedAt"
) VALUES (
  'rule_labor_rate',
  'Labor Rate Compliance',
  'Validates labor rates against regional standards',
  'PRICING',
  'WARNING',
  '{"maxDeviation": 0.15, "regionalRates": {"bodywork": 65, "paint": 72, "mechanical": 85}}',
  true,
  NOW(),
  NOW()
);

-- Add more rules as needed 