import React from "react";
import {
  UtensilsCrossed,
  ShoppingBag,
  Receipt,
  Gamepad2,
  Car,
  Home,
  HeartPulse,
  GraduationCap,
  Plane,
  Film,
  Dog,
  Zap,
  ShoppingCart,
  Utensils,
  BookOpen,
  CreditCard,
  Dumbbell,
  Shirt,
  Gift,
  Briefcase,
  Music,
  PawPrint,
  Library,
  Users,
} from "lucide-react";

// Map category to icon
export const getCategoryIcon = (category: String) => {
  switch (category.toLowerCase()) {
    case "utensils-crossed":
      return <UtensilsCrossed color="#FF5252" />;
    case "shirt":
      return <Shirt color="#4285F4" />;
    case "receipt":
      return <Receipt color="#FF9800" />;
    case "gamepad-2":
      return <Gamepad2 color="#42A5F5" />;
    case "car":
      return <Car color="#4CAF50" />;
    case "heart-pulse":
      return <HeartPulse color="#E91E63" />;
    case "graduation-cap":
      return <GraduationCap color="#3F51B5" />;
    case "plane":
      return <Plane color="#009688" />;
    case "film":
      return <Film color="#FFC107" />;
    case "dog":
      return <Dog color="#795548" />;
    case "zap":
      return <Zap color="#607D8B" />;
    case "shopping-cart":
      return <ShoppingCart color="#8BC34A" />;
    case "book-open":
      return <BookOpen color="#673AB7" />;
    case "credit-card":
      return <CreditCard color="#9C27B0" />;
    case "dumbbell":
      return <Dumbbell color="#FF5722" />;
    case "gift":
      return <Gift color="#FF9800" />;
    case "briefcase":
      return <Briefcase color="#2196F3" />;
    case "music":
      return <Music color="#3F51B5" />;
    case "paw-print":
      return <PawPrint color="#FFEB3B" />;
    case "library":
      return <Library color="#9E9E9E" />;
    case "users":
      return <Users color="#00BCD4" />;
    case "shopping-bag":
      return <ShoppingBag color="#FF5722" />;
    case "utensils":
      return <Utensils color="#4CAF50" />;
    default:
      return <Home color="#9C27B0" />;
  }
};

export const IconPicker = ({
  selectedIcon,
  onSelect,
}: {
  selectedIcon: string;
  onSelect: (icon: string) => void;
}) => {
  const icons = [
    "home",
    "utensils-crossed",
    "shirt",
    "receipt",
    "gamepad-2",
    "car",
    "heart-pulse",
    "graduation-cap",
    "plane",
    "film",
    "dog",
    "zap",
    "shopping-cart",
    "book-open",
    "credit-card",
    "dumbbell",
    "gift",
    "briefcase",
    "music",
    "paw-print",
    "library",
    "users",
    "shopping-bag",
    "utensils",
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {icons.map((icon) => (
        <div
          key={icon}
          onClick={() => onSelect(icon)}
          style={{
            cursor: "pointer",
            border:
              selectedIcon === icon
                ? "2px solid blue"
                : "2px solid transparent",
            borderRadius: "50%",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {getCategoryIcon(icon)}
        </div>
      ))}
    </div>
  );
};
