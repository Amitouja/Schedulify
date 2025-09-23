import React, { useState } from 'react';
import { Modal } from './Modal';
import { CourseType, Day, NewCourseData, TimeSlot } from '../types';
import { PlusCircleIcon } from './icons/PlusCircleIcon';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courseData: NewCourseData) => void;
  facultyId: string;
}

const timeOptions = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 5 PM

export const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose, onSubmit, facultyId }) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [credits, setCredits] = useState(3);
  const [capacity, setCapacity] = useState(30);
  const [type, setType] = useState<CourseType>(CourseType.Major);
  const [slots, setSlots] = useState<TimeSlot[]>([{ day: Day.Monday, start: 9, end: 10 }]);

  const resetForm = () => {
    setCode('');
    setName('');
    setDescription('');
    setCredits(3);
    setCapacity(30);
    setType(CourseType.Major);
    setSlots([{ day: Day.Monday, start: 9, end: 10 }]);
  }

  const handleAddSlot = () => {
    setSlots([...slots, { day: Day.Monday, start: 9, end: 10 }]);
  };

  const handleRemoveSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };
  
  const handleSlotChange = (index: number, field: keyof TimeSlot, value: string | number) => {
    const newSlots = [...slots];
    const slot = newSlots[index];
    if (field === 'day') {
        slot.day = value as Day;
    } else {
        const numValue = Number(value);
        slot[field] = numValue;
        // Ensure end time is always after start time
        if (field === 'start' && numValue >= slot.end) {
            slot.end = numValue + 1;
        }
    }
    setSlots(newSlots);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !description || slots.length === 0) {
        alert("Please fill all required fields.");
        return;
    }
    const courseData: NewCourseData = {
        code, name, description, credits, capacity, type, slots, facultyId
    };
    onSubmit(courseData);
    resetForm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a New Course">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Course Code</label>
            <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Course Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Credits</label>
            <input type="number" min="1" max="5" value={credits} onChange={e => setCredits(Number(e.target.value))} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Capacity</label>
            <input type="number" min="1" max="200" value={capacity} onChange={e => setCapacity(Number(e.target.value))} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Course Type</label>
            <select value={type} onChange={e => setType(e.target.value as CourseType)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                {Object.values(CourseType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
           <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required></textarea>
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-slate-700 mb-2">Time Slots</h4>
          <div className="space-y-3">
            {slots.map((slot, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-md">
                <select value={slot.day} onChange={e => handleSlotChange(index, 'day', e.target.value)} className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    {Object.values(Day).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={slot.start} onChange={e => handleSlotChange(index, 'start', e.target.value)} className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    {timeOptions.map(t => <option key={t} value={t}>{t}:00</option>)}
                </select>
                <select value={slot.end} onChange={e => handleSlotChange(index, 'end', e.target.value)} className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    {timeOptions.filter(t => t > slot.start).map(t => <option key={t} value={t}>{t}:00</option>)}
                </select>
                <button type="button" onClick={() => handleRemoveSlot(index)} className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-100">&times;</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddSlot} className="mt-2 flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-800">
            <PlusCircleIcon className="w-5 h-5"/>
            <span>Add another slot</span>
          </button>
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none">Create Course</button>
        </div>
      </form>
    </Modal>
  );
};