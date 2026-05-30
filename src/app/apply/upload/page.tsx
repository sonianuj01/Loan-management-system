'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadSlipPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type (PDF/JPG/PNG) and size (Max 5MB)
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Only JPG, PNG, and PDF formats are allowed.');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5 MB.');
        return;
      }

      setError('');
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // In a production app, you would upload to AWS S3, Cloudinary, etc., here.
    // For this assignment, you can simulate the upload or base64 encode small files.
    // Assuming upload is successful:
    
    router.push('/apply/loan-config');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-2">Step 3: Upload Salary Slip</h1>
        <p className="text-gray-400 text-sm mb-6">Please upload your latest salary slip to verify income.</p>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-400">PDF, PNG, or JPG (MAX. 5MB)</p>
              </div>
              <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
            </label>
          </div>

          {file && (
            <div className="p-3 bg-gray-900 rounded border border-gray-700 text-gray-300 text-sm flex justify-between">
              <span>{file.name}</span>
              <span className="text-emerald-400 font-semibold">Ready</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={!file}
            className={`w-full px-4 py-3 mt-4 font-bold text-white rounded-lg transition-colors ${!file ? 'bg-gray-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            Upload & Continue
          </button>
        </form>
      </div>
    </div>
  );
}