import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color = "bg-jkuatGreen",
}) => {
  return (
    <div className={`w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-lg shadow-md text-white ${color}`}>
      <div className="text-3xl sm:text-4xl">{icon}</div>
      <div className="mt-2 sm:mt-0 sm:ml-4">
        <p className="text-base sm:text-lg font-semibold">{value}</p>
        <p className="text-sm sm:text-base opacity-90">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
