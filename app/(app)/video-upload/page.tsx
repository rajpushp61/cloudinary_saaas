"use client"
import React,{useState} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'


function VideoUpload() {

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const[isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  //max file size of 670mb
  const MAX_FILE_SIZE = 70*1024*1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!file || !title || !description) return;
    if(file.size > MAX_FILE_SIZE) return alert('File is too large. Max file size is 70mb');
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append("originalSize", file.size.toString());

    try {
      await axios.post('/api/video-upload', formData)
      router.push('/');
      
    } catch (error) {
      console.log(error);
    }
    finally{
      setIsUploading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
          required
          style={{color:'wheat'}}
        />
      </div>
      <div>
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
          style={{color:'wheat'}}
        />
      </div>
      <div>
        <label className="label">
          <span className="label-text">Video File</span>
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="file-input file-input-bordered w-full"
          required
          style={{color:'wheat'}}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload Video"}
      </button>
    </form>
  </div>
);
}

export default VideoUpload
