import React from "react";
import * as LucideIcons from "lucide-react";

const IconRenderer = ({ iconName, size = 24, color = "black" }) => {
  // Dynamically get the icon component from LucideIcons object
  const IconComponent = LucideIcons[iconName];

  if (!IconComponent) {
    return LucideIcons["Home"]; // Fallback in case the icon name is invalid
  }

  return <IconComponent size={size} color={color} />;
};

export default IconRenderer;
