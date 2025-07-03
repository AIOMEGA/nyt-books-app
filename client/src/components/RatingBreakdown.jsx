// Displays a small breakdown of rating percentages
import React from "react";

export default function RatingBreakdown({ ratings = [] }) {
  // Count how many ratings fall into each star bucket
  const counts = [0, 0, 0, 0, 0];
  ratings.forEach((r) => {
    const val = Math.round(r);
    if (val >= 1 && val <= 5) counts[val - 1] += 1;
  });

  const total = ratings.length;

  // Display bar graph style breakdown
  return (
    <div className="space-y-1 mt-1">
      <p className="text-xs text-gray-300">
        {total} rating{total !== 1 ? "s" : ""}
      </p>
      {[5, 4, 3, 2, 1].map((star) => {
        const count = counts[star - 1];
        const percent = total ? (count / total) * 100 : 0;
        return (
          <div key={star} className="flex items-center gap-1 text-xs">
            <span className="w-[44px] text-left">{star}⭐</span>
            <div className="w-full max-w-[160px] h-3 bg-gray-200 rounded-full">
              <div
                className="h-3 bg-yellow-400 rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="w-10 text-right">{Math.round(percent)}%</span>
          </div>
        );
      })}
    </div>
  );
}
