'use client';
import React, { useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";

// Define types for the form field structure
interface InputField {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time' |
  'datetime-local' | 'month' | 'week' | 'color' | 'file' | 'checkbox' | 'radio' |
  'range' | 'hidden' | 'button' | 'submit' | 'reset' | 'image' | 'search' | 'dropdown';
  label: string;
  mess: string;
  options?: string[]; // options are optional for dropdown, checkbox, and radio
}

export default function Home() {
  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>();
  const [inputFields, setInputFields] = useState<InputField[]>([]);
  const [newField, setNewField] = useState<InputField>({
    name: "",
    type: "text",
    label: "",
    mess: "",
    options: [],
  });
  console.log(inputFields);
  console.log(newField);

  const handleAddField = () => {
    // Ensure options is an array for dropdown, checkbox, and radio types
    const optionsArray = Array.isArray(newField.options) ? newField.options : [];
    setInputFields([...inputFields, { ...newField, options: optionsArray }]);
    setNewField({ name: "", type: "text", label: "", mess: "", options: [] });
  };

  const onSubmit: SubmitHandler<FieldValues> = (formData) => {
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div>
      {
        // JSON.stringify(formData)
      }
      <h2>User Form</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {inputFields.map((field) => (
          <div key={field.name} style={{ marginBottom: '16px' }}>
            <label>{field.label}</label>
            {['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local',
              'month', 'week', 'color', 'file', 'hidden', 'range', 'search'].includes(field.type) ? (
              <input
                type={field.type}
                {...register(field.name, { required: field.mess })}
                placeholder={field.label}
              />
            ) : field.type === 'dropdown' ? (
              <select {...register(field.name, { required: field.mess })}>
                <option value="">Select {field.label}</option>
                {field.options?.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' || field.type === 'radio' ? (
              field.options?.map((option, idx) => (
                <div key={idx}>
                  <input
                    type={field.type}
                    value={option}
                    {...register(field.name, { required: field.mess })}
                  />
                  <label>{option}</label>
                </div>
              ))
            ) : field.type === 'button' || field.type === 'submit' || field.type === 'reset' ? (
              <button type={field.type}>{field.label}</button>
            ) : field.type === 'image' ? (
              <input
                type="image"
                src={field.label} // Use label as the image URL
                alt={field.name}
              />
            ) : null}
            {errors[field.name] && (
              <p style={{ color: 'red' }}>{String(errors[field.name]?.message)}</p>
            )}

          </div>
        ))}
        <button type="submit">Submit</button>
      </form>

      {/* Form to add a new field */}
      <div style={{ marginTop: '20px' }}>
        <h3>Add New Field</h3>
        <input
          placeholder="Name"
          value={newField.name}
          onChange={(e) => setNewField({ ...newField, name: e.target.value })}
        />
        <select
          value={newField.type}
          onChange={(e) =>
            setNewField({ ...newField, type: e.target.value as InputField['type'] })
          }
        >
          {[
            "text", "email", "password", "number", "tel", "url", "date", "time",
            "datetime-local", "month", "week", "color", "file", "checkbox", "radio",
            "range", "hidden", "button", "submit", "reset", "image", "search", "dropdown"
          ].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <input
          placeholder="Label"
          value={newField.label}
          onChange={(e) => setNewField({ ...newField, label: e.target.value })}
        />
        <input
          placeholder="Validation Message"
          value={newField.mess}
          onChange={(e) => setNewField({ ...newField, mess: e.target.value })}
        />
        {['dropdown', 'checkbox', 'radio'].includes(newField.type) && (
          <input
            placeholder="Options (comma-separated)"
            value={newField.options?.join(',')}
            onChange={(e) => setNewField({ ...newField, options: e.target.value.split(',').map(opt => opt.trim()) })}
          />
        )}
        <button onClick={handleAddField}>Add Field</button>
      </div>
    </div>
  );
}
