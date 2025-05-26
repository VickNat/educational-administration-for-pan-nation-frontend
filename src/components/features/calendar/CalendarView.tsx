'use client'

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useGetCalendarEvents } from '@/queries/calendar/queries';
import { useCreateCalendarEvent, useDeleteCalendarEvent, useUpdateCalendarEvent } from '@/queries/calendar/mutations';
import { useAuth } from '@/app/context/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { CalendarEvent } from './types';

const eventSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string().required('End date is required'),
});

const CalendarView = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { user } = useAuth();
  const { data: eventsData, isLoading, error } = useGetCalendarEvents();
  const { mutateAsync: createEvent } = useCreateCalendarEvent();
  const { mutateAsync: deleteEvent } = useDeleteCalendarEvent(selectedEvent?.id || '');
  const { mutateAsync: updateEvent } = useUpdateCalendarEvent(selectedEvent?.id || '');

  const isDirector = user?.user?.role === 'DIRECTOR';

  // Map API events to FullCalendar format
  const mappedEvents = (eventsData?.result || []).map((event: CalendarEvent) => ({
    id: event.id,
    title: event.title,
    start: event.startDate,
    end: event.endDate,
    extendedProps: {
      description: event.description,
      directorId: event.directorId,
      createdBy: event.createdBy,
      startDate: event.startDate,
      endDate: event.endDate,
    },
  }));

  const handleEventClick = (info: any) => {
    const ext = info.event.extendedProps;
    const event: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      description: ext.description,
      startDate: ext.startDate,
      endDate: ext.endDate,
      directorId: ext.directorId,
      createdBy: ext.createdBy,
    };
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      await deleteEvent();
      toast.success('Event deleted successfully');
      setIsViewModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const payload = {
        ...values,
        directorId: user?.roleId,
      };

      if (selectedEvent) {
        await updateEvent({ ...payload, id: selectedEvent.id });
        toast.success('Event updated successfully');
      } else {
        await createEvent(payload);
        toast.success('Event created successfully');
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(selectedEvent ? 'Failed to update event' : 'Failed to create event');
    }
  };

  const initialValues = selectedEvent || {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  };

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-none">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Calendar</h1>
          <p className="text-muted-foreground text-base">School events and schedules</p>
        </div>
        {isDirector && (
          <Button
            onClick={() => {
              setSelectedEvent(null);
              setIsModalOpen(true);
            }}
            className="bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-2 rounded-lg shadow-none hover:opacity-90 transition"
          >
            Add Event
          </Button>
        )}
      </div>

      {/* Calendar Card */}
      <div className="bg-white/90 rounded-2xl border border-primary/10 p-6 shadow-none">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={mappedEvents}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          eventContent={(eventInfo: any) => (
            <div className="p-2 bg-primary/10 rounded-md border border-primary/10">
              <p className="text-sm font-semibold text-primary line-clamp-1">
                {eventInfo.event.title}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {eventInfo.event.extendedProps.description}
              </p>
            </div>
          )}
          height="auto"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short',
          }}
          eventClick={handleEventClick}
        />
      </div>

      {/* Add/Edit Event Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-2xl border border-primary/10">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={initialValues}
            validationSchema={eventSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Field
                    as={Input}
                    id="title"
                    name="title"
                    placeholder="Event title"
                  />
                  {errors.title && touched.title && (
                    <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    placeholder="Event description"
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Field
                      as={Input}
                      id="startDate"
                      name="startDate"
                      type="datetime-local"
                    />
                    {errors.startDate && touched.startDate && (
                      <div className="text-red-500 text-sm mt-1">{errors.startDate}</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="endDate">End Date</Label>
                    <Field
                      as={Input}
                      id="endDate"
                      name="endDate"
                      type="datetime-local"
                    />
                    {errors.endDate && touched.endDate && (
                      <div className="text-red-500 text-sm mt-1">{errors.endDate}</div>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedEvent ? 'Update Event' : 'Add Event'}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* View Event Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="rounded-2xl border border-primary/10">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <p className="text-gray-700 font-semibold text-lg">{selectedEvent.title}</p>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-gray-700 whitespace-pre-line">{selectedEvent.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label>Start Date</Label>
                  <p className="text-gray-700">{new Date(selectedEvent.startDate).toLocaleString()}</p>
                </div>
                <div className="flex-1">
                  <Label>End Date</Label>
                  <p className="text-gray-700">{new Date(selectedEvent.endDate).toLocaleString()}</p>
                </div>
              </div>
              {selectedEvent.createdBy && (
                <div>
                  <Label>Created By</Label>
                  <p className="text-gray-700">
                    {selectedEvent.createdBy.user.firstName} {selectedEvent.createdBy.user.lastName} ({selectedEvent.createdBy.user.email})
                  </p>
                </div>
              )}
              {isDirector && (
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteEvent}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;