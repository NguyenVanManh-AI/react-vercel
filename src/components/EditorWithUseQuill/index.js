import React, { useEffect, useState, useCallback } from 'react';
import { useQuill } from 'react-quilljs';
import BlotFormatter from 'quill-blot-formatter';
import 'quill/dist/quill.snow.css';

const Editor = ({ onContentChange, clearContent, description, onContentChangeEdit }) => {
    const { quill, quillRef, Quill } = useQuill({
        modules: { blotFormatter: {} }
    });

    const [htmlContent, setHtmlContent] = useState('');
    const [htmlContentEdit, setHtmlContentEdit] = useState('');

    if (Quill && !quill) {
        Quill.register('modules/blotFormatter', BlotFormatter);
    }

    // Add
    useEffect(() => {
        if (quill) {
            quill.on('text-change', (delta, oldContents) => {
                let currrentContents = quill.getContents();
                const newHtmlContent = quill.root.innerHTML;
                setHtmlContent(newHtmlContent);

                // Callback to the parent component to pass the HTML content
                if (onContentChange) {
                    onContentChange(newHtmlContent);
                }
            });
        }
    }, [quill, Quill, onContentChange]);

    // Clear content
    useEffect(() => {
        if (clearContent && quill) {
            quill.setText('');
        }
    }, [clearContent, quill]);

    // Edit
    useEffect(() => {
        if (quill && description) {
            quill.clipboard.dangerouslyPasteHTML(description);
        }
    }, [description, quill]);

    useEffect(() => {
        if (quill) {
            quill.on('text-change', (delta, oldContents) => {
                let currrentContents = quill.getContents();
                const newHtmlContent = quill.root.innerHTML;
                setHtmlContentEdit(newHtmlContent);
                if (onContentChangeEdit) {
                    onContentChangeEdit(newHtmlContent);
                }
            });
        }
    }, [quill, Quill, onContentChangeEdit]);

    return (
        <div>
            <div ref={quillRef} />
        </div>
    );
};

export default Editor;
