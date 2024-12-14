'use client';

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { useState, useEffect } from 'react';
import styles from "~/styles/openai-page.module.css";
import { AppSidebar } from "~/components/sidebar/sidebar"
import { Separator } from "~/components/ui/separator"
import Chat from "~/components/openai-components/chat";
import WeatherWidget from "~/components/openai-components/weather-widget";
import { getWeather } from "~/app/utils/weather";
import FileViewer from "~/components/openai-components//file-viewer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "~/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"

export default function Page() {
  const [weatherData, setWeatherData] = useState({});
  const { isLoaded, isSignedIn, user } = useUser();

  // Handle authentication
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!isSignedIn) {
    redirect("/sign-in");
  }

  const functionCallHandler = async (call) => {
    if (call?.function?.name !== "get_weather") return;
    const args = JSON.parse(call.function.arguments);
    const data = await getWeather(args.location);
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    OpenAI Example
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className={styles.openaiContainer}>
            <div className={styles.openaiColumn}>
              <WeatherWidget {...weatherData} />
              <FileViewer />
            </div>
            <div className={styles.openaiChatContainer}>
              <div className={styles.openaiChat}>
                <Chat functionCallHandler={functionCallHandler} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}