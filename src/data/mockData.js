export const initialRequests = [
  { id: 'REQ-1048', title: 'Drinking water bottles', category: 'Water', quantity: 100, unit: 'bottles', urgency: 'Critical', location: 'Main Event Ground', status: 'Open', time: '2 min ago' },
  { id: 'REQ-1047', title: 'First-aid kits', category: 'Medical', quantity: 12, unit: 'kits', urgency: 'High', location: 'Sports Block', status: 'Matched', time: '14 min ago' },
  { id: 'REQ-1046', title: 'Packed meal boxes', category: 'Food', quantity: 80, unit: 'boxes', urgency: 'Medium', location: 'Student Activity Center', status: 'Dispatched', time: '32 min ago' },
  { id: 'REQ-1045', title: 'Extension cables', category: 'Equipment', quantity: 8, unit: 'units', urgency: 'Low', location: 'Auditorium', status: 'Fulfilled', time: '1 hr ago' },
]

export const initialResources = [
  { id: 'RES-201', name: 'Bottled water', category: 'Water', donor: 'North Cafeteria', quantity: 70, reserved: 0, unit: 'bottles', location: 'Block A', reliability: 96, color: 'blue' },
  { id: 'RES-202', name: 'Bottled water', category: 'Water', donor: 'Sports Club', quantity: 50, reserved: 0, unit: 'bottles', location: 'Sports Block', reliability: 91, color: 'cyan' },
  { id: 'RES-203', name: 'First-aid kits', category: 'Medical', donor: 'Campus Health Center', quantity: 18, reserved: 6, unit: 'kits', location: 'Health Center', reliability: 99, color: 'rose' },
  { id: 'RES-204', name: 'Packed meals', category: 'Food', donor: 'Green Kitchen', quantity: 120, reserved: 40, unit: 'boxes', location: 'North Cafeteria', reliability: 88, color: 'amber' },
]

export const activitySeed = [
  { id: 1, icon: 'check', title: 'Allocation received', detail: 'REQ-1045 · Extension cables', time: '4 min ago', tone: 'green' },
  { id: 2, icon: 'truck', title: 'Dispatch confirmed', detail: 'REQ-1046 · 80 meal boxes', time: '18 min ago', tone: 'blue' },
  { id: 3, icon: 'target', title: 'New critical request', detail: 'REQ-1048 · Main Event Ground', time: '22 min ago', tone: 'orange' },
]