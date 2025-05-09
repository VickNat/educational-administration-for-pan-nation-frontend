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
      console.log("user",user);
      const payload = {
        ...values,
        directorId: user?.roleId,
      };

      if (selectedEvent) {
        await updateEvent({ ...payload, id: selectedEvent.id });
        toast.success('Event updated successfully');
      } else {
        console.log("payload",payload);
        await createEvent(payload);
        console.log("Event created successfully");
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          {isDirector && (
            <Button
              onClick={() => {
                setSelectedEvent(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Event
            </Button>
          )}
        </div>

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
            <div className="p-2 bg-blue-100 rounded-md">
              <p className="text-sm font-medium text-blue-900">
                {eventInfo.event.title}
              </p>
              <p className="text-xs text-blue-700">
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

        {/* Add/Edit Event Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
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

                  <div>
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

                  <div>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <p className="text-gray-700">{selectedEvent.title}</p>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="text-gray-700">{selectedEvent.description}</p>
                </div>
                <div>
                  <Label>Start Date</Label>
                  <p className="text-gray-700">{new Date(selectedEvent.startDate).toLocaleString()}</p>
                </div>
                <div>
                  <Label>End Date</Label>
                  <p className="text-gray-700">{new Date(selectedEvent.endDate).toLocaleString()}</p>
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
    </div>
  );
};

export default CalendarView;