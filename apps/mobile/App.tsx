/**
 * StudyFlow Mobile App
 * 入口文件
 */

import React from "react";
import { Navigation } from "./src/navigation";
import { Providers } from "./src/providers/Providers";

export default function App() {
  return (
    <Providers>
      <Navigation />
    </Providers>
  );
}
