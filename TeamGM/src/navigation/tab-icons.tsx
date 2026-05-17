import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';

type TabIconProps = {
  color: string;
  size: number;
};

export function HomeTabIcon({ color, size }: TabIconProps) {
  return <Ionicons name="home" size={size} color={color} />;
}

export function ScoresTabIcon({ color, size }: TabIconProps) {
  return <Ionicons name="stats-chart" size={size} color={color} />;
}

export function MyGMTabIcon({ color, size }: TabIconProps) {
  return <Ionicons name="clipboard" size={size} color={color} />;
}

export function ProfileTabIcon({ color, size }: TabIconProps) {
  return <Ionicons name="person" size={size} color={color} />;
}
