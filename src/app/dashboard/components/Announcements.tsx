import Image from 'next/image';
import { RiMoreLine, RiPlayCircleFill } from 'react-icons/ri';
import { placeholderImages } from './placeholders';

interface Announcement {
  id: number;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content: string;
  date: string;
  video?: {
    thumbnail: string;
    url: string;
  };
}

const announcements: Announcement[] = [
  {
    id: 1,
    author: {
      name: 'Jane',
      role: 'Teacher',
      avatar: placeholderImages.avatar
    },
    content: 'Today was the best class I have ever had! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor eleifend dui at amet mattis tincidunt.',
    date: 'Feb 14, 2024',
    video: {
      thumbnail: placeholderImages.videoThumbnail,
      url: '#'
    }
  },
  {
    id: 2,
    author: {
      name: 'Jane',
      role: 'Teacher',
      avatar: placeholderImages.avatar
    },
    content: 'Today was the best class I have ever had! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor eleifend dui at amet mattis tincidunt.',
    date: 'Feb 14, 2024'
  },
  {
    id: 3,
    author: {
      name: 'Jane',
      role: 'Teacher',
      avatar: placeholderImages.avatar
    },
    content: 'Today was the best class I have ever had! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor eleifend dui at amet mattis tincidunt.',
    date: 'Feb 14, 2024',
    video: {
      thumbnail: placeholderImages.videoThumbnail,
      url: '#'
    }
  }
];

export default function Announcements() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Announcements</h2>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image
                    src={announcement.author.avatar}
                    alt={announcement.author.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{announcement.author.name}</h3>
                    <span className="text-sm text-gray-500">{announcement.author.role}</span>
                  </div>
                  <p className="mt-1 text-gray-600 text-sm">{announcement.content}</p>
                  {announcement.video && (
                    <div className="mt-3 relative rounded-xl overflow-hidden">
                      <Image
                        src={announcement.video.thumbnail}
                        alt="Video thumbnail"
                        width={400}
                        height={225}
                        className="w-full object-cover rounded-xl"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <RiPlayCircleFill className="w-12 h-12 text-white hover:text-white/90 cursor-pointer" />
                      </div>
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-500">{announcement.date}</div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <RiMoreLine className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 