'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useGetAnnouncements } from '@/queries/announcements/queries';
import { Announcement } from '@/lib/utils/types';
import { useAuth } from '@/app/context/AuthContext';
import { RiAddLine, RiTimeLine } from 'react-icons/ri';
import { formatDistanceToNow } from 'date-fns';

interface AnnouncementCardProps {
  topic: string;
  description: string;
  image: any | null;
  directorId: string;
  id: string;
  directorName: string;
}

// AnnouncementCard Component
const AnnouncementCard = ({ topic, description, image, directorId, id, directorName }: AnnouncementCardProps) => {
  return (
    <Link href={`/dashboard/announcements/${id}`}>
      <div className="group bg-gradient-to-br from-primary/5 to-secondary/5 dark:bg-input/20 rounded-xl border-2 border-primary/20 p-4 sm:p-6 transition-all duration-300 hover:border-primary/30 hover:scale-[1.02] mb-4 break-inside-avoid">
        {/* Image (if present) */}
        {image && (
          <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden">
            <Image
              src={image}
              alt={topic}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={false}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAErgJ9d3pG7wAAAABJRU5ErkJggg=="
              loader={({ src }) => src}
              unoptimized
            />
          </div>
        )}

        {/* Content */}
        <div className="space-y-3">
          {/* Header: Topic and Time */}
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary line-clamp-2">
              {topic}
            </h2>
            {/* <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
              <RiTimeLine className="w-3 h-3" />
              <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
            </div> */}
          </div>

          {/* Description */}
          <p className="text-muted-foreground line-clamp-3">{description}</p>

          {/* Footer: Director Info */}
          <div className="pt-2 border-t border-primary/10">
            <span className="text-sm text-muted-foreground">
              Posted by Director: {directorName}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// AnnouncementsView Component
const AnnouncementsView = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const { data, isLoading } = useGetAnnouncements();
  const { user } = useAuth();

  useEffect(() => {
    if (data) {
      setAnnouncements(data.result);
    }
  }, [data]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Announcements
        </h1>
        {user?.user.role === 'DIRECTOR' && (
          <Button asChild className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity">
            <Link href="/dashboard/announcements/add" className="flex items-center gap-2">
              <RiAddLine className="w-5 h-5" />
              Add Announcement
            </Link>
          </Button>
        )}
      </div>

      {/* Feed Section: Masonry Columns */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-2">
        {announcements.length > 0 ? (
          announcements.map((announcement, index) => (
            <AnnouncementCard
              key={index}
              id={announcement.id}
              topic={announcement.topic}
              description={announcement.description}
              image={announcement.image}
              directorId={announcement.directorId}
              directorName={""}
            />
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:bg-input/20 rounded-xl border-2 border-primary/20 p-8 text-center">
              <p className="text-muted-foreground">
                No announcements available.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsView;