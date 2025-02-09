class GeicoARXValidator {
    constructor() {
        this.validationRules = {
            // Labor Rate Guidelines
            laborRates: {
                body: 52.00,
                paint: 52.00,
                frame: 65.00,
                mechanical: 95.00,
                structural: 65.00
            },

            // Parts Usage Requirements
            partsUsage: {
                minAftermarket: 30, // 30% minimum aftermarket
                minRecycled: 15,    // 15% minimum recycled
                maxLKQ: 65,         // 65% maximum LKQ
                preferredVendors: ['CAPA', 'NSF', 'Diamond Standard']
            },

            // Operation Guidelines
            operations: {
                maxOverlap: 0.5,    // 50% maximum overlap
                blendWithin: 12,    // 12 inches for blend
                clearcoatEdging: true,
                requirePhotos: true
            },

            // Refinish Standards
            refinish: {
                threeStageMultiplier: 1.5,
                pearlMultiplier: 1.4,
                blendTime: 2.0,
                edgingTime: 0.5
            },

            // Documentation Requirements
            documentation: {
                requiredPhotos: [
                    'vin_plate',
                    'damage_front',
                    'damage_rear',
                    'damage_close',
                    'part_number'
                ],
                photoQuality: {
                    minResolution: '1280x720',
                    maxSize: 5000000, // 5MB
                    requiredFormat: ['jpg', 'png']
                }
            }
        };
    }

    async validateEstimate(estimate) {
        const validationResults = {
            isValid: true,
            violations: [],
            warnings: [],
            requiredChanges: []
        };

        // Run all validation checks
        await Promise.all([
            this.validateLaborRates(estimate, validationResults),
            this.validatePartsUsage(estimate, validationResults),
            this.validateOperations(estimate, validationResults),
            this.validateRefinish(estimate, validationResults),
            this.validateDocumentation(estimate, validationResults),
            this.validateStructuralOperations(estimate, validationResults),
            this.validateCorrosionProtection(estimate, validationResults),
            this.validateMeasurements(estimate, validationResults),
            this.validateScanRequirements(estimate, validationResults),
            this.validateCalibrationRequirements(estimate, validationResults),
            this.validateSafetySystemsRestoration(estimate, validationResults),
            this.validateRepairQuality(estimate, validationResults)
        ]);

        // Determine final validity
        validationResults.isValid = validationResults.violations.length === 0;

        return validationResults;
    }

    validateLaborRates(estimate, results) {
        Object.entries(estimate.laborRates).forEach(([type, rate]) => {
            const maxRate = this.validationRules.laborRates[type];
            if (rate > maxRate) {
                results.violations.push({
                    type: 'labor_rate',
                    severity: 'high',
                    message: `${type} labor rate exceeds maximum of $${maxRate}`,
                    current: rate,
                    required: maxRate
                });
            }
        });
    }

    validatePartsUsage(estimate, results) {
        const partsAnalysis = this.analyzePartsUsage(estimate.parts);
        const rules = this.validationRules.partsUsage;

        if (partsAnalysis.aftermarketPercent < rules.minAftermarket) {
            results.violations.push({
                type: 'parts_usage',
                severity: 'medium',
                message: `Aftermarket parts usage below required ${rules.minAftermarket}%`,
                current: partsAnalysis.aftermarketPercent,
                required: rules.minAftermarket
            });
        }

        // Check vendor compliance
        partsAnalysis.nonCompliantVendors.forEach(vendor => {
            results.warnings.push({
                type: 'vendor_compliance',
                message: `Non-preferred vendor used: ${vendor}`,
                recommendation: 'Use parts from approved vendors'
            });
        });
    }

    validateOperations(estimate, results) {
        estimate.operations.forEach(op => {
            // Check for required photos
            if (this.validationRules.operations.requirePhotos && !op.photos) {
                results.violations.push({
                    type: 'documentation',
                    severity: 'medium',
                    message: `Missing photos for operation: ${op.description}`,
                    required: 'Before/After photos'
                });
            }

            // Check overlap deductions
            if (op.type === 'refinish' && this.hasExcessiveOverlap(op)) {
                results.violations.push({
                    type: 'overlap',
                    severity: 'medium',
                    message: 'Excessive overlap time',
                    current: op.overlapHours,
                    maximum: this.calculateMaxOverlap(op)
                });
            }
        });
    }

    validateRefinish(estimate, results) {
        estimate.refinishOperations.forEach(op => {
            // Validate three-stage calculations
            if (op.isThreeStage && !this.validateThreeStage(op)) {
                results.violations.push({
                    type: 'refinish_calculation',
                    severity: 'medium',
                    message: 'Incorrect three-stage calculation',
                    required: 'Apply 1.5x multiplier to base refinish time'
                });
            }

            // Check blend requirements
            if (op.isBlend && !this.validateBlend(op)) {
                results.violations.push({
                    type: 'blend_requirements',
                    severity: 'medium',
                    message: 'Blend does not meet requirements',
                    details: this.getBlendRequirements()
                });
            }
        });
    }

    validateDocumentation(estimate, results) {
        const missingPhotos = this.checkRequiredPhotos(estimate.photos);
        if (missingPhotos.length > 0) {
            results.violations.push({
                type: 'missing_photos',
                severity: 'high',
                message: 'Missing required photos',
                missing: missingPhotos
            });
        }

        // Check photo quality
        estimate.photos.forEach(photo => {
            if (!this.meetsPhotoRequirements(photo)) {
                results.warnings.push({
                    type: 'photo_quality',
                    message: 'Photo does not meet quality requirements',
                    photo: photo.id,
                    requirements: this.validationRules.documentation.photoQuality
                });
            }
        });
    }

    validateStructuralOperations(estimate, results) {
        estimate.operations
            .filter(op => op.type === 'structural')
            .forEach(op => {
                // Check sectioning locations
                if (op.isSectioning && !this.validateSectioningLocation(op)) {
                    results.violations.push({
                        type: 'structural',
                        severity: 'high',
                        message: 'Invalid sectioning location',
                        operation: op.description,
                        recommendation: 'Use OEM approved sectioning locations only'
                    });
                }

                // Check for required welds
                if (!this.validateWeldRequirements(op)) {
                    results.violations.push({
                        type: 'structural',
                        severity: 'high',
                        message: 'Missing required welds',
                        operation: op.description,
                        required: this.getRequiredWeldTypes(op)
                    });
                }
            });
    }

    validateSectioningLocation(operation) {
        // Get OEM specifications
        const oemSpecs = this.getOEMSpecs(operation.vehicle);
        
        return oemSpecs.approvedSectioningLocations.includes(operation.sectionLocation);
    }

    validateWeldRequirements(operation) {
        const requiredWelds = this.getRequiredWeldTypes(operation);
        return requiredWelds.every(weld => 
            operation.weldTypes && operation.weldTypes.includes(weld)
        );
    }

    getRequiredWeldTypes(operation) {
        // Based on operation type and location
        const weldRequirements = {
            quarter_panel: ['spot', 'mig'],
            rocker_panel: ['spot', 'mig', 'seam'],
            pillar: ['spot', 'mig']
        };

        return weldRequirements[operation.location] || ['mig'];
    }

    validateCorrosionProtection(estimate, results) {
        estimate.operations
            .filter(op => this.requiresCorrosionProtection(op))
            .forEach(op => {
                if (!this.hasRequiredCorrosionProtection(op)) {
                    results.violations.push({
                        type: 'corrosion_protection',
                        severity: 'high',
                        message: 'Missing required corrosion protection',
                        operation: op.description,
                        required: this.getRequiredProtection(op)
                    });
                }
            });
    }

    requiresCorrosionProtection(operation) {
        return [
            'replace_panel',
            'sectioning',
            'structural_repair',
            'welding'
        ].includes(operation.type);
    }

    hasRequiredCorrosionProtection(operation) {
        const required = this.getRequiredProtection(operation);
        return required.every(protection => 
            operation.corrosionProtection && 
            operation.corrosionProtection.includes(protection)
        );
    }

    getRequiredProtection(operation) {
        const protectionMap = {
            replace_panel: ['primer', 'sealer'],
            sectioning: ['primer', 'sealer', 'cavity_wax'],
            structural_repair: ['primer', 'sealer', 'cavity_wax'],
            welding: ['weld_through_primer', 'sealer']
        };

        return protectionMap[operation.type] || ['primer'];
    }

    validateMeasurements(estimate, results) {
        if (this.requiresPrePostMeasurements(estimate)) {
            if (!this.hasValidMeasurements(estimate)) {
                results.violations.push({
                    type: 'measurements',
                    severity: 'high',
                    message: 'Missing required pre/post measurements',
                    required: this.getRequiredMeasurements(estimate)
                });
            }
        }
    }

    requiresPrePostMeasurements(estimate) {
        return estimate.operations.some(op => 
            op.type === 'structural' || 
            op.type === 'pull' || 
            op.damageLevel === 'heavy'
        );
    }

    hasValidMeasurements(estimate) {
        const required = this.getRequiredMeasurements(estimate);
        return required.every(measurement => 
            estimate.measurements && 
            estimate.measurements[measurement.type] &&
            estimate.measurements[measurement.type].pre &&
            estimate.measurements[measurement.type].post
        );
    }

    getRequiredMeasurements(estimate) {
        const measurements = [];
        
        if (this.hasStructuralDamage(estimate)) {
            measurements.push({
                type: 'structural',
                points: ['upper_body', 'lower_body', 'center_section']
            });
        }
        
        if (this.hasFrameDamage(estimate)) {
            measurements.push({
                type: 'frame',
                points: ['length', 'width', 'height']
            });
        }
        
        return measurements;
    }

    validateScanRequirements(estimate, results) {
        if (this.requiresScans(estimate)) {
            const scanResults = this.validateScanDocumentation(estimate);
            
            if (!scanResults.valid) {
                results.violations.push({
                    type: 'diagnostic_scans',
                    severity: 'high',
                    message: 'Missing required diagnostic scans',
                    missing: scanResults.missing
                });
            }
        }
    }

    requiresScans(estimate) {
        return estimate.operations.some(op => 
            op.type === 'electrical' ||
            op.type === 'airbag' ||
            op.affectsSafetySystems ||
            op.requiresCalibration
        );
    }

    validateScanDocumentation(estimate) {
        const required = ['pre_scan', 'post_scan'];
        const missing = required.filter(scan => 
            !estimate.diagnosticScans || 
            !estimate.diagnosticScans[scan]
        );

        return {
            valid: missing.length === 0,
            missing
        };
    }

    validateCalibrationRequirements(estimate, results) {
        const calibrationNeeds = this.identifyCalibrationNeeds(estimate);
        
        calibrationNeeds.forEach(need => {
            if (!this.hasValidCalibrationPlan(estimate, need)) {
                results.violations.push({
                    type: 'calibration',
                    severity: 'high',
                    message: `Missing required ${need.type} calibration`,
                    system: need.system,
                    requirements: this.getCalibrationRequirements(need)
                });
            }
        });
    }

    identifyCalibrationNeeds(estimate) {
        const needs = [];
        const affectedSystems = new Set();

        // Check operations that affect ADAS systems
        estimate.operations.forEach(op => {
            const systemsAffected = this.getAffectedSystems(op);
            systemsAffected.forEach(system => affectedSystems.add(system));
        });

        // Generate calibration requirements for each affected system
        affectedSystems.forEach(system => {
            needs.push({
                type: this.getCalibrationType(system),
                system: system,
                requirements: this.getSystemRequirements(system)
            });
        });

        return needs;
    }

    getAffectedSystems(operation) {
        const systemMap = {
            'windshield_replace': ['forward_camera', 'rain_sensor'],
            'bumper_front': ['radar_sensor', 'parking_sensors'],
            'bumper_rear': ['parking_sensors', 'blind_spot'],
            'door_mirror': ['blind_spot', 'camera_system'],
            'quarter_panel': ['blind_spot'],
            'headlamp': ['headlamp_aim']
        };

        return systemMap[operation.type] || [];
    }

    getCalibrationType(system) {
        const calibrationTypes = {
            'forward_camera': 'static',
            'radar_sensor': 'dynamic',
            'parking_sensors': 'static',
            'blind_spot': 'dynamic',
            'headlamp_aim': 'static',
            'around_view': 'static'
        };

        return calibrationTypes[system] || 'static';
    }

    hasValidCalibrationPlan(estimate, need) {
        const calibration = estimate.calibrations?.find(c => 
            c.system === need.system && 
            c.type === need.type
        );

        if (!calibration) return false;

        return this.validateCalibrationSpecifications(calibration, need);
    }

    validateCalibrationSpecifications(calibration, need) {
        // Check if calibration meets manufacturer specifications
        const specs = this.getManufacturerSpecs(calibration.vehicle, need.system);
        
        return (
            calibration.tooling === specs.requiredTool &&
            calibration.environment === specs.environment &&
            this.meetsSpaceRequirements(calibration, specs) &&
            this.meetsEquipmentRequirements(calibration, specs)
        );
    }

    getManufacturerSpecs(vehicle, system) {
        // This would connect to a database of manufacturer specifications
        return {
            requiredTool: 'OEM_TOOL',
            environment: 'LEVEL_SURFACE',
            spaceRequirements: {
                length: 240, // inches
                width: 120,  // inches
                height: 96   // inches
            },
            equipment: ['targets', 'scan_tool', 'level']
        };
    }

    meetsSpaceRequirements(calibration, specs) {
        return (
            calibration.space.length >= specs.spaceRequirements.length &&
            calibration.space.width >= specs.spaceRequirements.width &&
            calibration.space.height >= specs.spaceRequirements.height
        );
    }

    meetsEquipmentRequirements(calibration, specs) {
        return specs.equipment.every(item => 
            calibration.equipment.includes(item)
        );
    }

    getCalibrationRequirements(need) {
        const specs = this.getManufacturerSpecs(need.vehicle, need.system);
        
        return {
            type: need.type,
            tooling: specs.requiredTool,
            environment: specs.environment,
            space: specs.spaceRequirements,
            equipment: specs.equipment,
            documentation: [
                'pre_scan',
                'post_scan',
                'calibration_report',
                'test_drive_results'
            ]
        };
    }

    validateSafetySystemsRestoration(estimate, results) {
        const safetySystemsAffected = this.identifyAffectedSafetySystems(estimate);
        
        safetySystemsAffected.forEach(system => {
            if (!this.hasValidRestorationPlan(estimate, system)) {
                results.violations.push({
                    type: 'safety_system',
                    severity: 'critical',
                    message: `Incomplete safety system restoration plan`,
                    system: system.name,
                    requirements: this.getSafetySystemRequirements(system)
                });
            }
        });
    }

    identifyAffectedSafetySystems(estimate) {
        const systems = new Set();
        
        estimate.operations.forEach(op => {
            const affectedSystems = this.getSafetySystemsImpact(op);
            affectedSystems.forEach(system => systems.add(system));
        });
        
        return Array.from(systems).map(system => ({
            name: system,
            requirements: this.getSafetySystemSpecs(system)
        }));
    }

    getSafetySystemsImpact(operation) {
        const impactMap = {
            'airbag_replace': ['srs', 'occupant_detection'],
            'seat_repair': ['occupant_detection', 'seatbelt_tensioner'],
            'pillar_repair': ['curtain_airbag', 'structural_integrity'],
            'wiring_repair': ['srs', 'abs', 'traction_control']
        };

        return impactMap[operation.type] || [];
    }

    hasValidRestorationPlan(estimate, system) {
        const plan = estimate.safetyRestoration?.find(p => 
            p.system === system.name
        );

        if (!plan) return false;

        return (
            this.validatePartRequirements(plan, system) &&
            this.validateTestingRequirements(plan, system) &&
            this.validateDocumentation(plan, system)
        );
    }

    validateRepairQuality(estimate, results) {
        const qualityChecks = {
            structural: this.validateStructuralQuality(estimate),
            refinish: this.validateRefinishQuality(estimate),
            mechanical: this.validateMechanicalQuality(estimate),
            safety: this.validateSafetySystemQuality(estimate)
        };

        Object.entries(qualityChecks).forEach(([type, issues]) => {
            issues.forEach(issue => {
                results.violations.push({
                    type: 'repair_quality',
                    category: type,
                    severity: issue.severity,
                    message: issue.message,
                    requirements: issue.requirements
                });
            });
        });
    }

    validateStructuralQuality(estimate) {
        const issues = [];
        const structuralOps = estimate.operations.filter(op => op.type === 'structural');

        structuralOps.forEach(op => {
            // Check weld quality
            if (!this.meetsWeldQualityStandards(op)) {
                issues.push({
                    severity: 'critical',
                    message: 'Weld quality below GEICO ARX standards',
                    requirements: this.getWeldQualityRequirements()
                });
            }

            // Check structural measurements
            if (!this.verifyStructuralMeasurements(op)) {
                issues.push({
                    severity: 'high',
                    message: 'Structural measurements out of specification',
                    requirements: this.getStructuralSpecs(op)
                });
            }
        });

        return issues;
    }

    meetsWeldQualityStandards(operation) {
        const weldChecks = {
            penetration: this.checkWeldPenetration(operation),
            size: this.checkWeldSize(operation),
            spacing: this.checkWeldSpacing(operation),
            appearance: this.checkWeldAppearance(operation)
        };

        return Object.values(weldChecks).every(check => check.passes);
    }

    checkWeldPenetration(operation) {
        const minimumPenetration = {
            mig: 80, // 80% minimum penetration
            spot: 90, // 90% minimum penetration
            plug: 85  // 85% minimum penetration
        };

        return {
            passes: operation.weldPenetration >= minimumPenetration[operation.weldType],
            value: operation.weldPenetration,
            required: minimumPenetration[operation.weldType]
        };
    }

    validateRefinishQuality(estimate) {
        const issues = [];
        const refinishOps = estimate.operations.filter(op => op.type === 'refinish');

        refinishOps.forEach(op => {
            // Check paint thickness
            if (!this.verifyPaintThickness(op)) {
                issues.push({
                    severity: 'medium',
                    message: 'Paint thickness out of specification',
                    requirements: this.getPaintThicknessSpecs(op)
                });
            }

            // Check color match
            if (!this.verifyColorMatch(op)) {
                issues.push({
                    severity: 'medium',
                    message: 'Color match outside acceptable range',
                    requirements: this.getColorMatchSpecs(op)
                });
            }
        });

        return issues;
    }

    verifyPaintThickness(operation) {
        const specs = {
            basecoat: { min: 0.8, max: 1.2 },  // mils
            clearcoat: { min: 1.8, max: 2.2 }, // mils
            primer: { min: 1.0, max: 1.5 }     // mils
        };

        return Object.entries(specs).every(([layer, range]) => {
            const thickness = operation.paintThickness[layer];
            return thickness >= range.min && thickness <= range.max;
        });
    }

    verifyColorMatch(operation) {
        const colorTolerance = {
            standard: 1.0,    // Delta E
            metallic: 1.5,    // Delta E
            pearl: 2.0,       // Delta E
            tricoat: 2.5     // Delta E
        };

        const paintType = operation.paintInfo.type.toLowerCase();
        const tolerance = colorTolerance[paintType] || colorTolerance.standard;

        return operation.colorMatch.deltaE <= tolerance;
    }

    validateMechanicalQuality(estimate) {
        const issues = [];
        const mechanicalOps = estimate.operations.filter(op => 
            op.type === 'mechanical' || op.type === 'suspension' || op.type === 'steering'
        );

        mechanicalOps.forEach(op => {
            // Check torque specifications
            if (!this.verifyTorqueSpecs(op)) {
                issues.push({
                    severity: 'high',
                    message: 'Torque specifications not met',
                    requirements: this.getTorqueRequirements(op)
                });
            }

            // Check alignment specifications
            if (op.requiresAlignment && !this.verifyAlignment(op)) {
                issues.push({
                    severity: 'high',
                    message: 'Alignment specifications not met',
                    requirements: this.getAlignmentSpecs(op)
                });
            }
        });

        return issues;
    }

    verifyTorqueSpecs(operation) {
        return operation.torqueReadings.every(reading => {
            const spec = this.getTorqueSpec(operation.type, reading.location);
            return (
                reading.value >= spec.min &&
                reading.value <= spec.max &&
                reading.verifiedBy &&
                reading.timestamp
            );
        });
    }

    getTorqueSpec(type, location) {
        const specs = {
            suspension: {
                'lower_control_arm': { min: 85, max: 95 },
                'upper_control_arm': { min: 75, max: 85 },
                'strut_mount': { min: 45, max: 55 }
            },
            steering: {
                'tie_rod_end': { min: 35, max: 45 },
                'steering_knuckle': { min: 65, max: 75 }
            }
        };

        return specs[type]?.[location] || { min: 0, max: 0 };
    }

    validateSafetySystemQuality(estimate) {
        const issues = [];
        const safetyOps = estimate.operations.filter(op => 
            op.type === 'srs' || op.type === 'airbag' || op.affectsSafetySystems
        );

        safetyOps.forEach(op => {
            // Verify system functionality
            if (!this.verifySafetySystem(op)) {
                issues.push({
                    severity: 'critical',
                    message: 'Safety system verification failed',
                    requirements: this.getSafetySystemRequirements(op)
                });
            }

            // Check calibration status
            if (op.requiresCalibration && !this.verifyCalibration(op)) {
                issues.push({
                    severity: 'critical',
                    message: 'Calibration verification failed',
                    requirements: this.getCalibrationRequirements(op)
                });
            }
        });

        return issues;
    }

    // Helper methods
    analyzePartsUsage(parts) {
        const totalParts = parts.length;
        const analysis = {
            aftermarketCount: 0,
            recycledCount: 0,
            lkqCount: 0,
            nonCompliantVendors: new Set(),
            totalCost: 0
        };

        parts.forEach(part => {
            // Track counts by type
            switch (part.type.toLowerCase()) {
                case 'aftermarket':
                    analysis.aftermarketCount++;
                    if (!this.validationRules.partsUsage.preferredVendors.includes(part.vendor)) {
                        analysis.nonCompliantVendors.add(part.vendor);
                    }
                    break;
                case 'recycled':
                    analysis.recycledCount++;
                    break;
                case 'lkq':
                    analysis.lkqCount++;
                    break;
            }
            analysis.totalCost += part.price;
        });

        return {
            aftermarketPercent: (analysis.aftermarketCount / totalParts) * 100,
            recycledPercent: (analysis.recycledCount / totalParts) * 100,
            lkqPercent: (analysis.lkqCount / totalParts) * 100,
            nonCompliantVendors: Array.from(analysis.nonCompliantVendors),
            totalCost: analysis.totalCost
        };
    }

    hasExcessiveOverlap(operation) {
        if (!operation.overlapHours) return false;

        const baseRefinishTime = operation.refinishHours;
        const maxOverlap = this.calculateMaxOverlap(operation);
        
        return operation.overlapHours > maxOverlap;
    }

    calculateMaxOverlap(operation) {
        const baseTime = operation.refinishHours;
        const maxPercent = this.validationRules.operations.maxOverlap;
        
        // Special handling for adjacent panels
        if (operation.adjacentPanels && operation.adjacentPanels.length > 0) {
            return baseTime * maxPercent * operation.adjacentPanels.length;
        }
        
        return baseTime * maxPercent;
    }

    validateThreeStage(operation) {
        if (!operation.isThreeStage) return true;

        const baseTime = operation.baseRefinishHours;
        const expectedTotal = baseTime * this.validationRules.refinish.threeStageMultiplier;
        const actualTotal = operation.totalRefinishHours;

        // Allow for small rounding differences
        return Math.abs(expectedTotal - actualTotal) < 0.1;
    }

    validateBlend(operation) {
        if (!operation.isBlend) return true;

        // Check blend area requirements
        const meetsBlendArea = operation.blendAreaInches >= this.validationRules.operations.blendWithin;
        
        // Check clearcoat requirements
        const hasClearcoat = operation.hasClearcoat || !this.validationRules.operations.clearcoatEdging;
        
        // Check blend time calculation
        const expectedBlendTime = this.calculateExpectedBlendTime(operation);
        const actualBlendTime = operation.blendHours;
        const validBlendTime = Math.abs(expectedBlendTime - actualBlendTime) < 0.2;

        return meetsBlendArea && hasClearcoat && validBlendTime;
    }

    calculateExpectedBlendTime(operation) {
        let baseBlendTime = this.validationRules.refinish.blendTime;
        
        // Adjust for paint type
        if (operation.isPearl) {
            baseBlendTime *= this.validationRules.refinish.pearlMultiplier;
        } else if (operation.isThreeStage) {
            baseBlendTime *= this.validationRules.refinish.threeStageMultiplier;
        }
        
        // Add edging time if required
        if (operation.requiresEdging) {
            baseBlendTime += this.validationRules.refinish.edgingTime;
        }
        
        return baseBlendTime;
    }

    checkRequiredPhotos(photos) {
        const required = new Set(this.validationRules.documentation.requiredPhotos);
        const provided = new Set(photos.map(p => p.type));
        
        const missing = [];
        required.forEach(type => {
            if (!provided.has(type)) {
                missing.push(type);
            }
        });
        
        return missing;
    }

    meetsPhotoRequirements(photo) {
        const requirements = this.validationRules.documentation.photoQuality;
        
        // Check file format
        if (!requirements.requiredFormat.includes(photo.format.toLowerCase())) {
            return false;
        }
        
        // Check file size
        if (photo.size > requirements.maxSize) {
            return false;
        }
        
        // Check resolution
        const [reqWidth, reqHeight] = requirements.minResolution.split('x').map(Number);
        return photo.width >= reqWidth && photo.height >= reqHeight;
    }

    getBlendRequirements() {
        return {
            minimumDistance: this.validationRules.operations.blendWithin,
            requiresClearcoat: this.validationRules.operations.clearcoatEdging,
            standardTime: this.validationRules.refinish.blendTime,
            edgingTime: this.validationRules.refinish.edgingTime
        };
    }

    getSafetySystemSpecs(system) {
        const safetySpecs = {
            'srs': {
                requiredParts: ['control_module', 'sensors', 'wiring_harness'],
                testingProtocol: 'OEM_DIAGNOSTIC',
                documentation: ['pre_scan', 'post_scan', 'test_results'],
                certifications: ['ASE', 'I-CAR']
            },
            'occupant_detection': {
                requiredParts: ['sensors', 'control_unit', 'calibration_mat'],
                testingProtocol: 'WEIGHT_CALIBRATION',
                documentation: ['calibration_report', 'test_results'],
                certifications: ['OEM_SPECIFIC']
            },
            'curtain_airbag': {
                requiredParts: ['airbag_module', 'mounting_hardware', 'trim_panels'],
                testingProtocol: 'DEPLOYMENT_ZONE',
                documentation: ['installation_photos', 'clearance_verification'],
                certifications: ['I-CAR', 'OEM_SPECIFIC']
            },
            'structural_integrity': {
                requiredParts: ['reinforcements', 'anti-intrusion_bars'],
                testingProtocol: 'MEASUREMENT_VERIFICATION',
                documentation: ['measurements', 'weld_inspection'],
                certifications: ['STRUCTURAL', 'WELDING']
            }
        };

        return safetySpecs[system] || {
            requiredParts: [],
            testingProtocol: 'STANDARD',
            documentation: ['verification'],
            certifications: ['GENERAL']
        };
    }

    validatePartRequirements(plan, system) {
        const specs = this.getSafetySystemSpecs(system.name);
        
        return specs.requiredParts.every(part => {
            const planPart = plan.parts.find(p => p.type === part);
            return planPart && this.isValidPart(planPart);
        });
    }

    isValidPart(part) {
        return (
            part.isOEM || 
            (part.certification && this.isApprovedCertification(part.certification)) &&
            !part.isRemanufactured &&
            this.meetsQualityStandards(part)
        );
    }

    validateTestingRequirements(plan, system) {
        const specs = this.getSafetySystemSpecs(system.name);
        
        return (
            plan.testingProtocol === specs.testingProtocol &&
            this.hasRequiredTesting(plan, specs) &&
            this.meetsTestingStandards(plan)
        );
    }

    hasRequiredTesting(plan, specs) {
        const requiredTests = {
            'OEM_DIAGNOSTIC': ['communication', 'voltage', 'resistance'],
            'WEIGHT_CALIBRATION': ['empty', 'threshold', 'maximum'],
            'DEPLOYMENT_ZONE': ['clearance', 'mounting', 'coverage'],
            'MEASUREMENT_VERIFICATION': ['dimensions', 'symmetry', 'tolerance']
        };

        const required = requiredTests[specs.testingProtocol] || [];
        return required.every(test => plan.completedTests.includes(test));
    }

    meetsTestingStandards(plan) {
        return (
            plan.testingEquipment.isCalibrated &&
            plan.technicianCertified &&
            plan.followsOEMProcedure &&
            this.hasValidTestResults(plan)
        );
    }

    hasValidTestResults(plan) {
        return (
            plan.testResults &&
            plan.testResults.every(result => 
                result.status === 'PASS' &&
                result.withinSpecification &&
                result.verifiedBy
            )
        );
    }

    getSafetySystemRequirements(system) {
        const specs = this.getSafetySystemSpecs(system.name);
        
        return {
            parts: specs.requiredParts.map(part => ({
                type: part,
                requirements: this.getPartRequirements(part)
            })),
            testing: {
                protocol: specs.testingProtocol,
                required: this.getRequiredTests(specs.testingProtocol),
                certification: specs.certifications
            },
            documentation: specs.documentation.map(doc => ({
                type: doc,
                format: this.getDocumentationFormat(doc)
            }))
        };
    }

    getPartRequirements(partType) {
        return {
            certification: this.getRequiredCertification(partType),
            quality: this.getQualityStandards(partType),
            installation: this.getInstallationRequirements(partType)
        };
    }

    getRequiredCertification(partType) {
        const certificationMap = {
            'control_module': ['OEM', 'CAPA'],
            'sensors': ['OEM', 'CAPA', 'NSF'],
            'wiring_harness': ['OEM'],
            'airbag_module': ['OEM'],
            'mounting_hardware': ['OEM', 'CAPA'],
            'reinforcements': ['OEM']
        };

        return certificationMap[partType] || ['OEM'];
    }

    getQualityStandards(partType) {
        return {
            mustBeNew: this.requiresNewPart(partType),
            oemRequired: this.requiresOEM(partType),
            inspectionPoints: this.getInspectionRequirements(partType)
        };
    }

    getInstallationRequirements(partType) {
        return {
            torqueSpecs: this.getTorqueSpecs(partType),
            sequence: this.getInstallationSequence(partType),
            tooling: this.getRequiredTools(partType)
        };
    }

    getDocumentationFormat(docType) {
        const formatMap = {
            'pre_scan': { type: 'PDF', photos: true, data: true },
            'post_scan': { type: 'PDF', photos: true, data: true },
            'calibration_report': { type: 'PDF', data: true },
            'test_results': { type: 'PDF', data: true },
            'installation_photos': { type: 'JPG', resolution: '2048x1536' },
            'measurements': { type: 'PDF', data: true, photos: true },
            'weld_inspection': { type: 'PDF', photos: true }
        };

        return formatMap[docType] || { type: 'PDF', data: true };
    }

    requiresNewPart(partType) {
        const requiresNewMap = {
            'airbag_module': true,
            'srs_sensor': true,
            'control_module': true,
            'wiring_harness': true,
            'seatbelt_retractor': true,
            'steering_components': true,
            'brake_components': true
        };

        return requiresNewMap[partType] || false;
    }

    requiresOEM(partType) {
        const requiresOEMMap = {
            'airbag_module': true,
            'srs_components': true,
            'structural_components': true,
            'radiator_support': true,
            'frame_components': true,
            'fuel_system': true
        };

        return requiresOEMMap[partType] || false;
    }

    getInspectionRequirements(partType) {
        const inspectionPoints = {
            'structural_components': [
                'weld_quality',
                'material_thickness',
                'corrosion_protection',
                'mounting_points'
            ],
            'safety_components': [
                'part_authenticity',
                'mounting_integrity',
                'sensor_alignment',
                'wiring_condition'
            ],
            'mechanical_components': [
                'fitment',
                'operation',
                'leaks',
                'wear_points'
            ]
        };

        return inspectionPoints[this.getPartCategory(partType)] || ['general_condition'];
    }

    getTorqueSpecs(partType) {
        const torqueMap = {
            'airbag_module': {
                bolts: '35Nm',
                sequence: ['top_left', 'top_right', 'bottom_left', 'bottom_right'],
                verification: 'required'
            },
            'control_module': {
                bolts: '12Nm',
                sequence: ['center_out'],
                verification: 'required'
            },
            'structural': {
                bolts: '85Nm',
                sequence: ['center_out'],
                verification: 'required'
            }
        };

        return torqueMap[partType] || null;
    }

    getInstallationSequence(partType) {
        const sequenceMap = {
            'quarter_panel': [
                'verify_measurements',
                'prepare_mating_surfaces',
                'apply_weld_through_primer',
                'position_panel',
                'verify_alignment',
                'tack_weld',
                'complete_welds',
                'apply_seam_sealer',
                'apply_corrosion_protection'
            ],
            'airbag_system': [
                'verify_power_disconnected',
                'install_module',
                'torque_fasteners',
                'connect_wiring',
                'verify_connections',
                'clear_codes',
                'verify_system_status'
            ]
        };

        return sequenceMap[partType] || ['install_per_oem_procedure'];
    }

    getRequiredTools(partType) {
        const toolingRequirements = {
            'structural': {
                required: ['mig_welder', 'spot_welder', 'measuring_system'],
                specifications: {
                    mig_welder: 'min_220v',
                    spot_welder: 'min_10000amp'
                }
            },
            'mechanical': {
                required: ['torque_wrench', 'scan_tool'],
                specifications: {
                    torque_wrench: 'calibrated',
                    scan_tool: 'oem_approved'
                }
            },
            'airbag': {
                required: ['torque_wrench', 'scan_tool', 'srs_tester'],
                specifications: {
                    torque_wrench: 'calibrated',
                    scan_tool: 'oem_specific',
                    srs_tester: 'manufacturer_approved'
                }
            }
        };

        return toolingRequirements[this.getPartCategory(partType)] || {
            required: ['basic_tools'],
            specifications: {}
        };
    }

    getPartCategory(partType) {
        const categoryMap = {
            // Structural Components
            'quarter_panel': 'structural',
            'rocker_panel': 'structural',
            'frame_rail': 'structural',
            'pillar': 'structural',
            
            // Safety Components
            'airbag_module': 'safety',
            'srs_sensor': 'safety',
            'seatbelt': 'safety',
            'control_module': 'safety',
            
            // Mechanical Components
            'suspension': 'mechanical',
            'steering': 'mechanical',
            'brake': 'mechanical'
        };

        return categoryMap[partType] || 'general';
    }

    isApprovedCertification(certification) {
        const approvedCertifications = {
            'OEM': {
                level: 1,
                requiresVerification: true
            },
            'CAPA': {
                level: 2,
                requiresVerification: true
            },
            'NSF': {
                level: 2,
                requiresVerification: true
            },
            'Diamond_Standard': {
                level: 3,
                requiresVerification: false
            }
        };

        return approvedCertifications[certification] || false;
    }

    getRequiredTests(protocol) {
        const testRequirements = {
            'OEM_DIAGNOSTIC': {
                steps: [
                    'system_scan',
                    'voltage_test',
                    'resistance_check',
                    'communication_test',
                    'activation_test'
                ],
                equipment: ['oem_scan_tool', 'multimeter'],
                documentation: ['scan_report', 'test_results']
            },
            'WEIGHT_CALIBRATION': {
                steps: [
                    'zero_calibration',
                    'weight_test_empty',
                    'weight_test_threshold',
                    'weight_test_maximum'
                ],
                equipment: ['calibration_weights', 'scan_tool'],
                documentation: ['calibration_report']
            }
        };

        return testRequirements[protocol] || {
            steps: ['standard_test'],
            equipment: ['basic_tools'],
            documentation: ['test_report']
        };
    }

    checkWeldSize(operation) {
        const sizeRequirements = {
            mig: {
                min: 4.0,  // mm
                max: 6.0   // mm
            },
            spot: {
                min: 6.0,  // mm
                max: 8.0   // mm
            },
            plug: {
                min: 8.0,  // mm
                max: 10.0  // mm
            }
        };

        const spec = sizeRequirements[operation.weldType];
        return {
            passes: operation.weldSize >= spec.min && operation.weldSize <= spec.max,
            value: operation.weldSize,
            required: spec
        };
    }

    checkWeldSpacing(operation) {
        const spacingRequirements = {
            spot: 30,    // mm between spot welds
            plug: 40,    // mm between plug welds
            stitch: 25   // mm between stitch welds
        };

        const minSpacing = spacingRequirements[operation.weldType];
        return {
            passes: operation.weldSpacing >= minSpacing,
            value: operation.weldSpacing,
            required: minSpacing
        };
    }

    checkWeldAppearance(operation) {
        const appearanceChecks = {
            porosity: this.checkWeldPorosity(operation),
            undercut: this.checkWeldUndercut(operation),
            spatter: this.checkWeldSpatter(operation),
            color: this.checkWeldColor(operation)
        };

        return {
            passes: Object.values(appearanceChecks).every(check => check.passes),
            details: appearanceChecks
        };
    }

    checkWeldPorosity(operation) {
        // Maximum allowed porosity percentage
        const maxPorosity = 2; // 2%
        return {
            passes: operation.porosityPercentage <= maxPorosity,
            value: operation.porosityPercentage,
            limit: maxPorosity
        };
    }

    checkWeldUndercut(operation) {
        // Maximum allowed undercut depth
        const maxUndercut = 0.5; // 0.5mm
        return {
            passes: operation.undercutDepth <= maxUndercut,
            value: operation.undercutDepth,
            limit: maxUndercut
        };
    }

    checkWeldSpatter(operation) {
        // Evaluate weld spatter coverage and distance
        const spatterLimits = {
            maxCoverage: 5,  // 5% surface area
            maxDistance: 15  // 15mm from weld
        };

        const spatterAnalysis = {
            coverage: this.calculateSpatterCoverage(operation),
            maxDistance: this.getMaxSpatterDistance(operation)
        };

        return {
            passes: 
                spatterAnalysis.coverage <= spatterLimits.maxCoverage &&
                spatterAnalysis.maxDistance <= spatterLimits.maxDistance,
            value: spatterAnalysis,
            limits: spatterLimits
        };
    }

    calculateSpatterCoverage(operation) {
        // Calculate percentage of affected area covered by spatter
        const spatterArea = operation.spatterMeasurements.reduce((total, spatter) => 
            total + (spatter.width * spatter.length), 0
        );
        
        return (spatterArea / operation.weldArea) * 100;
    }

    getMaxSpatterDistance(operation) {
        // Find furthest spatter from weld center
        return Math.max(...operation.spatterMeasurements.map(s => s.distance));
    }

    checkWeldColor(operation) {
        const colorStandards = {
            steel: {
                acceptable: ['straw', 'light_blue', 'dark_straw'],
                marginal: ['blue', 'purple'],
                unacceptable: ['grey', 'black']
            },
            aluminum: {
                acceptable: ['silver', 'light_grey'],
                marginal: ['dark_grey'],
                unacceptable: ['black', 'white']
            }
        };

        const material = operation.material.toLowerCase();
        const weldColor = operation.weldColor.toLowerCase();
        
        return {
            passes: colorStandards[material].acceptable.includes(weldColor),
            marginal: colorStandards[material].marginal.includes(weldColor),
            value: weldColor,
            acceptable: colorStandards[material].acceptable
        };
    }

    verifyStructuralMeasurements(operation) {
        const measurements = operation.measurements;
        const specs = this.getStructuralSpecs(operation);
        
        return (
            this.checkUpperBodyMeasurements(measurements.upperBody, specs.upperBody) &&
            this.checkLowerBodyMeasurements(measurements.lowerBody, specs.lowerBody) &&
            this.checkSymmetryMeasurements(measurements.symmetry, specs.symmetry)
        );
    }

    getStructuralSpecs(operation) {
        // Get OEM specifications for the vehicle
        const vehicleSpecs = this.getOEMStructuralSpecs(operation.vehicle);
        
        return {
            upperBody: {
                length: { nominal: vehicleSpecs.upperLength, tolerance: 2 },
                width: { nominal: vehicleSpecs.upperWidth, tolerance: 2 },
                height: { nominal: vehicleSpecs.upperHeight, tolerance: 2 }
            },
            lowerBody: {
                length: { nominal: vehicleSpecs.lowerLength, tolerance: 2 },
                width: { nominal: vehicleSpecs.lowerWidth, tolerance: 2 },
                height: { nominal: vehicleSpecs.lowerHeight, tolerance: 2 }
            },
            symmetry: {
                maxDeviation: 3, // mm
                criticalPoints: vehicleSpecs.symmetryPoints
            }
        };
    }

    checkUpperBodyMeasurements(measurements, specs) {
        return (
            this.isWithinTolerance(measurements.length, specs.length) &&
            this.isWithinTolerance(measurements.width, specs.width) &&
            this.isWithinTolerance(measurements.height, specs.height)
        );
    }

    checkLowerBodyMeasurements(measurements, specs) {
        return (
            this.isWithinTolerance(measurements.length, specs.length) &&
            this.isWithinTolerance(measurements.width, specs.width) &&
            this.isWithinTolerance(measurements.height, specs.height)
        );
    }

    checkSymmetryMeasurements(measurements, specs) {
        return specs.criticalPoints.every(point => 
            Math.abs(measurements[point].left - measurements[point].right) <= specs.maxDeviation
        );
    }

    isWithinTolerance(value, spec) {
        return Math.abs(value - spec.nominal) <= spec.tolerance;
    }

    getWeldQualityRequirements() {
        return {
            penetration: {
                mig: '80% minimum',
                spot: '90% minimum',
                plug: '85% minimum'
            },
            size: {
                mig: '4.0-6.0mm',
                spot: '6.0-8.0mm',
                plug: '8.0-10.0mm'
            },
            spacing: {
                spot: '30mm minimum',
                plug: '40mm minimum',
                stitch: '25mm minimum'
            },
            appearance: {
                porosity: 'Maximum 2%',
                undercut: 'Maximum 0.5mm',
                spatter: 'Minimal',
                color: 'Consistent'
            }
        };
    }

    getOEMStructuralSpecs(vehicle) {
        // This would typically fetch from a database or API
        // Implementing mock data for demonstration
        const mockSpecs = {
            upperLength: this.getVehicleSpec(vehicle, 'upper_length'),
            upperWidth: this.getVehicleSpec(vehicle, 'upper_width'),
            upperHeight: this.getVehicleSpec(vehicle, 'upper_height'),
            lowerLength: this.getVehicleSpec(vehicle, 'lower_length'),
            lowerWidth: this.getVehicleSpec(vehicle, 'lower_width'),
            lowerHeight: this.getVehicleSpec(vehicle, 'lower_height'),
            symmetryPoints: [
                'strut_tower',
                'frame_rail_front',
                'frame_rail_rear',
                'suspension_mount',
                'door_hinge_mount',
                'quarter_panel_mount'
            ]
        };

        return mockSpecs;
    }

    getVehicleSpec(vehicle, measurement) {
        // This would fetch specific measurements from vehicle database
        const specs = {
            upper_length: vehicle.wheelbase + 200,
            upper_width: vehicle.trackWidth + 300,
            upper_height: vehicle.roofHeight,
            lower_length: vehicle.wheelbase + 100,
            lower_width: vehicle.trackWidth + 150,
            lower_height: vehicle.groundClearance + 200
        };

        return specs[measurement] || 0;
    }
}

// Export the validator
const geicoValidator = new GeicoARXValidator();
export default geicoValidator; 