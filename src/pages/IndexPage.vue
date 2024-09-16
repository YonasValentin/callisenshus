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
        :option-disable="disableOption"
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

// Date validation for next 7 days
const dateOptions = (date: string | Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);

  return (
    selected >= today &&
    selected <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  );
};

// Fetch reservations for selected date
const fetchReservationsForSelectedDate = async () => {
  if (!selectedDate.value) return;

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('date', selectedDate.value);

  if (error) {
    console.error('Error fetching reserved slots:', error);
  } else {
    reservedSlots.value = (data as Reservation[]) || [];
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

// Disable reserved time slots
const disableOption = (option: TimeSlot) => option.disable;

// Determine if "Submit" button should be enabled
const canSubmit = computed(() => {
  return (
    selectedDate.value &&
    selectedTimeSlot.value &&
    selectedMachines.value.length > 0
  );
});

// Submit the reservation
const submit = async () => {
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

    if (error) {
      console.error('Error submitting reservation:', error);
    } else {
      console.log('Reservation submitted:', data);
      fetchReservationsForSelectedDate(); // Refresh after submitting
    }
  } catch (e) {
    console.error('Error during submission:', e);
  }
};
</script>

<style scoped>
.text-red {
  color: red;
}
</style>
