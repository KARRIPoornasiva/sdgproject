import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initialBlocks,
  initialTanks,
  initialLeakAlert,
  initialNightLeak,
  initialMaintenanceTickets,
  initialSTPData,
  initialROData,
  initialRainwaterData,
  initialGardenZones,
  initialBorewells,
  initialPumps,
  initialAIRecommendations,
  timeseries24hData,
} from '../services/mockData';

const SimulatorContext = createContext(null);

export const SimulatorProvider = ({ children }) => {
  const [isRunning, setIsRunning] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x, 2x, 5x
  const [activeScenario, setActiveScenario] = useState('LEAKAGE_BLOCK_G'); // 'NORMAL', 'LEAKAGE_BLOCK_G', 'TANK_OVERFLOW_G', 'PUMP_FAILURE', 'HIGH_CONSUMPTION'
  
  // Dynamic State Stores
  const [blocks, setBlocks] = useState(initialBlocks);
  const [tanks, setTanks] = useState(initialTanks);
  const [activeLeak, setActiveLeak] = useState(initialLeakAlert);
  const [nightLeak, setNightLeak] = useState(initialNightLeak);
  const [maintenanceTickets, setMaintenanceTickets] = useState(initialMaintenanceTickets);
  const [stpData, setStpData] = useState(initialSTPData);
  const [roData, setRoData] = useState(initialROData);
  const [rainwaterData, setRainwaterData] = useState(initialRainwaterData);
  const [gardenZones, setGardenZones] = useState(initialGardenZones);
  const [borewells, setBorewells] = useState(initialBorewells);
  const [pumps, setPumps] = useState(initialPumps);
  const [recommendations, setRecommendations] = useState(initialAIRecommendations);
  const [chartData24h, setChartData24h] = useState(timeseries24hData);
  const [livePulseTimestamp, setLivePulseTimestamp] = useState(new Date());

  // KPI calculations derived from state
  const totalConsumptionToday = blocks.reduce((acc, b) => acc + b.currentConsumption, 0);
  const totalRecycledWater = stpData.treatedWaterLpd;
  const totalWaterSaved = maintenanceTickets
    .filter(t => t.waterSavedAfterRepair)
    .reduce((acc, t) => acc + t.waterSavedAfterRepair, 0) + 
    gardenZones.reduce((acc, g) => acc + g.waterSavedTodayL, 0);
  
  const activeLeakageCount = blocks.filter(b => b.leakageRisk === 'High' || b.leakageRisk === 'Medium').length;
  const criticalLeakCount = blocks.filter(b => b.leakageRisk === 'High').length;
  const tankAlertCount = tanks.filter(t => t.percentage >= 95 || t.percentage <= 20).length;

  // Simulator Scenario Trigger Handlers
  const triggerScenario = useCallback((scenarioType) => {
    setActiveScenario(scenarioType);

    if (scenarioType === 'NORMAL') {
      // Return Bhaskar Bhavan and tanks to normal operation
      setBlocks(prev => prev.map(b => {
        if (b.code === 'Bhaskar Bhavan') {
          return {
            ...b,
            currentConsumption: 18400,
            tankPercentage: 78,
            leakageRisk: 'Low',
            riskScore: 14,
            status: 'Normal',
            flowRateLpm: 22.5,
            nightFlowLph: 180,
          };
        }
        return b;
      }));

      setTanks(prev => prev.map(t => {
        if (t.blockCode === 'Bhaskar Bhavan') {
          return {
            ...t,
            percentage: 78,
            currentLitres: 27300,
            pumpState: 'OFF',
            status: 'Normal',
            overflowAlert: false,
          };
        }
        return t;
      }));

      setActiveLeak(null);
    } 
    else if (scenarioType === 'LEAKAGE_BLOCK_G' || scenarioType === 'LEAKAGE_BHASKAR') {
      // Critical leakage in Bhaskar Bhavan
      setBlocks(prev => prev.map(b => {
        if (b.code === 'Bhaskar Bhavan') {
          return {
            ...b,
            currentConsumption: 23040,
            tankPercentage: 97,
            leakageRisk: 'High',
            riskScore: 94,
            status: 'Critical',
            flowRateLpm: 85.0,
            nightFlowLph: 2100,
          };
        }
        return b;
      }));

      setTanks(prev => prev.map(t => {
        if (t.blockCode === 'Bhaskar Bhavan') {
          return {
            ...t,
            percentage: 97,
            currentLitres: 33950,
            pumpState: 'ON',
            status: 'Critical',
            overflowAlert: true,
          };
        }
        return t;
      }));

      setActiveLeak(initialLeakAlert);
    } 
    else if (scenarioType === 'TANK_OVERFLOW_G' || scenarioType === 'TANK_OVERFLOW_BHASKAR') {
      setTanks(prev => prev.map(t => {
        if (t.blockCode === 'Bhaskar Bhavan') {
          return {
            ...t,
            percentage: 98,
            currentLitres: 34300,
            pumpState: 'ON',
            status: 'Critical',
            overflowAlert: true,
          };
        }
        return t;
      }));
    }
    else if (scenarioType === 'PUMP_FAILURE') {
      setPumps(prev => prev.map(p => {
        if (p.name.includes('Bhaskar')) {
          return { ...p, status: 'TRIPPED', warning: 'Thermal Overload / Motor Trip' };
        }
        return p;
      }));
    }
    else if (scenarioType === 'HIGH_CONSUMPTION') {
      setBlocks(prev => prev.map(b => ({
        ...b,
        currentConsumption: Math.round(b.expectedConsumption * 1.35),
      })));
    }
  }, []);

  // Continuous micro-tick for realistic live sensor readings fluctuation
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setLivePulseTimestamp(new Date());

      // Subtle noise on flow rates and tanks to show live heartbeat
      setBlocks(prev => prev.map(b => {
        const jitter = (Math.random() - 0.5) * 0.4;
        const newFlow = Math.max(5, +(b.flowRateLpm + jitter).toFixed(1));
        return {
          ...b,
          flowRateLpm: newFlow,
        };
      }));

      setTanks(prev => prev.map(t => {
        const jitterLitres = (Math.random() - 0.48) * 15;
        const newLitres = Math.min(t.capacity, Math.max(1000, Math.round(t.currentLitres + jitterLitres)));
        return {
          ...t,
          currentLitres: newLitres,
          percentage: Math.round((newLitres / t.capacity) * 100),
        };
      }));
    }, 2500 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isRunning, simulationSpeed]);

  // Ticket creation and resolution workflow
  const createTicket = (newTicket) => {
    setMaintenanceTickets(prev => [newTicket, ...prev]);
  };

  const resolveTicket = (ticketId, afterRepairFlow, waterSaved) => {
    setMaintenanceTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'Resolved',
          resolvedTime: 'Just now',
          afterRepairDailyFlow: afterRepairFlow,
          waterSavedAfterRepair: waterSaved,
        };
      }
      return t;
    }));

    // Trigger normalization if it was Block G
    triggerScenario('NORMAL');
  };

  return (
    <SimulatorContext.Provider
      value={{
        isRunning,
        setIsRunning,
        simulationSpeed,
        setSimulationSpeed,
        activeScenario,
        triggerScenario,
        blocks,
        tanks,
        activeLeak,
        nightLeak,
        maintenanceTickets,
        stpData,
        roData,
        rainwaterData,
        gardenZones,
        borewells,
        pumps,
        recommendations,
        chartData24h,
        livePulseTimestamp,
        totalConsumptionToday,
        totalRecycledWater,
        totalWaterSaved,
        activeLeakageCount,
        criticalLeakCount,
        tankAlertCount,
        createTicket,
        resolveTicket,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
};
