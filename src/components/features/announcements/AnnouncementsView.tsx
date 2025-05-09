'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/../public/images/logo.png';
import { useGetAnnouncements } from '@/queries/announcements/queries';
import { Announcement } from '@/lib/utils/types';

// Dummy data for announcements
const announcementsData = [
  {
    topic: "Midterm Exam Schedule",
    description: "Please review the attached schedule for midterms.",
    image: logo,
    directorId: "director123",
  },
  {
    topic: "School Event: Science Fair",
    description: "Join us for the annual Science Fair on May 10th!",
    image: null,
    directorId: "director124",
  },
  {
    topic: "Parent-Teacher Meeting",
    description: "Scheduled for May 15th. Please RSVP by May 12th.",
    image: logo,
    directorId: "director123",
  },
];

interface AnnouncementCardProps {
  topic: string;
  description: string;
  image: any | null;
  directorId: string;
  id: string;
}

// AnnouncementCard Component
const AnnouncementCard = ({ topic, description, image, directorId, id }: AnnouncementCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <Link href={`/dashboard/announcements/${id}`}>
        {/* Header: Topic and Director */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-900">{topic}</h2>
          <span className="text-sm text-muted-foreground">
            Posted by Director ID: {directorId}
          </span>
        </div>

        {/* Image (if present) */}
        {image && (
          <div className="relative w-full h-64 mb-4">
            <Image
              src={image}
              alt={topic}
              fill
              className="object-cover rounded-md"
              priority={false}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAErgJ9d3pG7wAAAABJRU5ErkJggg=="
            />
          </div>
        )}

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </Link>
    </div>
  );
};

// AnnouncementsView Component
const AnnouncementsView = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const { data, isLoading } = useGetAnnouncements();

  useEffect(() => {
    if (data) {
      setAnnouncements(data.result);
    }
  }, [data]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Paper-like Background Container (No Shadow) */}
      <div className="bg-white rounded-lg p-6">
        {/* Header Section (No Path) */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard/announcements/add">Add Announcement</Link>
          </Button>
        </div>

        {/* Feed Section */}
        <div className="space-y-6">
          {announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <AnnouncementCard
                key={index}
                id={announcement.id}
                topic={announcement.topic}
                description={announcement.description}
                image={announcement.image}
                directorId={announcement.directorId}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              No announcements available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsView;