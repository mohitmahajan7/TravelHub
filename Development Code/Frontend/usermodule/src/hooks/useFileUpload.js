import { useState, useCallback } from 'react';

export const useFileUpload = () => {
  const [attachments, setAttachments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const handleFileSelect = useCallback((files) => {
    const newAttachments = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      type: file.type,
      size: formatFileSize(file.size),
      uploadDate: new Date().toLocaleDateString(),
      uploaded: false,
      url: URL.createObjectURL(file)
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    return newAttachments;
  }, [formatFileSize]);

  const simulateUpload = useCallback((fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setAttachments(prev => prev.map(att => 
          att.id === fileId ? { ...att, uploaded: true } : att
        ));
      }
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: progress
      }));
    }, 200);
  }, []);

  const handleRemoveAttachment = useCallback((attachmentId) => {
    const attachment = attachments.find(att => att.id === attachmentId);
    if (attachment && attachment.url) {
      URL.revokeObjectURL(attachment.url);
    }
    
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));

    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[attachmentId];
      return newProgress;
    });
  }, [attachments]);

  const clearAttachments = useCallback(() => {
    attachments.forEach(attachment => {
      if (attachment.url) {
        URL.revokeObjectURL(attachment.url);
      }
    });
    setAttachments([]);
    setUploadProgress({});
  }, [attachments]);

  return {
    attachments,
    uploadProgress,
    handleFileSelect,
    simulateUpload,
    handleRemoveAttachment,
    clearAttachments,
    formatFileSize,
  };
};