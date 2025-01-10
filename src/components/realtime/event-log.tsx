'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { ApiEvent } from './types';

interface EventItemProps {
  event: ApiEvent;
  timestamp: string;
}

function Event({ event, timestamp }: EventItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isClient = event.event_id && !event.event_id.startsWith('event_');

  return (
    <div className="flex flex-col gap-2 p-2 rounded-md bg-gray-50">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isClient ? (
          <ArrowDown className="text-blue-400 h-4 w-4" />
        ) : (
          <ArrowUp className="text-green-400 h-4 w-4" />
        )}
        <div className="text-sm text-gray-500">
          {isClient ? "client:" : "server:"}
          &nbsp;{event.type} | {timestamp}
        </div>
      </div>
      <div
        className={`text-gray-500 bg-gray-200 p-2 rounded-md overflow-x-auto ${
          isExpanded ? "block" : "hidden"
        }`}
      >
        <pre className="text-xs">{JSON.stringify(event.data, null, 2)}</pre>
      </div>
    </div>
  );
}

interface EventLogProps {
  events: ApiEvent[];
}

export function EventLog({ events }: EventLogProps) {
  const eventsToDisplay = [];
  const deltaEvents: Record<string, ApiEvent> = {};

  events.forEach((event) => {
    if (event.type.endsWith('delta')) {
      if (deltaEvents[event.type]) {
        // for now just log a single event per render pass
        return;
      } else {
        deltaEvents[event.type] = event;
      }
    }

    eventsToDisplay.push(
      <Event
        key={event.event_id}
        event={event}
        timestamp={new Date().toLocaleTimeString()}
      />,
    );
  });

  return (
    <div className="flex flex-col gap-2 overflow-x-auto">
      {events.length === 0 ? (
        <div className="text-gray-500">Awaiting events...</div>
      ) : (
        eventsToDisplay
      )}
    </div>
  );
}
