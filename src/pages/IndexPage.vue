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
        option-label="label"
        option-value="value"
        :option-disable="isTimeSlotDisabled"
        :emit-value="true"
        clearable
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section :class="{ 'text-red': scope.opt.disable }">
              {{ scope.opt.label }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>
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
import { ref, computed, onMounted, watch } from 'vue';
import { supabase } from 'src/api/supabase';

// Interfaces for types
interface Reservation {
  id: string;
  date: string;
  timeslot: string;
  machines: number[];
}

interface Machine {
  label: string;
  value: number;
}

interface TimeSlot {
  label: string;
  value: string;
  disable: boolean;
}

// Reactive data
const selectedDate = ref<string | null>(null);
const selectedTimeSlot = ref<string | null>(null);
const selectedMachines = ref<Machine[]>([]);
const reservedSlots = ref<Reservation[]>([]);

// Machine data
const machines: Machine[] = [
  { label: 'Washing Machine 1', value: 1 },
  { label: 'Washing Machine 2', value: 2 },
  { label: 'Dryer', value: 3 },
];

// Time slot data
const timeSlots: TimeSlot[] = [
  { label: '08:00 - 10:00', value: '08:00 - 10:00', disable: false },
  { label: '10:00 - 12:00', value: '10:00 - 12:00', disable: false },
  { label: '12:00 - 14:00', value: '12:00 - 14:00', disable: false },
  { label: '14:00 - 16:00', value: '14:00 - 16:00', disable: false },
  { label: '16:00 - 18:00', value: '16:00 - 18:00', disable: false },
  { label: '18:00 - 20:00', value: '18:00 - 20:00', disable: false },
  { label: '20:00 - 22:00', value: '20:00 - 22:00', disable: false },
];

// Utility functions
const isDateWithinRange = (date: string | Date, rangeInDays = 7) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  return (
    selected >= today &&
    selected <= new Date(today.getTime() + rangeInDays * 24 * 60 * 60 * 1000)
  );
};

// Date validation for next 7 days
const dateOptions = (date: string | Date): boolean => isDateWithinRange(date);

// Fetch reservations for selected date
const fetchReservationsForSelectedDate = async () => {
  if (!selectedDate.value) return;

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('date', selectedDate.value);

    if (error) throw new Error(error.message);

    reservedSlots.value = (data as Reservation[]) || [];
  } catch (err) {
    console.error('Error fetching reserved slots:', err);
  }
};

// Automatically fetch reservations on mount and date change
onMounted(fetchReservationsForSelectedDate);
watch(selectedDate, fetchReservationsForSelectedDate);

// Compute available time slots
const availableTimeSlots = computed(() => {
  if (!selectedDate.value) return timeSlots;

  return timeSlots.map((slot) => ({
    ...slot,
    disable: reservedSlots.value.some(
      (reserved) =>
        reserved.date === selectedDate.value && reserved.timeslot === slot.value
    ),
  }));
});

// Disable time slots
const isTimeSlotDisabled = (option: TimeSlot) => option.disable;

// Check if submit button should be enabled
const canSubmit = computed(() => {
  return (
    selectedDate.value &&
    selectedTimeSlot.value &&
    selectedMachines.value.length > 0
  );
});

// Submit the reservation
const submit = async () => {
  if (
    !selectedDate.value ||
    !selectedTimeSlot.value ||
    !selectedMachines.value.length
  ) {
    console.error('Missing required fields');
    return;
  }

  try {
    const machineValues = selectedMachines.value.map(
      (machine) => machine.value
    );
    const timeslot = selectedTimeSlot.value;
    const date = selectedDate.value;

    const { data, error } = await supabase.from('reservations').insert([
      {
        date,
        timeslot,
        machines: machineValues,
      },
    ]);

    if (error) throw new Error(error.message);

    console.log('Reservation submitted:', data);
    await fetchReservationsForSelectedDate(); // Refresh after submitting
  } catch (err) {
    console.error('Error submitting reservation:', err);
  }
};
</script>

<style scoped>
.text-red {
  color: red;
}
</style>
