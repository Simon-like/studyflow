/**
 * StudyFlow Mobile App
 * 入口文件
 */

import React from 'react';
import { Navigation } from './src/navigation';
import { DialogProvider } from './src/providers/DialogProvider';

export default function App() {
  return (
    <DialogProvider>
      <Navigation />
    </DialogProvider>
  );
}
