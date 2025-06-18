'use client';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary?: string;
}

export default function JobCard({
  title,
  company,
  location,
  type,
  description,
  salary,
}: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600">{company}</p>
        </div>
        {salary && (
          <span className="text-sm font-medium text-green-600">{salary}</span>
        )}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {type}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          {location}
        </span>
      </div>
      
      <p className="mt-4 text-gray-600 line-clamp-3">{description}</p>
      
      <div className="mt-6">
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
          Apply Now
        </button>
      </div>
    </div>
  );
} 