import { useEffect, useRef, useState, useMemo } from 'react';

const ApperFileFieldComponent = ({ config, elementId }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(false);
  const elementIdRef = useRef(elementId);
  const existingFilesRef = useRef([]);

  // Update elementId ref when it changes
  useEffect(() => {
    elementIdRef.current = elementId;
  }, [elementId]);

  // Memoize existing files to prevent unnecessary re-renders
  const memoizedExistingFiles = useMemo(() => {
    if (!config?.existingFiles) return [];
    
    // Check if files have actually changed
    const currentFiles = config.existingFiles;
    const previousFiles = existingFilesRef.current;
    
    if (currentFiles.length !== previousFiles.length) return currentFiles;
    if (currentFiles.length === 0) return [];
    
    // Check first file's ID to see if different files
    const currentFirstId = currentFiles[0]?.Id || currentFiles[0]?.id;
    const previousFirstId = previousFiles[0]?.Id || previousFiles[0]?.id;
    
    return currentFirstId !== previousFirstId ? currentFiles : previousFiles;
  }, [config?.existingFiles]);

  // Initial mount effect
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        let attempts = 0;
        const maxAttempts = 50;
        
        // Wait for ApperSDK to load
        while (!window.ApperSDK && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        if (!window.ApperSDK) {
          throw new Error('ApperSDK not loaded after 5 seconds');
        }
        
        const { ApperFileUploader } = window.ApperSDK;
        elementIdRef.current = `file-uploader-${elementId}`;
        
        await ApperFileUploader.FileField.mount(elementIdRef.current, {
          ...config,
          existingFiles: memoizedExistingFiles
        });
        
        mountedRef.current = true;
        existingFilesRef.current = memoizedExistingFiles;
        setIsReady(true);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize file uploader:', err);
        setError(err.message);
      }
    };

    initializeSDK();

    // Cleanup
    return () => {
      try {
        if (window.ApperSDK?.ApperFileUploader && mountedRef.current) {
          window.ApperSDK.ApperFileUploader.FileField.unmount(elementIdRef.current);
        }
        mountedRef.current = false;
        setIsReady(false);
      } catch (err) {
        console.error('Failed to unmount file uploader:', err);
      }
    };
  }, [elementId, config.fieldKey, config.tableName]);

  // File update effect
  useEffect(() => {
    if (!isReady || !window.ApperSDK || !config.fieldKey) return;

    // Deep equality check with JSON.stringify
    const currentFilesStr = JSON.stringify(memoizedExistingFiles);
    const previousFilesStr = JSON.stringify(existingFilesRef.current);
    
    if (currentFilesStr === previousFilesStr) return;

    try {
      const { ApperFileUploader } = window.ApperSDK;
      
      // Format detection - check for .Id vs .id property
      const needsFormatConversion = memoizedExistingFiles.length > 0 && 
        memoizedExistingFiles[0].hasOwnProperty('Id');
      
      let filesToUpdate = memoizedExistingFiles;
      if (needsFormatConversion) {
        filesToUpdate = ApperFileUploader.toUIFormat(memoizedExistingFiles);
      }
      
      if (filesToUpdate.length > 0) {
        ApperFileUploader.FileField.updateFiles(config.fieldKey, filesToUpdate);
      } else {
        ApperFileUploader.FileField.clearField(config.fieldKey);
      }
      
      existingFilesRef.current = memoizedExistingFiles;
    } catch (err) {
      console.error('Failed to update files:', err);
      setError(err.message);
    }
  }, [memoizedExistingFiles, isReady, config.fieldKey]);

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-md bg-red-50">
        <p className="text-red-800">Error loading file uploader: {error}</p>
      </div>
    );
  }

  return (
    <div className="file-uploader-container">
      <div id={`file-uploader-${elementId}`} className="w-full">
        {!isReady && (
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-gray-600">Loading file uploader...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApperFileFieldComponent;