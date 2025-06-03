import { Editor } from '@tinymce/tinymce-react';
import React from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  className,
  height = 300,
}) => {
  return (
    <div className={className}>
      <Editor
        apiKey="js9oegx99zudh4s224vdodu4unn5ym0fhb7eziska9vc5qbe" // You may need to get an API key from TinyMCE
        value={value}
        onEditorChange={(newValue) => onChange(newValue)}
        init={{
          height,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          placeholder: placeholder,
          skin: document.documentElement.classList.contains('dark') ? 'oxide-dark' : 'oxide',
          content_css: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
        }}
      />
    </div>
  );
};

export default RichTextEditor;