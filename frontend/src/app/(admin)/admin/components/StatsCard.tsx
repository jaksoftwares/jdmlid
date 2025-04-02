import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color = "bg-jkuatGreen" }) => {
  return (
    <div className={`flex items-center p-4 rounded-lg shadow-md text-white ${color}`}>
      <div className="text-3xl">{icon}</div>
      <div className="ml-4">
        <p className="text-lg font-semibold">{value}</p>
        <p className="text-sm opacity-90">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
