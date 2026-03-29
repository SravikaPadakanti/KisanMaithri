import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFarmStore = create(
    persist(
        (set, get) => ({
            // Farm Configuration (Static details)
            farmConfig: {
                crop: 'wheat',
                soil: 'alluvial',
                area: 10,
                unit: 'acres',
                weather: 'sunny'
            },

            // Market Data (Mock)
            marketPrices: {
                // Cereals & Fiber
                wheat: { pricePerQuintal: 2200, costPerAcre: 6000, trend: 'up' },
                rice: { pricePerQuintal: 2500, costPerAcre: 8000, trend: 'stable' },
                maize: { pricePerQuintal: 1900, costPerAcre: 5500, trend: 'down' },
                cotton: { pricePerQuintal: 6000, costPerAcre: 9000, trend: 'up' },
                sugarcane: { pricePerQuintal: 350, costPerAcre: 15000, trend: 'stable' },

                // Vegetables
                tomato: { pricePerQuintal: 1500, costPerAcre: 12000, trend: 'volatile' },
                onion: { pricePerQuintal: 1800, costPerAcre: 10000, trend: 'up' },
                potato: { pricePerQuintal: 1200, costPerAcre: 8000, trend: 'stable' },
                carrot: { pricePerQuintal: 3500, costPerAcre: 11000, trend: 'up' },
                brinjal: { pricePerQuintal: 2100, costPerAcre: 9000, trend: 'stable' },
                okra: { pricePerQuintal: 2800, costPerAcre: 8500, trend: 'up' },
                cabbage: { pricePerQuintal: 1400, costPerAcre: 9500, trend: 'down' },
                cauliflower: { pricePerQuintal: 1600, costPerAcre: 10000, trend: 'stable' },
                spinach: { pricePerQuintal: 1200, costPerAcre: 5000, trend: 'stable' },
                bitter_gourd: { pricePerQuintal: 3200, costPerAcre: 11000, trend: 'up' },
                bottle_gourd: { pricePerQuintal: 1100, costPerAcre: 6000, trend: 'down' },

                // Spices
                chilli: { pricePerQuintal: 8000, costPerAcre: 14000, trend: 'up' },
                turmeric: { pricePerQuintal: 7000, costPerAcre: 12000, trend: 'stable' },
                cumin: { pricePerQuintal: 15000, costPerAcre: 9000, trend: 'up' },
                coriander: { pricePerQuintal: 6500, costPerAcre: 7000, trend: 'stable' },
                black_pepper: { pricePerQuintal: 34000, costPerAcre: 25000, trend: 'up' },
                cardamom: { pricePerQuintal: 95000, costPerAcre: 40000, trend: 'volatile' },
                mustard: { pricePerQuintal: 5400, costPerAcre: 4500, trend: 'stable' },

                // Pulses
                chickpea: { pricePerQuintal: 5800, costPerAcre: 5000, trend: 'up' },
                lentil: { pricePerQuintal: 6200, costPerAcre: 5500, trend: 'stable' },
                moong_dal: { pricePerQuintal: 7500, costPerAcre: 6000, trend: 'up' }
            },

            // Transient Visual Effects (Animations)
            visualEffects: {
                isRaining: false,
                isSpraying: false,     // Fertilizer
                isPestControlling: false,
                isHarvesting: false,
                isSowing: false,
                isTilling: false,
            },

            // Persistent Simulation State
            simState: {
                isPlaying: false,   // New: Controls the auto-loop
                day: 1,
                stage: 0,           // 0=SoilPrep, 1=Seed, 2=Sprout, 3=Young, 4=Mature
                growthProgress: 0,
                waterLevel: 60,
                soilHealth: 70,
                pestRisk: 10,
                fertilizerLevel: 20,
                cropHealth: 100,
                money: 10000,
                isWilted: false,
                isDamaged: false
            },

            // Activity Log
            actions: [],

            // Actions
            updateConfig: (key, value) => set((state) => ({
                farmConfig: { ...state.farmConfig, [key]: value }
            })),

            setVisualEffect: (effect, isActive) => set((state) => ({
                visualEffects: { ...state.visualEffects, [effect]: isActive }
            })),

            toggleSimulation: () => set((state) => ({
                simState: { ...state.simState, isPlaying: !state.simState.isPlaying }
            })),

            performAction: (actionType) => {
                const state = get();
                let newLog = {
                    day: state.simState.day,
                    action: actionType,
                    timestamp: new Date().toISOString()
                };

                let updates = {};
                let effects = {};

                if (actionType === 'WATER_FIELD') {
                    updates = { waterLevel: Math.min(100, state.simState.waterLevel + 30) };
                    newLog.message = "Irrigation system activated";
                    effects = { isRaining: true };
                    setTimeout(() => state.setVisualEffect('isRaining', false), 4000);

                } else if (actionType === 'SOW_SEEDS') {
                    updates = { stage: 1, growthProgress: 0 };
                    newLog.message = `Sowed ${state.farmConfig.crop} seeds`;
                    effects = { isSowing: true };
                    setTimeout(() => state.setVisualEffect('isSowing', false), 3000);

                } else if (actionType === 'ADD_FERTILIZER') {
                    updates = { soilHealth: Math.min(100, state.simState.soilHealth + 20) };
                    newLog.message = "Fertilizer applied";
                    effects = { isSpraying: true };
                    setTimeout(() => state.setVisualEffect('isSpraying', false), 3000);

                } else if (actionType === 'PEST_CONTROL') {
                    updates = { pestRisk: Math.max(0, state.simState.pestRisk - 40) };
                    newLog.message = "Pesticide sprayed";
                    effects = { isPestControlling: true };
                    setTimeout(() => state.setVisualEffect('isPestControlling', false), 3000);

                } else if (actionType === 'SOIL_PREP') {
                    updates = { soilHealth: Math.min(100, state.simState.soilHealth + 10) };
                    newLog.message = "Tilled soil";
                    effects = { isTilling: true };
                    setTimeout(() => state.setVisualEffect('isTilling', false), 3000);

                } else if (actionType === 'HARVEST') {
                    if (state.simState.stage === 4) {
                        const profit = state.simState.cropHealth * state.farmConfig.area * 10;
                        // Reset Activity Log & Day Count
                        updates = {
                            stage: 0,
                            growthProgress: 0,
                            money: state.simState.money + profit,
                            day: 0, // Reset day to 0 as requested
                            waterLevel: 60, // Reset env stats too for fresh start
                            soilHealth: 70,
                            pestRisk: 10
                        };
                        newLog.message = `Harvested! Profit: ₹${profit}`;

                        set((state) => ({
                            actions: [newLog],
                            simState: { ...state.simState, ...updates },
                            visualEffects: { ...state.visualEffects, isHarvesting: true }
                        }));

                        // Clean up effects after timeout
                        setTimeout(() => state.setVisualEffect('isHarvesting', false), 3000);
                        return; // Return early as we did a custom set
                    } else {
                        newLog.message = "Not ready for harvest yet.";
                    }
                }

                set((state) => ({
                    actions: [newLog, ...state.actions],
                    simState: { ...state.simState, ...updates },
                    visualEffects: { ...state.visualEffects, ...effects }
                }));
            },

            // Financial Calculations
            getFinancials: (yieldQuintals) => {
                const state = get();
                const { crop, area } = state.farmConfig;
                const marketInfo = state.marketPrices[crop] || { pricePerQuintal: 2000, costPerAcre: 5000, trend: 'stable' };

                const revenue = yieldQuintals * marketInfo.pricePerQuintal;
                const totalCost = area * marketInfo.costPerAcre;
                const profit = revenue - totalCost;
                const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

                return {
                    revenue,
                    totalCost,
                    profit,
                    roi,
                    pricePerQuintal: marketInfo.pricePerQuintal,
                    trend: marketInfo.trend
                };
            },

            // CONTINUOUS TIME LOOP
            advanceDay: () => set((state) => {
                if (!state.simState.isPlaying) return {}; // Pause check

                const s = state.simState;

                // 1. Environment Decay (Every tick/day)
                let newWater = Math.max(0, s.waterLevel - 2);
                let newSoilHealth = Math.max(0, s.soilHealth - 0.5);
                let newPestRisk = Math.min(100, s.pestRisk + Math.random() * 2);

                // 2. Growth Logic
                let growthBoost = 0;

                // Growth happens in all stages except 4 (Mature)
                // If Stage 0 (Empty), we still calculate potential growth but don't advance to 1 automatically
                if (s.stage < 4) {
                    growthBoost = 5; // Base growth
                    if (newWater > 40) growthBoost += 2;
                    // if (newSoilHealth > 50) growthBoost += 2; // Simplified for feedback
                    // if (newPestRisk > 60) growthBoost -= 3;
                    if (newWater < 10) growthBoost = 0;
                }

                let newProgress = s.growthProgress + growthBoost;
                let newStage = s.stage;

                if (newProgress >= 100) {
                    // Check if we can advance
                    if (s.stage === 0) {
                        // Cannot advance from 0 to 1 without SOW_SEEDS action.
                        // But we let progress hit 100% to show potential.
                        newProgress = 100;
                    } else if (s.stage < 4) {
                        newStage += 1;
                        newProgress = 0;
                    }
                }

                // (Logic moved up)

                const isWilted = newWater < 20;
                const isDamaged = newPestRisk > 80;

                // Silent updates mostly, alerting only on critical changes
                let updatedActions = state.actions;
                if (newStage > s.stage) {
                    updatedActions = [{
                        day: s.day + 1, action: 'GROWTH', message: `Crop entered Stage ${newStage}`, timestamp: new Date().toISOString()
                    }, ...state.actions];
                }

                return {
                    actions: updatedActions,
                    simState: {
                        ...s,
                        day: s.day + 1,
                        waterLevel: newWater,
                        soilHealth: newSoilHealth,
                        pestRisk: newPestRisk,
                        growthProgress: newProgress,
                        stage: newStage,
                        isWilted,
                        isDamaged
                    }
                };
            }),

            resetFarm: () => set({
                actions: [],
                visualEffects: {
                    isRaining: false,
                    isSpraying: false,
                    isPestControlling: false,
                    isHarvesting: false,
                    isSowing: false,
                    isTilling: false,
                },
                simState: {
                    isPlaying: true, // Auto-start
                    day: 1,
                    stage: 0,
                    growthProgress: 0,
                    waterLevel: 60,
                    soilHealth: 70,
                    pestRisk: 10,
                    fertilizerLevel: 20,
                    cropHealth: 100,
                    money: 10000,
                    isWilted: false,
                    isDamaged: false
                }
            })
        }),
        {
            name: 'KisanMaithri-farm-storage-v3', // v3 for continuous engine
        }
    )
);
