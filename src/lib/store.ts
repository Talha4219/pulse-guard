interface Vitals {
  heartRate: number;
  pulse: number; // Represents SpO2
}

interface Alarm {
  time: string;
}

// In-memory store. In a real-world scenario, you would use a database.
// This is not safe for concurrent requests or multiple server instances, but fine for this demo.
let store = {
  latestVitals: { heartRate: 75, pulse: 98 } as Vitals,
  alarm: { time: '07:00' } as Alarm,
  historicalHeartRates: [72, 74, 75, 73, 76, 75, 77, 76, 75, 74, 78, 79],
};

export const getLatestVitals = () => store.latestVitals;
export const getHistoricalHeartRates = () => store.historicalHeartRates;
export const updateVitals = (data: Vitals) => {
  store.latestVitals = data;
  store.historicalHeartRates.push(data.heartRate);
  // Keep the last 50 readings
  if (store.historicalHeartRates.length > 50) {
    store.historicalHeartRates.shift();
  }
};

export const getAlarm = () => store.alarm;
export const setAlarm = (data: Alarm) => {
  store.alarm = data;
};
