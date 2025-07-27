import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import '../styles/page-layout.css';
import './NewTermPage.css';

const NewTermPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchTerm, addCustomTerm, setSearchTerm, terms } = useAppContext();
  const [termName, setTermName] = useState(searchTerm || '');
  const [definition, setDefinition] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Helper function to check if the term already exists
  const termExists = (term: string): boolean => {
    if (!term) return false;
    return terms.some(existingTerm => 
      existingTerm.word.toLowerCase() === term.toLowerCase()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!termName.trim()) {
      setError('Term name is required');
      return;
    }

    if (termExists(termName.trim())) {
      setError('This term already exists');
      return;
    }

    const termToAdd = termName.trim();
    const definitionToAdd = definition.trim() || '';
    
    addCustomTerm(termToAdd, definitionToAdd);
    setSearchTerm(termToAdd);
    setSuccess('Term added successfully!');
    
    // Clear form
    setTermName('');
    setDefinition('');
    
    // Redirect to home page after a short delay
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="page-layout">
      <h1>Add a New Term</h1>
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div className="section">
            <div className="title">Term Information</div>
            <div className="item">
              <div className="form-group">
                <label htmlFor="term-name">Term Name *</label>
                <input
                  type="text"
                  id="term-name"
                  value={termName}
                  onChange={(e) => setTermName(e.target.value)}
                  placeholder="Enter the term name"
                  required
                  autoFocus
                />
              </div>
            </div>
            <div className="item">
              <div className="form-group">
                <label htmlFor="definition">Definition (optional)</label>
                <textarea
                  id="definition"
                  value={definition}
                  onChange={(e) => setDefinition(e.target.value)}
                  placeholder="Enter a definition for this term"
                  rows={4}
                />
              </div>
            </div>
            {error && (
              <div className="item">
                <div className="error-message">{error}</div>
              </div>
            )}
            {success && (
              <div className="item">
                <div className="success-message">{success}</div>
              </div>
            )}
            <div className="item">
              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add Term
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTermPage;

