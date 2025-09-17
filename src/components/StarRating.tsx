import { useState } from "react";
import { Star } from "lucide-react";
import { Label } from "@/components/ui/label";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  label?: string;
  readonly?: boolean;
}

const StarRating = ({
  rating,
  onRatingChange,
  label,
  readonly = false,
}: StarRatingProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {label && <Label>{label} ({rating}/5)</Label>}
      <div className="flex space-x-1">
        {Array.from({ length: 5 }, (_, index) => {
          const starNumber = index + 1;
          const isFilled = hovered !== null ? starNumber <= hovered : starNumber <= rating;

          return (
            <Star
              key={starNumber}
              size={24}
              className={`${
                isFilled
                  ? "text-yellow-400 fill-current"
                  : "text-muted-foreground"
              } ${!readonly ? "cursor-pointer" : "cursor-default"}`}
              onClick={!readonly ? () => onRatingChange(starNumber) : undefined}
              onMouseEnter={!readonly ? () => setHovered(starNumber) : undefined}
              onMouseLeave={!readonly ? () => setHovered(null) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StarRating;
