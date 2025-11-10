interface Vitals {
  heartRate: number;
  pulse: number; // Represents SpO2
}

interface Alarm {
  time: string | null;
}

interface Disease {
  name: string | null;
  timestamp: number | null;
}

type AlarmStatus = 'idle' | 'ringing';
type DoctorStatus = 'idle' | 'coming';

// In-memory store. In a real-world scenario, you would use a database.
// This is not safe for concurrent requests or multiple server instances, but fine for this demo.
let store = {
  latestVitals: { heartRate: 0, pulse: 0 } as Vitals,
  alarm: { time: null } as Alarm,
  alarmStatus: 'idle' as AlarmStatus,
  doctorStatus: 'idle' as DoctorStatus,
  historicalHeartRates: [],
  latestDisease: { name: null, timestamp: null } as Disease,
};

export const getLatestVitals = () => store.latestVitals;
export const getHistoricalHeartRates = () => store.historicalHeartRates;
export const updateVitals = (data: Vitals) => {
  store.latestVitals = data;
  if (data.heartRate) {
    store.historicalHeartRates.push(data.heartRate);
    // Keep the last 50 readings
    if (store.historicalHeartRates.length > 50) {
      store.historicalHeartRates.shift();
    }
  }
};

export const getAlarm = () => store.alarm;
export const setAlarm = (data: Alarm) => {
  store.alarm = data;
};

export const getAlarmStatus = () => store.alarmStatus;
export const setAlarmStatus = (status: AlarmStatus) => {
  store.alarmStatus = status;
}

export const getDoctorStatus = () => store.doctorStatus;
export const setDoctorStatus = (status: DoctorStatus) => {
  store.doctorStatus = status;
}

export const getLatestDisease = () => store.latestDisease;
export const setLatestDisease = (data: { name: string | null }) => {
  if (data.name) {
    store.latestDisease = { name: data.name, timestamp: Date.now() };
  } else {
    store.latestDisease = { name: null, timestamp: null };
  }
};
