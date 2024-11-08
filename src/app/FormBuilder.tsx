import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

const inputTypes = ['text', 'email', 'number', 'dropdown', 'radio', 'checkbox'] as const;

type QuestionType = typeof inputTypes[number];

interface Question {
  id: number;
  label: string;
  type: QuestionType;
  options: string[];
}

interface FormData {
  questions: { [key: string]: any };
}

const FormBuilder: React.FC = () => {
  const { handleSubmit, control, register } = useForm<FormData>();
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), label: '', type: 'text', options: [] }]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleTypeChange = (id: number, type: QuestionType) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, type, options: type === 'dropdown' || type === 'radio' ? [''] : [] } : q
      )
    );
  };

  const handleAddOption = (id: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, options: [...q.options, ''] } : q
      )
    );
  };

  const handleOptionChange = (id: number, index: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              options: q.options.map((opt, idx) => (idx === index ? value : opt)),
            }
          : q
      )
    );
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Dynamic Form Builder</h2>
      
      {questions.map((question, qIndex) => (
        <div key={question.id} style={{ marginBottom: '20px' }}>
          <input
            {...register(`questions.${question.id}.label` as const)}
            placeholder="Question"
            onChange={(e) => {
              const label = e.target.value;
              setQuestions(
                questions.map((q) => (q.id === question.id ? { ...q, label } : q))
              );
            }}
          />

          <select
            {...register(`questions.${question.id}.type` as const)}
            value={question.type}
            onChange={(e) => handleTypeChange(question.id, e.target.value as QuestionType)}
          >
            {inputTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {question.type === 'text' || question.type === 'email' || question.type === 'number' ? (
            <Controller
              name={`questions.${question.id}.value` as const}
              control={control}
              render={({ field }) => (
                <input type={question.type} placeholder={question.label} {...field} />
              )}
            />
          ) : null}

          {question.type === 'dropdown' && (
            <>
              {question.options.map((option, idx) => (
                <div key={idx}>
                  <input
                    placeholder={`Option ${idx + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(question.id, idx, e.target.value)}
                  />
                </div>
              ))}
              <button type="button" onClick={() => handleAddOption(question.id)}>
                Add Option
              </button>
              <Controller
                name={`questions.${question.id}.value` as const}
                control={control}
                render={({ field }) => (
                  <select {...field}>
                    {question.options.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              />
            </>
          )}

          {question.type === 'radio' && (
            <>
              {question.options.map((option, idx) => (
                <div key={idx}>
                  <input
                    placeholder={`Option ${idx + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(question.id, idx, e.target.value)}
                  />
                </div>
              ))}
              <button type="button" onClick={() => handleAddOption(question.id)}>
                Add Option
              </button>
              <Controller
  name={`questions.${question.id}.value` as const}
  control={control}
  render={({ field }) => (
    <>
      {question.options.map((opt, idx) => (
        <label key={idx}>
          <input
            type="radio"
            {...field}
            checked={field.value === opt} // Check if the option matches the current field value
          />
          {opt}
        </label>
      ))}
    </>
  )}
/>

            </>
          )}

          {question.type === 'checkbox' && (
            <Controller
              name={`questions.${question.id}.value` as const}
              control={control}
              render={({ field }) => (
                <input type="checkbox" {...field} />
              )}
            />
          )}

          <button type="button" onClick={() => removeQuestion(question.id)}>
            Remove Question
          </button>
        </div>
      ))}

      <button type="button" onClick={addQuestion}>
        Add Question
      </button>
      
      <button type="submit">Submit Form</button>
    </form>
  );
};

export default FormBuilder;
