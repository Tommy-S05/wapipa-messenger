import {createContext, useContext, useState} from "react";

export const EventBusContext = createContext();

export const EventBusProvider = ({children}) => {
    const [events, setEvents] = useState({});

    const emit = (name, data) => {
        if (!events[name]) {
            return;
        }

        for (let callback of events[name]) {
            callback(data);
        }
        // events[name].forEach((callback) => {
        //     callback(data);
        // });
    }

    const on = (name, callback) => {
        if (!events[name]) {
            events[name] = [];
        }

        events[name].push(callback);

        return () => {
            events[name] = events[name].filter((cb) => cb !== callback);
        }
    };

    return (
        <EventBusContext.Provider value={{emit, on}}>
            {children}
        </EventBusContext.Provider>
    );
}

export const useEventBus = () => {
    return useContext(EventBusContext);
}
