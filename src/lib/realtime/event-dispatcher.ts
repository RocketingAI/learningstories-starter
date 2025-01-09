import { type RealtimeServerEvent } from '~/types/realtime-events';

export type EventHandler = (event: RealtimeServerEvent) => void;

export class EventDispatcher {
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private debugMode: boolean = false;

  constructor(debug: boolean = false) {
    this.debugMode = debug;
  }

  subscribe(eventType: string, handler: EventHandler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(eventType);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.handlers.delete(eventType);
        }
      }
    };
  }

  dispatch(event: RealtimeServerEvent) {
    if (this.debugMode) {
      console.log(`[EventDispatcher] Dispatching event:`, event);
    }

    // Handle specific event type
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`[EventDispatcher] Error in handler for ${event.type}:`, error);
        }
      });
    }

    // Handle wildcard subscribers
    const wildcardHandlers = this.handlers.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`[EventDispatcher] Error in wildcard handler:`, error);
        }
      });
    }
  }

  // Helper to subscribe to multiple event types at once
  subscribeMultiple(eventTypes: string[], handler: EventHandler) {
    const unsubscribers = eventTypes.map(type => this.subscribe(type, handler));
    return () => unsubscribers.forEach(unsub => unsub());
  }

  // Helper to subscribe to all events
  subscribeAll(handler: EventHandler) {
    return this.subscribe('*', handler);
  }

  // Enable/disable debug logging
  setDebugMode(enabled: boolean) {
    this.debugMode = enabled;
  }
}
