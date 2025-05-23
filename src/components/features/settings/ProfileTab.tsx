"use client";
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '../../../app/context/AuthContext';
import { useUpdateUser } from '@/queries/users/mutations';
import { toast } from 'react-hot-toast';

export default function ProfileTab() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.user?.firstName || '');
  const [lastName, setLastName] = useState(user?.user?.lastName || '');
  const [phone, setPhone] = useState(user?.user?.phoneNumber || '');
  const updateUser = useUpdateUser();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser.mutateAsync({
        input: {
          firstName,
          lastName,
          phoneNumber: phone,
        },
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSave}>
      {/* <div className="flex items-center gap-4">
        <Image
          src={'/images/logo.png'}
          alt="Profile"
          width={80}
          height={80}
          className="rounded-full"
          unoptimized
        />
        <div>
          <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Change Photo
          </button>
          <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. Max size of 800K</p>
        </div>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
          disabled={updateUser.isPending}
        >
          {updateUser.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
} 