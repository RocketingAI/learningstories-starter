"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import styles from "~/styles/openai-page.module.css";
import Chat from "~/components/openai-components/chat";
import WeatherWidget from "~/components/openai-components/weather-widget";
import { getWeather } from "~/app/utils/weather";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { AppSidebar } from "~/components/sidebar/sidebar";
import { Separator } from "~/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "~/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

interface WeatherData {
  location?: string;
  temperature?: number;
  conditions?: string;
}

export default function Page() {
  const { isLoaded, isSignedIn } = useUser();
  const [weatherData, setWeatherData] = useState<WeatherData>({});
  const isEmpty = Object.keys(weatherData).length === 0;

  if (!isLoaded) {
    return null;
  }
  
  if (!isSignedIn) {
    return redirect("/sign-in");
  }

  const functionCallHandler = async (call: RequiredActionFunctionToolCall) => {
    if (call?.function?.name !== "get_weather") return;
    const args = JSON.parse(call.function.arguments);
    const data = getWeather(args.location);
    setWeatherData(data);
    return JSON.stringify(data);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/examples">Examples</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Function Calling</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className={styles.openaiMain}>
          <div className={styles.openaiContainer}>
            <div className={styles.openaiColumn}>
              <WeatherWidget
                location={weatherData.location || "---"}
                temperature={weatherData.temperature?.toString() || "---"}
                conditions={weatherData.conditions || "Sunny"}
                isEmpty={isEmpty}
              />
            </div>
            <div className={styles.openaiChatContainer}>
              <div className={styles.openaiChat}>
                <Chat functionCallHandler={functionCallHandler} />
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
