import React, { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';

interface QuillEditorProps {
  name: string;
  value: string;
  onChange: (content: string) => void;
  className?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ 
  name, 
  value, 
  onChange, 
  className = '' 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            // [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean']
          ]
        }
      });

      quillRef.current.on('text-change', () => {
        const content = quillRef.current?.root.innerHTML || '';
        onChange(content);
      });

      if (value) {
        quillRef.current.root.innerHTML = value;
      }
    }
  }, []);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div className={className}>
      <div ref={editorRef} style={{ height: '300px' }} />
      <input type="hidden" name={name} value={value} />
    </div>
  );
};

export default QuillEditor;