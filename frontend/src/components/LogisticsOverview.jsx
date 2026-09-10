import React from 'react';
import { Fuel, Utensils, HeartPulse, Wrench } from 'lucide-react';

const iconMap = {
  fuel: Fuel,
  food: Utensils,
  medicine: HeartPulse,
  'spare-parts': Wrench,
};

export default function LogisticsOverview({ inventory: inventoryProp }) {
  const defaultInventory = [
    {
      id: 'fuel',
      name: 'Fuel',
      amount: '50,200 L',
      percent: 58,
      daysLeft: '43 Days',
      barColor: '#f59e0b',
      iconColor: '#f87171',
    },
    {
      id: 'food',
      name: 'Food',
      amount: '3,250 kg',
      percent: 82,
      daysLeft: '67 Days',
      barColor: '#10b981',
      iconColor: '#10b981',
    },
    {
      id: 'medicine',
      name: 'Medicine',
      amount: '620 kg',
      percent: 89,
      daysLeft: '89 Days',
      barColor: '#10b981',
      iconColor: '#10b981',
    },
    {
      id: 'spare-parts',
      name: 'Spare Parts',
      amount: '1,120 kg',
      percent: 74,
      daysLeft: '55 Days',
      barColor: '#10b981',
      iconColor: '#10b981',
    },
  ];

  const rawInventory = inventoryProp || defaultInventory;
  const inventory = rawInventory.map((item) => ({
    ...item,
    icon: iconMap[item.id] || Fuel,
  }));

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
              <div key={row.id} className="logistics-row">
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
