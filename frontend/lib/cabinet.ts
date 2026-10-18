/** Home-page parts cabinet. Static until the Phase 2 category tree replaces it. */
export const CABINET = [
  { slug: 'batteries', name: 'Batteries', parts: '18650, 21700, LiFePO4' },
  { slug: 'bms-boards', name: 'BMS boards', parts: '3S, 4S, 7S, 13S' },
  { slug: 'microcontrollers', name: 'Microcontrollers', parts: 'ESP32, STM32, ATmega328P' },
  { slug: 'ics', name: 'ICs', parts: 'LM2596, NE555, TP4056' },
  { slug: 'resistors', name: 'Resistors', parts: '10\u00a0kΩ, ¼\u00a0W, SMD\u00a00805' },
  { slug: 'capacitors', name: 'Capacitors', parts: '100\u00a0µF, MLCC, 25\u00a0V' },
  { slug: 'electric-tools', name: 'Electric tools', parts: 'Irons, meters, crimpers' },
];

export const SEARCH_EXAMPLES = ['ESP32-WROOM-32', '18650 3000 mAh', '4S 40A BMS', 'LM2596 buck', 'TP4056 charger', '10 kΩ 0805'];

export const QUICK_SEARCHES = [
  { q: '18650', label: '18650 cells' },
  { q: '4S BMS', label: '4S BMS' },
  { q: 'ESP32', label: 'ESP32' },
  { q: 'LM2596', label: 'LM2596 buck' },
  { q: '10k resistor', label: '10\u00a0kΩ resistors' },
];
