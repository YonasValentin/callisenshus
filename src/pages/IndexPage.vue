<template>
  <q-page class="q-pa-md">
    <!-- Date section -->
    <q-card-section>
      <q-date
        v-model="selectedDate"
        title="Select Date"
        mask="YYYY-MM-DD"
        :options="dateOptions"
      />
    </q-card-section>

    <!-- Time slot section -->
    <q-card-section>
      <q-select
        v-model="selectedTimeSlot"
        :options="availableTimeSlots"
        label="Select Time Slot"
      />
    </q-card-section>

    <!-- Machine Selection (multiple) -->
    <q-card-section>
      <q-select
        v-model="selectedMachines"
        :options="machines"
        label="Select Machines (up to 3)"
        multiple
      />
    </q-card-section>

    <!-- Submit button -->
    <q-card-section>
      <q-btn
        color="primary"
        label="Submit"
        @click="submit"
        :disable="!canSubmit"
      />
    </q-card-section>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const selectedDate = ref(null);
const selectedTimeSlot = ref(null);
const selectedMachines = ref([]);

// Dummy reserved time slots for now, will connect to Supabase later
const reservedSlots = ref([
  { date: '2024-09-16', timeSlot: '08:00 - 10:00', machines: [1, 2] },
  { date: '2024-09-17', timeSlot: '10:00 - 12:00', machines: [2, 3] },
  { date: '2024-09-16', timeSlot: '14:00 - 16:00', machines: [1] },
]);

const machines = [
  { label: 'Washing Machine 1', value: 1 },
  { label: 'Washing Machine 2', value: 2 },
  { label: 'Dryer', value: 3 },
];

// Define valid dates (today and the next 7 days)
const dateOptions = (date: string | Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  return (
    selectedDate >= today &&
    selectedDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  );
};

const timeSlots = [
  { label: '08:00 - 10:00', value: '08:00 - 10:00' },
  { label: '10:00 - 12:00', value: '10:00 - 12:00' },
  { label: '12:00 - 14:00', value: '12:00 - 14:00' },
  { label: '14:00 - 16:00', value: '14:00 - 16:00' },
  { label: '16:00 - 18:00', value: '16:00 - 18:00' },
  { label: '18:00 - 20:00', value: '18:00 - 20:00' },
  { label: '20:00 - 22:00', value: '20:00 - 22:00' },
];

// Include all time slots but disable the ones that are reserved
const availableTimeSlots = computed(() => {
  return timeSlots.map((slot) => {
    const isReserved = reservedSlots.value.some(
      (reserved) =>
        reserved.date === selectedDate.value && reserved.timeSlot === slot.value
    );
    return { ...slot, disable: isReserved };
  });
});

const canSubmit = computed(() => {
  return (
    selectedDate.value &&
    selectedTimeSlot.value &&
    selectedMachines.value.length > 0
  );
});

const submit = () => {
  console.log('selected date:', selectedDate.value);
  console.log('selected time slot:', selectedTimeSlot.value);
  console.log('selected machines:', selectedMachines.value);
};
</script>
