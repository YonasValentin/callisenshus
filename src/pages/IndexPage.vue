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
        :option-disable="(option) => option.disable"
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

// Selected fields
const selectedDate = ref(null);
const selectedTimeSlot = ref(null);
const selectedMachines = ref([]);

// Reserved slots fetched from Supabase
const reservedSlots = ref([]);

// Machines data
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

// Time slots data
const timeSlots = [
  { label: '08:00 - 10:00', value: '08:00 - 10:00' },
  { label: '10:00 - 12:00', value: '10:00 - 12:00' },
  { label: '12:00 - 14:00', value: '12:00 - 14:00' },
  { label: '14:00 - 16:00', value: '14:00 - 16:00' },
  { label: '16:00 - 18:00', value: '16:00 - 18:00' },
  { label: '18:00 - 20:00', value: '18:00 - 20:00' },
  { label: '20:00 - 22:00', value: '20:00 - 22:00' },
];

// Fetch reservations from Supabase based on the selected date
const fetchReservedSlots = async () => {
  if (!selectedDate.value) return;

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('date', selectedDate.value);

  if (error) {
    console.error('Error fetching reserved slots:', error);
  } else {
    reservedSlots.value = data || []; // Ensure reservedSlots is never null
  }
};

// Automatically fetch reserved slots when the component is mounted
onMounted(fetchReservedSlots);

// Re-fetch reserved slots whenever the date is changed
watch(selectedDate, fetchReservedSlots);

// Compute available time slots, disabling those that are reserved
const availableTimeSlots = computed(() => {
  if (!selectedDate.value) return timeSlots;

  return timeSlots.map((slot) => {
    const isReserved = reservedSlots.value.some(
      (reserved) =>
        reserved.date === selectedDate.value && reserved.timeslot === slot.value // Ensure correct casing 'timeslot'
    );
    return { ...slot, disable: isReserved };
  });
});

// Determine whether the "Submit" button should be enabled
const canSubmit = computed(() => {
  return (
    selectedDate.value &&
    selectedTimeSlot.value &&
    selectedMachines.value.length > 0
  );
});

// Submit the reservation to Supabase
const submit = async () => {
  // Extract the machine values (1, 2, 3, etc.) from the selectedMachines
  const machineValues = selectedMachines.value.map((machine) => machine.value);

  const { data, error } = await supabase.from('reservations').insert([
    {
      date: selectedDate.value,
      timeslot: selectedTimeSlot.value?.value, // Make sure this matches with the Supabase schema ('timeslot')
      machines: machineValues, // Submit the values of the selected machines
    },
  ]);

  if (error) {
    console.error('Error submitting reservation:', error);
  } else {
    console.log('Reservation submitted:', data);
    // Refresh reserved slots after submission
    fetchReservedSlots();
  }
};
</script>

<style scoped>
.text-red {
  color: red;
}
</style>
