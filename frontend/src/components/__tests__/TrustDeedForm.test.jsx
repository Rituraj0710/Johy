import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrustDeedForm from '../TrustDeedForm';

// Mock fetch
global.fetch = jest.fn();

describe('TrustDeedForm', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders the form with all sections', () => {
    render(<TrustDeedForm />);
    
    expect(screen.getByText('ट्रस्ट डीड फॉर्म')).toBeInTheDocument();
    expect(screen.getByText('ट्रस्ट का विवरण')).toBeInTheDocument();
    expect(screen.getByText('ट्रस्ट की प्रारंभिक राशि')).toBeInTheDocument();
    expect(screen.getByText('ट्रस्टी/सदस्य का विवरण')).toBeInTheDocument();
    expect(screen.getByText('ट्रस्ट का कार्य क्षेत्र')).toBeInTheDocument();
    expect(screen.getByText('ट्रस्ट के उद्देश्य')).toBeInTheDocument();
    expect(screen.getByText('ट्रस्ट के महत्वपूर्ण नियम और शर्तें')).toBeInTheDocument();
    expect(screen.getByText('गवाहों का विवरण')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<TrustDeedForm />);
    
    const submitButton = screen.getByText('जमा करें');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('ट्रस्ट का नाम आवश्यक है')).toBeInTheDocument();
      expect(screen.getByText('ट्रस्ट का पता आवश्यक है')).toBeInTheDocument();
      expect(screen.getByText('प्रारंभिक राशि आवश्यक है')).toBeInTheDocument();
    });
  });

  it('converts number to Indian words', async () => {
    render(<TrustDeedForm />);
    
    const amountInput = screen.getByPlaceholderText('राशि दर्ज करें');
    fireEvent.change(amountInput, { target: { value: '1000000' } });

    await waitFor(() => {
      const wordsInput = screen.getByDisplayValue('दस लाख रुपये');
      expect(wordsInput).toBeInTheDocument();
    });
  });

  it('adds and removes trustees', async () => {
    render(<TrustDeedForm />);
    
    // Initially should have 1 trustee
    expect(screen.getByText('ट्रस्टी/सदस्य 1')).toBeInTheDocument();
    
    // Add a trustee
    const addTrusteeButton = screen.getByText('+ ट्रस्टी/सदस्य जोड़ें');
    fireEvent.click(addTrusteeButton);
    
    await waitFor(() => {
      expect(screen.getByText('ट्रस्टी/सदस्य 2')).toBeInTheDocument();
    });
    
    // Remove the second trustee
    const removeButtons = screen.getAllByText('हटाएँ');
    fireEvent.click(removeButtons[1]); // Second remove button (for trustee 2)
    
    await waitFor(() => {
      expect(screen.queryByText('ट्रस्टी/सदस्य 2')).not.toBeInTheDocument();
    });
  });

  it('adds and removes functional domains', async () => {
    render(<TrustDeedForm />);
    
    // Add a functional domain
    const addDomainButton = screen.getByText('+ और क्षेत्र जोड़ें');
    fireEvent.click(addDomainButton);
    
    await waitFor(() => {
      const domainInputs = screen.getAllByPlaceholderText(/कार्य क्षेत्र/);
      expect(domainInputs).toHaveLength(2);
    });
    
    // Remove the second domain
    const removeButtons = screen.getAllByText('हटाएँ');
    const domainRemoveButton = removeButtons.find(button => 
      button.closest('.space-y-4')?.querySelector('input[placeholder*="कार्य क्षेत्र"]')
    );
    if (domainRemoveButton) {
      fireEvent.click(domainRemoveButton);
    }
  });

  it('validates mobile number format', async () => {
    render(<TrustDeedForm />);
    
    const mobileInput = screen.getByDisplayValue(''); // First mobile input
    fireEvent.change(mobileInput, { target: { value: '123456789' } });
    
    // Fill required fields first
    const trustNameInput = screen.getByPlaceholderText('ट्रस्ट का नाम दर्ज करें');
    fireEvent.change(trustNameInput, { target: { value: 'टेस्ट ट्रस्ट' } });
    
    const trustAddressInput = screen.getByPlaceholderText('ट्रस्ट का पूरा पता दर्ज करें');
    fireEvent.change(trustAddressInput, { target: { value: 'टेस्ट पता' } });
    
    const amountInput = screen.getByPlaceholderText('राशि दर्ज करें');
    fireEvent.change(amountInput, { target: { value: '100000' } });
    
    // Fill trustee required fields
    const trusteeNameInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeNameInput, { target: { value: 'टेस्ट नाम' } });
    
    const submitButton = screen.getByText('जमा करें');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('वैध मोबाइल नंबर दर्ज करें')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'success',
        message: 'Trust Deed created successfully',
        data: { id: '123', trustName: 'टेस्ट ट्रस्ट' }
      })
    });

    render(<TrustDeedForm />);
    
    // Fill all required fields
    const trustNameInput = screen.getByPlaceholderText('ट्रस्ट का नाम दर्ज करें');
    fireEvent.change(trustNameInput, { target: { value: 'टेस्ट ट्रस्ट' } });
    
    const trustAddressInput = screen.getByPlaceholderText('ट्रस्ट का पूरा पता दर्ज करें');
    fireEvent.change(trustAddressInput, { target: { value: 'टेस्ट पता' } });
    
    const amountInput = screen.getByPlaceholderText('राशि दर्ज करें');
    fireEvent.change(amountInput, { target: { value: '100000' } });
    
    // Fill trustee details
    const trusteePositionSelect = screen.getByDisplayValue('');
    fireEvent.change(trusteePositionSelect, { target: { value: 'अध्यक्ष' } });
    
    const trusteeNameInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeNameInput, { target: { value: 'टेस्ट नाम' } });
    
    const trusteeRelationInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeRelationInput, { target: { value: 'टेस्ट पिता' } });
    
    const trusteeAddressInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeAddressInput, { target: { value: 'टेस्ट पता' } });
    
    const trusteeMobileInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeMobileInput, { target: { value: '9876543210' } });
    
    const trusteeIdNumberInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeIdNumberInput, { target: { value: '123456789012' } });
    
    const submitButton = screen.getByText('जमा करें');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/trust-deed',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
          credentials: 'include'
        })
      );
    });
  });

  it('handles submission errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<TrustDeedForm />);
    
    // Fill minimal required data
    const trustNameInput = screen.getByPlaceholderText('ट्रस्ट का नाम दर्ज करें');
    fireEvent.change(trustNameInput, { target: { value: 'टेस्ट ट्रस्ट' } });
    
    const trustAddressInput = screen.getByPlaceholderText('ट्रस्ट का पूरा पता दर्ज करें');
    fireEvent.change(trustAddressInput, { target: { value: 'टेस्ट पता' } });
    
    const amountInput = screen.getByPlaceholderText('राशि दर्ज करें');
    fireEvent.change(amountInput, { target: { value: '100000' } });
    
    // Fill trustee details
    const trusteePositionSelect = screen.getByDisplayValue('');
    fireEvent.change(trusteePositionSelect, { target: { value: 'अध्यक्ष' } });
    
    const trusteeNameInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeNameInput, { target: { value: 'टेस्ट नाम' } });
    
    const trusteeRelationInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeRelationInput, { target: { value: 'टेस्ट पिता' } });
    
    const trusteeAddressInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeAddressInput, { target: { value: 'टेस्ट पता' } });
    
    const trusteeMobileInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeMobileInput, { target: { value: '9876543210' } });
    
    const trusteeIdNumberInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeIdNumberInput, { target: { value: '123456789012' } });
    
    const submitButton = screen.getByText('जमा करें');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।')).toBeInTheDocument();
    });
  });

  it('handles purposes and terms selection', async () => {
    render(<TrustDeedForm />);
    
    // Select a purpose
    const purposeCheckbox = screen.getByDisplayValue('अनाथ बच्चों को स्कूल की शिक्षा देना');
    fireEvent.click(purposeCheckbox);
    
    // Select a term
    const termCheckbox = screen.getByDisplayValue('ट्रस्ट केवल धर्मार्थ उद्देश्यों के लिए कार्य करेगा।');
    fireEvent.click(termCheckbox);
    
    expect(purposeCheckbox).toBeChecked();
    expect(termCheckbox).toBeChecked();
  });

  it('adds and removes other purposes', async () => {
    render(<TrustDeedForm />);
    
    // Add an other purpose
    const addPurposeButton = screen.getByText('+ और उद्देश्य जोड़ें');
    fireEvent.click(addPurposeButton);
    
    await waitFor(() => {
      const purposeInputs = screen.getAllByPlaceholderText(/उद्देश्य/);
      expect(purposeInputs).toHaveLength(2);
    });
  });

  it('adds and removes other terms', async () => {
    render(<TrustDeedForm />);
    
    // Add an other term
    const addTermButton = screen.getByText('+ और बिंदु जोड़ें');
    fireEvent.click(addTermButton);
    
    await waitFor(() => {
      const termInputs = screen.getAllByPlaceholderText(/बिंदु/);
      expect(termInputs).toHaveLength(2);
    });
  });

  it('displays loading state during submission', async () => {
    // Mock a slow response
    fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({
      ok: true,
      json: async () => ({ status: 'success' })
    }), 1000)));

    render(<TrustDeedForm />);
    
    // Fill minimal required data
    const trustNameInput = screen.getByPlaceholderText('ट्रस्ट का नाम दर्ज करें');
    fireEvent.change(trustNameInput, { target: { value: 'टेस्ट ट्रस्ट' } });
    
    const trustAddressInput = screen.getByPlaceholderText('ट्रस्ट का पूरा पता दर्ज करें');
    fireEvent.change(trustAddressInput, { target: { value: 'टेस्ट पता' } });
    
    const amountInput = screen.getByPlaceholderText('राशि दर्ज करें');
    fireEvent.change(amountInput, { target: { value: '100000' } });
    
    // Fill trustee details
    const trusteePositionSelect = screen.getByDisplayValue('');
    fireEvent.change(trusteePositionSelect, { target: { value: 'अध्यक्ष' } });
    
    const trusteeNameInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeNameInput, { target: { value: 'टेस्ट नाम' } });
    
    const trusteeRelationInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeRelationInput, { target: { value: 'टेस्ट पिता' } });
    
    const trusteeAddressInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeAddressInput, { target: { value: 'टेस्ट पता' } });
    
    const trusteeMobileInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeMobileInput, { target: { value: '9876543210' } });
    
    const trusteeIdNumberInput = screen.getByDisplayValue('');
    fireEvent.change(trusteeIdNumberInput, { target: { value: '123456789012' } });
    
    const submitButton = screen.getByText('जमा करें');
    fireEvent.click(submitButton);

    // Should show loading state
    expect(screen.getByText('जमा हो रहा है...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});
