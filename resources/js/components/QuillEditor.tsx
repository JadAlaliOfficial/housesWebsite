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

  const transformLists = (html: string): string => {
    if (!html) return html;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Process ordered lists
    const olElements = doc.querySelectorAll('ol');
    olElements.forEach(ol => {
      ol.className = 'list-decimal pl-5 my-4';
      const liElements = ol.querySelectorAll('li');
      liElements.forEach((li, index) => {
        li.className = index === liElements.length - 1 ? '' : 'mb-2';
      });
    });
    
    // Process unordered lists
    const ulElements = doc.querySelectorAll('ul');
    ulElements.forEach(ul => {
      ul.className = 'list-disc pl-5 my-4';
      const liElements = ul.querySelectorAll('li');
      liElements.forEach((li, index) => {
        li.className = index === liElements.length - 1 ? '' : 'mb-2';
      });
    });

    return doc.body.innerHTML;
  };

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean']
          ]
        }
      });

      quillRef.current.on('text-change', () => {
        const content = quillRef.current?.root.innerHTML || '';
        const transformedContent = transformLists(content);
        onChange(transformedContent);
      });

      if (value) {
        const transformedValue = transformLists(value);
        quillRef.current.root.innerHTML = transformedValue;
      }
    }
  }, []);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      const transformedValue = transformLists(value);
      quillRef.current.root.innerHTML = transformedValue;
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