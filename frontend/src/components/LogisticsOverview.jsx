import React from 'react';
import { Fuel, Utensils, HeartPulse, Wrench } from 'lucide-react';
import { useModal } from '../context/ModalContext';

const iconMap = {
  fuel: Fuel,
  food: Utensils,
  medicine: HeartPulse,
  'spare-parts': Wrench,
};

export default function LogisticsOverview({ inventory: inventoryProp, selectedStation = 'Maitri Station' }) {
  const { openDrillDown } = useModal();

  const defaultInventory = [
    {
      id: 'fuel',
      name: 'Fuel',
      amount: '50,200 L',
      percent: 58,
      daysLeft: '43 Days',
      barColor: '#f59e0b',
      iconColor: '#f87171',
      unit: 'Liters',
      currentValue: 50200,
      interpretation: 'Arctic grade ATF / diesel storage. Consumption rate 1,167 L/day across station heating and generators.',
      recommendation: 'Next refuel tanker expedition scheduled in 35 days.',
    },
    {
      id: 'food',
      name: 'Food',
      amount: '3,250 kg',
      percent: 82,
      daysLeft: '67 Days',
      barColor: '#10b981',
      iconColor: '#10b981',
      unit: 'kg',
      currentValue: 3250,
      interpretation: 'Freeze-dried and dry ration supply nominal for 24 overwintering station crew members.',
      recommendation: 'Cold storage hydroponics module functioning optimally.',
    },
    {
      id: 'medicine',
      name: 'Medicine',
      amount: '620 kg',
      percent: 89,
      daysLeft: '89 Days',
      barColor: '#10b981',
      iconColor: '#10b981',
      unit: 'kg',
      currentValue: 620,
      interpretation: 'Critical trauma kits, antibiotics, and surgical oxygen supply in high readiness state.',
      recommendation: 'Routine inventory audit completed; expiry profile 18+ months.',
    },
    {
      id: 'spare-parts',
      name: 'Spare Parts',
      amount: '1,120 kg',
      percent: 74,
      daysLeft: '55 Days',
      barColor: '#10b981',
      iconColor: '#10b981',
      unit: 'kg',
      currentValue: 1120,
      interpretation: 'Critical replacement parts for wind turbines, generator alternators, and snowcats.',
      recommendation: 'High-wear seals and hydraulic filters maintained in duplicate stock.',
    },
  ];

  const rawInventory = inventoryProp || defaultInventory;
  const inventory = rawInventory.map((item) => ({
    ...item,
    icon: iconMap[item.id] || Fuel,
  }));

  const handleRowClick = (item) => {
    openDrillDown({
      title: `${item.name} Inventory Reserve`,
      type: 'DRILL_DOWN',
      category: 'LOGISTICS',
      currentValue: item.currentValue || item.percent,
      unit: item.unit || '%',
      status: item.percent < 60 ? 'WARNING' : 'NORMAL',
      interpretation: item.interpretation || `${item.name} stock level is currently at ${item.percent}% capacity.`,
      recommendation: item.recommendation || `Estimated buffer time: ${item.daysLeft}.`,
      station: selectedStation,
      metadata: {
        amount: item.amount,
        daysLeft: item.daysLeft,
        percent: item.percent,
      },
    });
  };

  return (
    <div className="logistics-overview-card polaris-card">
      <div className="card-header-simple">
        <span className="card-title">LOGISTICS OVERVIEW</span>
      </div>

      <div className="logistics-table-container">
        <div className="logistics-table-header">
          <span className="col-header col-item">Item</span>
          <span className="col-header col-remaining">Remaining</span>
          <span className="col-header col-days">Days Left</span>
        </div>

        <div className="logistics-table-rows">
          {inventory.map((row) => {
            const Icon = row.icon;
            return (
              <div 
                key={row.id} 
                className="logistics-row interactive-card"
                onClick={() => handleRowClick(row)}
              >
                {/* Item Label & Icon */}
                <div className="log-col-item">
                  <Icon size={14} style={{ color: row.iconColor }} className="log-item-icon" />
                  <span className="log-item-name">{row.name}</span>
                </div>

                {/* Amount & Progress Bar */}
                <div className="log-col-remaining">
                  <span className="log-amount-text mono-num">{row.amount}</span>
                  <div className="log-progress-track">
                    <div 
                      className="log-progress-fill" 
                      style={{ 
                        width: `${row.percent}%`,
                        backgroundColor: row.barColor 
                      }} 
                    />
                  </div>
                </div>

                {/* Days Remaining */}
                <div className="log-col-days">
                  <span className="log-days-text mono-num">{row.daysLeft}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
